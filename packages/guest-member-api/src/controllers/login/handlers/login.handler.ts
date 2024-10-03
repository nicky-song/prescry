// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { ILoginRequestBody } from '@phx/common/src/models/api-request-body/login.request-body';
import { IConfiguration } from '../../../configuration';
import {
  HttpStatusCodes,
  InternalErrorCode,
  InternalResponseCode,
} from '../../../constants/error-codes';
import {
  ErrorConstants,
  LoginMessages,
} from '../../../constants/response-messages';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { trackActivationPersonFailureEvent } from '../../../utils/custom-event-helper';
import {
  KnownFailureResponse,
  SuccessResponseWithoutHeaders,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { existingAccountHelper } from '../helpers/existing-account.helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { membershipVerificationHelper } from '../../members/helpers/membership-verification.helper';
import { loginSuccessResponse } from '../helpers/login-response.helper';
import {
  publishPersonUpdatePatientDetailsMessage,
  publishPhoneNumberVerificationMessage,
} from '../../../utils/service-bus/person-update-helper';
import { getAllRecordsForLoggedInPerson } from '../../../utils/person/get-logged-in-person.helper';
import { createCashProfileAndAddToRedis } from '../../../utils/person/create-cash-profile-and-add-to-redis';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { getAllPendingPrescriptionsByIdentifierFromMessageEnvelope } from '../../../databases/mongo-database/v1/query-helper/pending-prescriptions.query-helper';
import { IMessageEnvelope } from '@phx/common/src/models/message-envelope';
import dateFormat from 'dateformat';
import { trackClaimAlertUnauthorizeFailureEvent } from '../../../utils/claim-alert.custom-event.helper';
import { IUpdatePrescriptionParams } from '../../prescription/helpers/update-prescriptions-with-member-id';
import { verifyActivationRecord } from '../../../utils/verify-activation-record';
import { addPhoneRegistrationKeyInRedis } from '../../../databases/redis/redis-query-helper';
import {
  IPrescriptionVerificationInfo,
  verifyPrescriptionInfoHelper,
} from '../../prescription/helpers/verify-prescription-info.helper';
import {
  findCashProfile,
  findPbmProfile,
} from '../../../utils/person/find-profile.helper';
import { IAppLocals } from '../../../models/app-locals';
import { processNewAccountOnLogin } from '../helpers/process-new-account-on-login';
import { RequestError } from '../../../errors/request-errors/request.error';
import { validateRequestAge } from '../../../utils/request/validate-request-age';
import { membershipVerificationHelperV2 } from '../../members/helpers/membership-verification-v2.helper';
import { generatePrimaryMemberFamilyId } from '../../../utils/person/person-creation.helper';
import { assertHasFamilyId } from '../../../assertions/assert-has-family-id';
import { addMembershipPlan } from '../../members/helpers/add-membership-link.helper';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function loginHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration,
) {
  const version = getEndpointVersion(request);
  const isV2Endpoint = version === 'v2';

  const {
    firstName,
    lastName,
    primaryMemberRxId,
    dateOfBirth,
    accountRecoveryEmail: recoveryEmail,
    prescriptionId,
    claimAlertId,
    isBlockchain,
  } = request.body as ILoginRequestBody;

  try {
    const phoneNumber = getRequiredResponseLocal(response, 'device').data;
    const isoDateOfBirth = dateFormat(dateOfBirth, 'yyyy-mm-dd');
    let firstNameToUse = firstName.trim().toUpperCase();
    let lastNameToUse = lastName.trim().toUpperCase();
    let addressToUse: IMemberAddress | undefined;
    let updatePrescriptionParams: IUpdatePrescriptionParams | undefined;
    let masterId: string | undefined;
    let accountId: string | undefined;

    const { childMemberAgeLimit, redisPhoneNumberRegistrationKeyExpiryTime } =
      configuration;

    validateRequestAge(
      dateOfBirth,
      childMemberAgeLimit,
      firstNameToUse,
      lastNameToUse,
      primaryMemberRxId
    );

    const personList = await getAllRecordsForLoggedInPerson(
      database,
      phoneNumber
    );

    if (prescriptionId) {
      const verificationInfo: IPrescriptionVerificationInfo = {
        prescriptionId,
        firstName,
        dateOfBirth: isoDateOfBirth,
      };
      const verifyPrescriptionHelperResponse =
        await verifyPrescriptionInfoHelper(
          database,
          verificationInfo,
          configuration,
          personList,
          isBlockchain
        );

      if (!verifyPrescriptionHelperResponse.prescriptionIsValid) {
        return KnownFailureResponse(
          response,
          verifyPrescriptionHelperResponse.errorCode ??
            HttpStatusCodes.INTERNAL_SERVER_ERROR,
          verifyPrescriptionHelperResponse.errorMessage ??
            ErrorConstants.INTERNAL_SERVER_ERROR
        );
      }
      const prescriptionPhoneNumber =
        verifyPrescriptionHelperResponse.filteredUserInfo?.telephone;

      if (prescriptionPhoneNumber !== phoneNumber) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.UNAUTHORIZED_REQUEST,
          ErrorConstants.PRESCRIPTION_TELEPHONE_DOES_NOT_MATCH
        );
      }
      lastNameToUse =
        verifyPrescriptionHelperResponse.filteredUserInfo?.lastName?.toUpperCase() ??
        lastNameToUse;
      addressToUse = verifyPrescriptionHelperResponse.filteredUserInfo?.address;
      updatePrescriptionParams =
        verifyPrescriptionHelperResponse.filteredUserInfo
          ?.updatePrescriptionParams;
      masterId = verifyPrescriptionHelperResponse.filteredUserInfo?.masterId;
      accountId = verifyPrescriptionHelperResponse.filteredUserInfo?.masterId;
    }

    if (claimAlertId) {
      const modelsFound: IMessageEnvelope[] | null =
        await getAllPendingPrescriptionsByIdentifierFromMessageEnvelope(
          claimAlertId,
          database
        );
      if (modelsFound && modelsFound.length) {
        const filteredPrescription = modelsFound.filter((prescription) => {
          return prescription.notificationTarget.trim() === phoneNumber.trim();
        });
        if (!filteredPrescription.length) {
          trackClaimAlertUnauthorizeFailureEvent(
            firstNameToUse,
            lastNameToUse,
            dateOfBirth,
            phoneNumber,
            claimAlertId,
            modelsFound[0].notificationTarget.trim()
          );
          return KnownFailureResponse(
            response,
            HttpStatusCodes.BAD_REQUEST,
            ErrorConstants.UNAUTHORIZED_ACCESS,
            undefined,
            InternalErrorCode.UNAUTHORIZED_ACCESS_PHONE_NUMBER_MISMATCHED
          );
        }
      }
    }
    const activationRecordStatus = await verifyActivationRecord(
      database,
      phoneNumber,
      firstName,
      isoDateOfBirth,
      primaryMemberRxId,
      configuration,
      version
    );

    if (!activationRecordStatus.isValid) {
      const eventNameAndId = claimAlertId
        ? { eventName: 'LOGIN_CLAIM_ALERT_FAILURE', id: claimAlertId }
        : prescriptionId
        ? { eventName: 'LOGIN_PRESCRIPTION_FAILURE', id: prescriptionId }
        : primaryMemberRxId
        ? { eventName: 'LOGIN_PBM_ACTIVATE_FLOW', id: primaryMemberRxId }
        : { eventName: 'LOGIN_HANDLER_FAILURE', id: undefined };

      trackActivationPersonFailureEvent(
        eventNameAndId.eventName,
        activationRecordStatus.activationRecord?.firstName ?? '',
        activationRecordStatus.activationRecord?.dateOfBirth ?? '',
        phoneNumber,
        firstName,
        dateOfBirth,
        eventNameAndId.id
      );
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.ACCOUNT_CREATION_ACTIVATION_PERSON_RECORD_DATA_MISMATCH,
        undefined,
        InternalResponseCode.ACTIVATION_PERSON_DATA_MISMATCH
      );
    }
    if (activationRecordStatus.activationRecord) {
      firstNameToUse = activationRecordStatus.activationRecord?.firstName;
      lastNameToUse = activationRecordStatus.activationRecord?.lastName;
      await publishPhoneNumberVerificationMessage(
        activationRecordStatus.activationRecord?.identifier,
        phoneNumber
      );
      if (
        updatePrescriptionParams &&
        !updatePrescriptionParams.clientPatientId.length
      ) {
        updatePrescriptionParams.clientPatientId =
          activationRecordStatus.activationRecord.primaryMemberRxId;
      }
    }
    const cashProfile = findCashProfile(personList);

    if (primaryMemberRxId) {
      const verifyMembershipHelperResponse = isV2Endpoint
        ? await membershipVerificationHelperV2(
            database,
            phoneNumber,
            firstNameToUse,
            lastNameToUse,
            isoDateOfBirth,
            primaryMemberRxId,
            configuration
          )
        : await membershipVerificationHelper(
            database,
            phoneNumber,
            firstNameToUse,
            lastNameToUse,
            isoDateOfBirth,
            primaryMemberRxId
          );

      if (!verifyMembershipHelperResponse.isValidMembership) {
        const internalResponseCode =
          verifyMembershipHelperResponse.responseMessage ===
          ErrorConstants.ACCOUNT_PERSON_DATA_MISMATCH
            ? InternalResponseCode.ACCOUNT_PERSON_DATA_MISMATCH
            : verifyMembershipHelperResponse.responseMessage ===
              ErrorConstants.ACCOUNT_CREATION_ACTIVATION_PERSON_RECORD_DATA_MISMATCH
            ? InternalResponseCode.ACTIVATION_PERSON_DATA_MISMATCH
            : undefined;
        return KnownFailureResponse(
          response,
          verifyMembershipHelperResponse.responseCode ??
            HttpStatusCodes.INTERNAL_SERVER_ERROR,
          verifyMembershipHelperResponse.responseMessage ?? '',
          undefined,
          internalResponseCode
        );
      }
      if (!verifyMembershipHelperResponse.member) {
        return UnknownFailureResponse(
          response,
          ErrorConstants.INTERNAL_SERVER_ERROR
        );
      }
      firstNameToUse = verifyMembershipHelperResponse.member.firstName;
      lastNameToUse = verifyMembershipHelperResponse.member.lastName;
      if (!verifyMembershipHelperResponse.member.phoneNumber) {
        await publishPhoneNumberVerificationMessage(
          verifyMembershipHelperResponse.member.identifier,
          phoneNumber
        );
        await addPhoneRegistrationKeyInRedis(
          phoneNumber,
          verifyMembershipHelperResponse.member,
          configuration.redisPhoneNumberRegistrationKeyExpiryTime
        );
      }

      if (!cashProfile) {
        const pbmProfile = findPbmProfile(personList);

        await createCashProfileAndAddToRedis(
          database,
          configuration,
          firstNameToUse,
          lastNameToUse,
          isoDateOfBirth,
          phoneNumber,
          recoveryEmail,
          addressToUse,
          masterId ?? pbmProfile?.masterId,
          accountId ?? pbmProfile?.accountId
        );
      }
      return await loginSuccessResponse(
        response,
        phoneNumber,
        firstNameToUse,
        lastNameToUse,
        isoDateOfBirth,
        redisPhoneNumberRegistrationKeyExpiryTime,
        verifyMembershipHelperResponse.member,
        false,
        recoveryEmail
      );
    }

    let familyId;

    if (isV2Endpoint) {
      familyId = !cashProfile
        ? await generatePrimaryMemberFamilyId(database, configuration)
        : cashProfile.primaryMemberFamilyId;

      assertHasFamilyId(familyId);

      const { patientAccount } = response.locals as IAppLocals;

      const proccessedPatientAccount = await processNewAccountOnLogin(
        configuration,
        patientAccount,
        {
          phoneNumber,
          firstName: firstNameToUse,
          lastName: lastNameToUse,
          isoDateOfBirth,
          email: recoveryEmail,
        },
        familyId,
        request.socket.remoteAddress,
        request.headers['user-agent']
      );

      masterId = proccessedPatientAccount?.patient?.id;
      accountId = proccessedPatientAccount?.accountId;

      if (
        activationRecordStatus.activationPatientMasterId &&
        activationRecordStatus.activationPatientMemberId &&
        proccessedPatientAccount?.patient
      ) {
        await addMembershipPlan(
          proccessedPatientAccount,
          proccessedPatientAccount.patient,
          activationRecordStatus.activationPatientMasterId,
          configuration,
          activationRecordStatus.activationPatientMemberId
        );
        if (activationRecordStatus.activationRecord && masterId && accountId) {
          await publishPersonUpdatePatientDetailsMessage(
            activationRecordStatus.activationRecord?.identifier,
            masterId,
            accountId
          );
        }
      }
    }

    await existingAccountHelper(
      database,
      phoneNumber,
      firstNameToUse,
      lastNameToUse,
      isoDateOfBirth,
      recoveryEmail,
      configuration,
      addressToUse,
      updatePrescriptionParams,
      familyId,
      masterId,
      accountId
    );

    return SuccessResponseWithoutHeaders(
      response,
      LoginMessages.AUTHENTICATION_SUCCESSFUL,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
  } catch (error) {
    if (error instanceof RequestError) {
      return KnownFailureResponse(
        response,
        error.httpCode,
        error.message,
        undefined,
        error.internalCode
      );
    }

    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}

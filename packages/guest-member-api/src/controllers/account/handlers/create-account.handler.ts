// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { Twilio } from 'twilio';
import type { ICreateAccountRequestBody } from '@phx/common/src/models/api-request-body/create-account.request-body';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IConfiguration } from '../../../configuration';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  errorResponseWithTwilioErrorHandling,
  KnownFailureResponse,
} from '../../../utils/response-helper';
import { getResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { ITermsAndConditionsWithAuthTokenAcceptance } from '../../../models/terms-and-conditions-acceptance-info';
import { buildTermsAndConditionsAcceptance } from '../../../utils/terms-and-conditions.helper';
import {
  ValidateAutomationTokenResponseType,
  validateAutomationToken,
} from '../../../utils/validate-automation-token/validate-automation-token';
import { generateDeviceToken } from '../../../utils/verify-device-helper';
import { getAllRecordsForLoggedInPerson } from '../../../utils/person/get-logged-in-person.helper';
import { buildExistingAccountResponse } from '../helpers/build-existing-account-response';
import { buildNewAccountResponse } from '../helpers/build-new-account-response';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { IPrescriptionVerificationInfo } from '../../prescription/helpers/verify-prescription-info.helper';
import { IPrescriptionVerificationResponse } from '../../prescription/helpers/verify-prescription-info.helper';
import { verifyPrescriptionInfoHelper } from '../../prescription/helpers/verify-prescription-info.helper';
import { IUpdatePrescriptionParams } from '../../prescription/helpers/update-prescriptions-with-member-id';
import dateFormat from 'dateformat';
import { verifyActivationRecord } from '../../../utils/verify-activation-record';
import RestException from 'twilio/lib/base/RestException';
import { createAccount } from '../../../utils/patient-account/create-account';
import { validateRequestAge } from '../../../utils/request/validate-request-age';
import { BadRequestError } from '../../../errors/request-errors/bad.request-error';
import { validateOneTimePassword } from '../../../utils/request/validate-one-time-password';
import {
  getMasterId,
  isPatientAccountVerified,
} from '../../../utils/patient-account/patient-account.helper';
import { generateDeviceTokenV2 } from '../../../utils/verify-device-helper-v2';
import { RequestError } from '../../../errors/request-errors/request.error';
import { IPatientAccount } from '../../../models/platform/patient-account/patient-account';
import { generatePrimaryMemberFamilyId } from '../../../utils/person/person-creation.helper';
import { validateOneTimePasswordV2 } from '../../../utils/request/validate-one-time-password.v2';
import { membershipVerificationHelperV2 } from '../../members/helpers/membership-verification-v2.helper';
import {
  addMembershipPlan,
  hasMatchingCoverage,
} from '../../members/helpers/add-membership-link.helper';
import { setPatientAccountStatusToVerified } from '../../../utils/patient-account/set-patient-account-status-to-verified';
import { setPatientAndPatientAccountIdentifiers } from '../../../utils/patient-account/set-patient-and-patient-account-identifiers';
import { updatePatientAccountPin } from '../../../utils/patient-account/update-patient-account-pin';
import { getPinDetails } from '../../../utils/patient-account/get-pin-details';
import { getPatientAccountByPhoneNumber } from '../../../utils/patient-account/get-patient-account-by-phone-number';
import { updatePatientAccountTermsAndConditionsAcceptance } from '../../../utils/patient-account/update-patient-account-terms-and-conditions-acceptance';
import { findCashProfile } from '../../../utils/person/find-profile.helper';
import { createCashCoverageRecord } from '../../../utils/coverage/create-cash-coverage-record';
import { assertHasMasterId } from '../../../assertions/assert-has-master-id';
import { assertHasAccountId } from '../../../assertions/assert-has-account-id';
import { IIdentity } from '../../../models/identity';
import type { SsoTokenPayload } from '@phx/common/src/models/sso/sso-external-jwt';
import { assertHasPatientAccount } from '../../../assertions/assert-has-patient-account';
import { assertHasPatient } from '../../../assertions/assert-has-patient';
import {
  doesPatientBirthDateMatch,
  doPatientFirstNameMatch,
} from '../../../utils/fhir-patient/patient.helper';
import { generateAccountToken } from '../../../utils/account-token.helper';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function createAccountHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration,
  twilioClient: Twilio,
  verifiedSsoRequest?: {
    tokenPayload: SsoTokenPayload;
    requestBody: ICreateAccountRequestBody;
  }
) {
  const version = getEndpointVersion(request);
  const isV2Endpoint = version === 'v2';
  const requestBody = verifiedSsoRequest
    ? verifiedSsoRequest.requestBody
    : (request.body as ICreateAccountRequestBody);
  const {
    firstName,
    lastName,
    email,
    dateOfBirth,
    phoneNumber,
    code: oneTimePassword,
    primaryMemberRxId,
    prescriptionId,
    isBlockchain,
  } = requestBody;
  const { twilioVerificationServiceId, childMemberAgeLimit } = configuration;
  const firstNameToUse = firstName.trim().toUpperCase();
  let lastNameToUse = lastName.trim().toUpperCase();
  const isoDateOfBirth = dateFormat(dateOfBirth, 'yyyy-mm-dd');
  let contactPhone: string = phoneNumber;
  let pbmMasterId: string | undefined;
  let pbmMemberId: string | undefined;
  let contactAddress: IMemberAddress | undefined;
  let updatePrescriptionParams: IUpdatePrescriptionParams | undefined;
  let masterId: string | undefined;
  try {
    const personList = await getAllRecordsForLoggedInPerson(
      database,
      contactPhone
    );

    if (prescriptionId) {
      const verificationInfo: IPrescriptionVerificationInfo = {
        prescriptionId,
        firstName: firstNameToUse,
        dateOfBirth: isoDateOfBirth,
      };
      const verifyPrescriptionHelperResponse: IPrescriptionVerificationResponse =
        await verifyPrescriptionInfoHelper(
          database,
          verificationInfo,
          configuration,
          personList,
          isBlockchain
        );

      if (!verifyPrescriptionHelperResponse.prescriptionIsValid) {
        throw new RequestError(
          verifyPrescriptionHelperResponse.errorCode ??
            HttpStatusCodes.INTERNAL_SERVER_ERROR,
          verifyPrescriptionHelperResponse.errorMessage ??
            ErrorConstants.INTERNAL_SERVER_ERROR
        );
      }

      if (!verifyPrescriptionHelperResponse.filteredUserInfo?.telephone) {
        throw new BadRequestError(ErrorConstants.INVALID_PRESCRIPTION_DATA);
      }

      contactPhone =
        verifyPrescriptionHelperResponse.filteredUserInfo?.telephone;
      contactAddress =
        verifyPrescriptionHelperResponse.filteredUserInfo?.address;
      lastNameToUse = (
        verifyPrescriptionHelperResponse.filteredUserInfo?.lastName ??
        lastNameToUse
      ).toUpperCase();
      updatePrescriptionParams =
        verifyPrescriptionHelperResponse.filteredUserInfo
          .updatePrescriptionParams;
      masterId = verifyPrescriptionHelperResponse.filteredUserInfo.masterId;
    }

    if (!contactPhone) {
      throw new BadRequestError(ErrorConstants.INVALID_PRESCRIPTION_DATA);
    }

    const isAutomationTokenValid: ValidateAutomationTokenResponseType =
      await validateAutomationToken(
        request,
        response,
        configuration,
        contactPhone
      );
    let skipOneTimePasswordVerification = false;
    if (isAutomationTokenValid.status) {
      if (
        isAutomationTokenValid.errorMessage &&
        isAutomationTokenValid.errorRequest
      ) {
        throw new RequestError(
          isAutomationTokenValid.errorRequest,
          isAutomationTokenValid.errorMessage
        );
      }

      skipOneTimePasswordVerification =
        oneTimePassword === getResponseLocal(response, 'code');
    }

    skipOneTimePasswordVerification =
      skipOneTimePasswordVerification || !!verifiedSsoRequest;

    if (!skipOneTimePasswordVerification) {
      if (isV2Endpoint) {
        await validateOneTimePasswordV2(
          configuration,
          contactPhone,
          oneTimePassword
        );
      } else {
        await validateOneTimePassword(
          twilioClient,
          twilioVerificationServiceId,
          contactPhone,
          oneTimePassword
        );
      }
    }

    let patientAccount = isV2Endpoint
      ? await getPatientAccountByPhoneNumber(configuration, contactPhone)
      : undefined;

    if (patientAccount && !isPatientAccountVerified(patientAccount)) {
      const patient = patientAccount.patient;

      assertHasPatient(patient);

      const doPatientDetailsMatch =
        doesPatientBirthDateMatch(patient, isoDateOfBirth) &&
        doPatientFirstNameMatch(patient, firstName);

      if (!doPatientDetailsMatch) {
        throw new BadRequestError(
          ErrorConstants.ACCOUNT_PERSON_DATA_MISMATCH,
          InternalResponseCode.ACCOUNT_PERSON_DATA_MISMATCH
        );
      }
    }

    const account = await searchAccountByPhoneNumber(database, contactPhone);

    const doAgeCheck = isV2Endpoint
      ? !isPatientAccountVerified(patientAccount)
      : !account?.dateOfBirth;

    if (doAgeCheck) {
      validateRequestAge(
        dateOfBirth,
        childMemberAgeLimit,
        firstNameToUse,
        lastNameToUse,
        undefined,
        ErrorConstants.ACCOUNT_CREATION_AGE_REQUIREMENT_NOT_MET(
          childMemberAgeLimit
        )
      );
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
      throw new BadRequestError(
        ErrorConstants.ACCOUNT_CREATION_ACTIVATION_PERSON_RECORD_DATA_MISMATCH,
        InternalResponseCode.ACTIVATION_PERSON_DATA_MISMATCH
      );
    }

    const cashMember = findCashProfile(personList);

    let familyId = cashMember?.primaryMemberFamilyId;
    let token: string;
    let termsAndConditionsAcceptances: ITermsAndConditionsWithAuthTokenAcceptance;
    let patientAccountId: string | undefined;

    if (isV2Endpoint) {
      if (
        activationRecordStatus.isValid &&
        activationRecordStatus.activationPatientMemberId
      ) {
        pbmMasterId = activationRecordStatus.activationPatientMasterId;
        pbmMemberId = activationRecordStatus.activationPatientMemberId;
      }
      if (
        primaryMemberRxId &&
        !activationRecordStatus.activationPatientMemberId
      ) {
        const verifyMembershipHelperResponse =
          await membershipVerificationHelperV2(
            database,
            phoneNumber,
            firstNameToUse,
            lastNameToUse,
            isoDateOfBirth,
            primaryMemberRxId,
            configuration
          );

        if (!verifyMembershipHelperResponse.isValidMembership) {
          return KnownFailureResponse(
            response,
            verifyMembershipHelperResponse.responseCode ??
              HttpStatusCodes.INTERNAL_SERVER_ERROR,
            verifyMembershipHelperResponse.responseMessage ?? ''
          );
        }

        pbmMasterId = verifyMembershipHelperResponse.masterId;
        pbmMemberId = verifyMembershipHelperResponse.memberId;
      }

      const getOrGenerateFamilyId = async (): Promise<string> =>
        familyId ??
        (await generatePrimaryMemberFamilyId(database, configuration));

      familyId = await getOrGenerateFamilyId();
      if (!patientAccount) {
        const identity: IIdentity = {
          isoDateOfBirth,
          firstName: firstNameToUse,
          lastName: lastNameToUse,
          email: requestBody.email,
          phoneNumber,
        };
        patientAccount = await createAccount(
          configuration,
          identity,
          familyId,
          account?.accountKey,
          account?.pinHash,
          request.socket.remoteAddress,
          request.headers['user-agent']
        );
      }

      token = await generateDeviceTokenForV2Account(
        patientAccount,
        phoneNumber,
        configuration
      );

      patientAccountId = patientAccount.accountId;
      masterId = patientAccount.patient?.id;
      assertHasMasterId(masterId, phoneNumber);

      await createCashCoverageRecord(configuration, masterId, familyId);

      termsAndConditionsAcceptances = buildTermsAndConditionsAcceptance(
        request,
        token
      );

      patientAccount = await updatePatientAccountTermsAndConditionsAcceptance(
        configuration,
        patientAccount,
        termsAndConditionsAcceptances
      );

      if (!isPatientAccountVerified(patientAccount)) {
        assertHasAccountId(patientAccountId);

        const hasPinHash = !!getPinDetails(patientAccount);
        if (!hasPinHash && account?.pinHash && account?.accountKey) {
          await updatePatientAccountPin(
            account.accountKey,
            account.pinHash,
            configuration,
            patientAccount
          );
        }

        familyId = await getOrGenerateFamilyId();

        await setPatientAndPatientAccountIdentifiers(
          configuration,
          patientAccount,
          familyId,
          masterId,
          phoneNumber
        );

        await setPatientAccountStatusToVerified(
          configuration,
          patientAccountId
        );
      }

      if (pbmMemberId && pbmMasterId) {
        const updatedPatientAccount = await getPatientAccountByPhoneNumber(
          configuration,
          contactPhone
        );
        assertHasPatientAccount(updatedPatientAccount);
        const updatedPatient = updatedPatientAccount.patient;
        assertHasPatient(updatedPatient);
        const sieMemberIdExist = patientAccount.reference.some(
          (ref) => ref === pbmMemberId
        );

        let shouldAddMembershipPlan = !sieMemberIdExist && !!masterId;

        if (verifiedSsoRequest) {
          shouldAddMembershipPlan =
            !patientAccount.patient?.link?.length ||
            (await hasMatchingCoverage(
              configuration,
              patientAccount,
              verifiedSsoRequest?.tokenPayload.group_number
            ));
        }

        if (patientAccount.patient && shouldAddMembershipPlan) {
          await addMembershipPlan(
            updatedPatientAccount,
            updatedPatient,
            pbmMasterId,
            configuration,
            pbmMemberId
          );
        }
      }
    } else {
      token = (await generateDeviceToken(contactPhone, configuration, database))
        .token;
      termsAndConditionsAcceptances = buildTermsAndConditionsAcceptance(
        request,
        token
      );
    }

    if (account?.dateOfBirth) {
      let accountToken = undefined;
      if (verifiedSsoRequest && patientAccount?.accountId) {
        accountToken = generateAccountToken(
          {
            patientAccountId: patientAccount.accountId,
            cashMasterId: getMasterId(patientAccount),
            phoneNumber,
          },
          configuration.jwtTokenSecretKey,
          configuration.jwtTokenExpiryTime
        );
      }

      return await buildExistingAccountResponse(
        response,
        database,
        configuration,
        contactPhone,
        token,
        account,
        termsAndConditionsAcceptances,
        cashMember,
        primaryMemberRxId,
        contactAddress,
        updatePrescriptionParams,
        activationRecordStatus.activationRecord,
        !cashMember ? familyId : undefined,
        masterId,
        patientAccountId,
        accountToken
      );
    }

    const cashMemberExists = !!cashMember;

    return await buildNewAccountResponse(
      response,
      database,
      configuration,
      contactPhone,
      firstNameToUse,
      lastNameToUse,
      email,
      isoDateOfBirth,
      token,
      termsAndConditionsAcceptances,
      cashMemberExists,
      primaryMemberRxId,
      contactAddress,
      updatePrescriptionParams,
      activationRecordStatus.activationRecord,
      masterId,
      patientAccountId,
      familyId
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

    return errorResponseWithTwilioErrorHandling(
      response,
      contactPhone,
      error as RestException
    );
  }
}

const generateDeviceTokenForV2Account = async (
  patientAccount: IPatientAccount,
  phoneNumber: string,
  configuration: IConfiguration
) => {
  return (
    await generateDeviceTokenV2(phoneNumber, configuration, patientAccount)
  ).token;
};

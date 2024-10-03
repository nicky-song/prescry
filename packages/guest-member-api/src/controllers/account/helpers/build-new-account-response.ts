// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { ICreateAccountResponseData } from '@phx/common/src/models/api-response/create-account.response';
import { IPerson } from '@phx/common/src/models/person';
import { IConfiguration } from '../../../configuration';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { ITermsAndConditionsWithAuthTokenAcceptance } from '../../../models/terms-and-conditions-acceptance-info';

import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { publishAccountUpdateMessageAndAddToRedis } from '../../../utils/account/account.helper';
import { membershipVerificationHelper } from '../../members/helpers/membership-verification.helper';
import { createCashProfileAndAddToRedis } from '../../../utils/person/create-cash-profile-and-add-to-redis';
import {
  publishPersonUpdatePatientDetailsMessage,
  publishPhoneNumberVerificationMessage,
} from '../../../utils/service-bus/person-update-helper';
import { addPhoneRegistrationKeyInRedis } from '../../../databases/redis/redis-query-helper';
import { trackNewPhoneNumberRegistrationEvent } from '../../../utils/custom-event-helper';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import {
  IUpdatePrescriptionParams,
  updatePrescriptionWithMemberId,
} from '../../prescription/helpers/update-prescriptions-with-member-id';

export const buildNewAccountResponse = async (
  response: Response,
  database: IDatabase,
  configuration: IConfiguration,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  email: string,
  dateOfBirth: string,
  token: string,
  termsAndConditionsAcceptance: ITermsAndConditionsWithAuthTokenAcceptance,
  cashMemberExists: boolean,
  primaryMemberRxId?: string,
  memberAddress?: IMemberAddress,
  updatePrescriptionParams?: IUpdatePrescriptionParams,
  activationPersonRecord?: IPerson,
  masterId?: string,
  patientAccountId?: string,
  familyId?: string
): Promise<Response> => {
  let firstNameToUse = (firstName?.trim() ?? '').toUpperCase();
  let lastNameToUse = (lastName?.trim() ?? '').toUpperCase();
  let pbmPersonIdentifier = activationPersonRecord?.identifier;
  if (primaryMemberRxId) {
    const verifyMembershipHelperResponse = await membershipVerificationHelper(
      database,
      phoneNumber,
      firstNameToUse,
      lastNameToUse,
      dateOfBirth,
      primaryMemberRxId
    );

    if (!verifyMembershipHelperResponse.isValidMembership) {
      return KnownFailureResponse(
        response,
        verifyMembershipHelperResponse.responseCode ??
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
        verifyMembershipHelperResponse.responseMessage ?? ''
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
    pbmPersonIdentifier = verifyMembershipHelperResponse.member.identifier;
    if (!verifyMembershipHelperResponse.member.phoneNumber) {
      await publishPhoneNumberVerificationMessage(
        pbmPersonIdentifier,
        phoneNumber
      );
      await addPhoneRegistrationKeyInRedis(
        phoneNumber,
        verifyMembershipHelperResponse.member,
        configuration.redisPhoneNumberRegistrationKeyExpiryTime
      );

      trackNewPhoneNumberRegistrationEvent(phoneNumber, pbmPersonIdentifier);
    }
  }
  if (
    activationPersonRecord &&
    activationPersonRecord.primaryMemberRxId !== primaryMemberRxId
  ) {
    lastNameToUse = activationPersonRecord.lastName;
    if (!activationPersonRecord.phoneNumber) {
      await publishPhoneNumberVerificationMessage(
        activationPersonRecord.identifier,
        phoneNumber
      );
      await addPhoneRegistrationKeyInRedis(
        phoneNumber,
        activationPersonRecord,
        configuration.redisPhoneNumberRegistrationKeyExpiryTime
      );
      if (
        updatePrescriptionParams &&
        !updatePrescriptionParams.clientPatientId.length
      ) {
        updatePrescriptionParams.clientPatientId =
          activationPersonRecord.primaryMemberRxId;
      }
    }
  }

  if (masterId && patientAccountId && pbmPersonIdentifier) {
    await publishPersonUpdatePatientDetailsMessage(
      pbmPersonIdentifier,
      masterId,
      patientAccountId
    );
  }

  await publishAccountUpdateMessageAndAddToRedis(
    {
      dateOfBirth,
      firstName: firstNameToUse,
      lastName: lastNameToUse,
      recoveryEmail: email,
      phoneNumber,
      termsAndConditionsAcceptances: termsAndConditionsAcceptance,
      ...(patientAccountId && { accountId: patientAccountId }),
      ...(masterId && { masterId }),
      recentlyUpdated: true,
    },
    configuration.redisPhoneNumberRegistrationKeyExpiryTime
  );

  if (!cashMemberExists) {
    const person = await createCashProfileAndAddToRedis(
      database,
      configuration,
      firstNameToUse,
      lastNameToUse,
      dateOfBirth,
      phoneNumber,
      email,
      memberAddress,
      masterId,
      patientAccountId,
      familyId
    );
    if (
      updatePrescriptionParams &&
      !updatePrescriptionParams.clientPatientId.length &&
      person.primaryMemberRxId
    ) {
      updatePrescriptionParams.clientPatientId = person.primaryMemberRxId;
    }
  }
  if (
    updatePrescriptionParams &&
    updatePrescriptionParams.clientPatientId.length
  ) {
    await updatePrescriptionWithMemberId(
      updatePrescriptionParams,
      configuration
    );
  }

  return SuccessResponse<ICreateAccountResponseData>(
    response,
    SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN,
    { deviceToken: token, recoveryEmailExists: true },
    undefined,
    undefined,
    undefined,
    InternalResponseCode.REQUIRE_USER_SET_PIN
  );
};

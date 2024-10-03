// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { IAccount } from '@phx/common/src/models/account';
import { ICreateAccountResponseData } from '@phx/common/src/models/api-response/create-account.response';
import { IPerson } from '@phx/common/src/models/person';
import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
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
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { createCashProfileAndAddToRedis } from '../../../utils/person/create-cash-profile-and-add-to-redis';
import { membershipVerificationHelper } from '../../members/helpers/membership-verification.helper';
import {
  publishPersonUpdatePatientDetailsMessage,
  publishPhoneNumberVerificationMessage,
} from '../../../utils/service-bus/person-update-helper';
import DateFormatter from '@phx/common/src/utils/formatters/date.formatter';
import { addPhoneRegistrationKeyInRedis } from '../../../databases/redis/redis-query-helper';
import { trackNewPhoneNumberRegistrationEvent } from '../../../utils/custom-event-helper';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import {
  IUpdatePrescriptionParams,
  updatePrescriptionWithMemberId,
} from '../../prescription/helpers/update-prescriptions-with-member-id';
import dateFormat from 'dateformat';
import { IDataToValidate, isLoginDataValid } from '../../../utils/login-helper';

export const buildExistingAccountResponse = async (
  response: Response,
  database: IDatabase,
  configuration: IConfiguration,
  phoneNumber: string,
  token: string,
  account: IAccount,
  termsAndConditionsAcceptance: ITermsAndConditionsWithAuthTokenAcceptance,
  cashMember?: IPerson,
  primaryMemberRxId?: string,
  memberAddress?: IMemberAddress,
  updatePrescriptionParams?: IUpdatePrescriptionParams,
  activationPersonRecord?: IPerson,
  familyId?: string,
  masterId?: string,
  patientAccountId?: string,
  accountToken?: string
): Promise<Response> => {
  await publishAccountUpdateMessage({
    phoneNumber,
    termsAndConditionsAcceptances: termsAndConditionsAcceptance,
    ...(patientAccountId && { accountId: patientAccountId }),
    ...(masterId && { masterId }),
    recentlyUpdated: true,
  });
  const firstName = account.firstName?.toUpperCase() ?? '';
  const lastName = account.lastName?.toUpperCase() ?? '';
  const dateOfBirth = account.dateOfBirth
    ? dateFormat(
        DateFormatter.formatToMonthDDYYYY(account.dateOfBirth),
        'yyyy-mm-dd'
      )
    : '';
  let pbmMemberIdentifier = activationPersonRecord?.identifier;
  if (primaryMemberRxId) {
    const verificationHelperResponse = await membershipVerificationHelper(
      database,
      phoneNumber,
      firstName,
      lastName,
      dateOfBirth,
      primaryMemberRxId
    );

    if (!verificationHelperResponse.isValidMembership) {
      return KnownFailureResponse(
        response,
        verificationHelperResponse.responseCode ??
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
        verificationHelperResponse.responseMessage ?? '',
        undefined,
        verificationHelperResponse.responseMessage ===
          ErrorConstants.ACCOUNT_PERSON_DATA_MISMATCH
          ? InternalResponseCode.ACCOUNT_PERSON_DATA_MISMATCH
          : undefined
      );
    }
    if (!verificationHelperResponse.member) {
      return UnknownFailureResponse(
        response,
        ErrorConstants.INTERNAL_SERVER_ERROR
      );
    }

    pbmMemberIdentifier = verificationHelperResponse.member.identifier;
    if (!verificationHelperResponse.member.phoneNumber) {
      await publishPhoneNumberVerificationMessage(
        pbmMemberIdentifier,
        phoneNumber
      );
      await addPhoneRegistrationKeyInRedis(
        phoneNumber,
        verificationHelperResponse.member,
        configuration.redisPhoneNumberRegistrationKeyExpiryTime
      );

      trackNewPhoneNumberRegistrationEvent(phoneNumber, pbmMemberIdentifier);
    }
  }
  if (
    activationPersonRecord &&
    activationPersonRecord.primaryMemberRxId !== primaryMemberRxId
  ) {
    const activationData: IDataToValidate = {
      firstName: activationPersonRecord.firstName,
      dateOfBirth: activationPersonRecord.dateOfBirth,
    };
    if (
      isLoginDataValid({ firstName, dateOfBirth }, activationData) &&
      !activationPersonRecord.phoneNumber
    ) {
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
          activationPersonRecord?.primaryMemberRxId;
      }
    }
  }

  if (masterId && patientAccountId && pbmMemberIdentifier) {
    await publishPersonUpdatePatientDetailsMessage(
      pbmMemberIdentifier,
      masterId,
      patientAccountId
    );
  }

  if (!cashMember) {
    const person = await createCashProfileAndAddToRedis(
      database,
      configuration,
      firstName,
      lastName,
      account.dateOfBirth ? UTCDateString(account.dateOfBirth) : '',
      phoneNumber,
      account.recoveryEmail,
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
  } else if (!cashMember.masterId && masterId) {
    await publishPersonUpdatePatientDetailsMessage(
      cashMember.identifier,
      masterId,
      patientAccountId
    );
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

  if (accountToken) {
    return SuccessResponse(response, SuccessConstants.VERIFY_SSO_SUCCESS, {
      deviceToken: token,
      recoveryEmailExists: !!account.recoveryEmail,
      accountToken,
    });
  }

  return SuccessResponse<ICreateAccountResponseData>(
    response,
    account.accountKey && account.pinHash
      ? SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_VERIFY_PIN
      : SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN,
    {
      deviceToken: token,
      recoveryEmailExists: !!account.recoveryEmail,
    },
    undefined,
    undefined,
    undefined,
    account.accountKey && account.pinHash
      ? InternalResponseCode.REQUIRE_USER_VERIFY_PIN
      : InternalResponseCode.REQUIRE_USER_SET_PIN
  );
};

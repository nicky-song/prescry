// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import { Twilio } from 'twilio';
import { IConfiguration } from '../../../configuration';
import { InternalResponseCode } from '../../../constants/error-codes';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  ValidateAutomationTokenResponseType,
  validateAutomationToken,
} from '../../../utils/validate-automation-token/validate-automation-token';
import {
  getFirstOrDefault,
  sortMemberByPersonCode,
} from '../../../utils/person/person-helper';
import {
  errorResponseWithTwilioErrorHandling,
  KnownFailureResponse,
  SuccessResponse,
} from '../../../utils/response-helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { buildTermsAndConditionsAcceptance } from '../../../utils/terms-and-conditions.helper';
import { generateDeviceToken } from '../../../utils/verify-device-helper';
import {
  memberRegistrationRequiredResponse,
  createPinResponse,
  phoneLoginSuccessResponse,
  IVerifyOneTimePasswordControllerResponseData,
} from './verify-one-time-password-response.helper';
import { getResponseLocal } from '../../../utils/request/request-app-locals.helper';
import {
  IAccountCreationKeyValues,
  IIdentityVerificationKeyValues,
} from '../../../utils/redis/redis.helper';
import { getIdentityVerificationAttemptsDataFromRedis } from '../../../databases/redis/redis-query-helper';
import { isTooManyIdentityVerificationAttempts } from '../../../middlewares/device-token.middleware';
import { getAllRecordsForLoggedInPerson } from '../../../utils/person/get-logged-in-person.helper';
import { createCashProfileAndAddToRedis } from '../../../utils/person/create-cash-profile-and-add-to-redis';
import RestException from 'twilio/lib/base/RestException';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';
import { validateOneTimePasswordV2 } from '../../../utils/request/validate-one-time-password.v2';
import { validateOneTimePassword } from '../../../utils/request/validate-one-time-password';
import { RequestError } from '../../../errors/request-errors/request.error';
import { IAccount } from '@phx/common/src/models/account';
import { generateDeviceTokenV2 } from '../../../utils/verify-device-helper-v2';
import { getPatientAccountByPhoneNumber } from '../../../utils/patient-account/get-patient-account-by-phone-number';
import { IPatientAccount } from '../../../models/platform/patient-account/patient-account';
import { publishTermsAndConditionsHealthRecordEvent } from '../../../utils/health-record-event/publish-terms-and-conditions-health-record-event';
import { updatePatientAccountTermsAndConditionsAcceptance } from '../../../utils/patient-account/update-patient-account-terms-and-conditions-acceptance';
import { ITermsAndConditionsWithAuthTokenAcceptance } from '../../../models/terms-and-conditions-acceptance-info';
import { isPatientAccountVerified } from '../../../utils/patient-account/patient-account.helper';
import { findCashProfile } from '../../../utils/person/find-profile.helper';

export class VerifyOneTimePasswordController {
  public configuration: IConfiguration;
  public database: IDatabase;
  public twilioClient: Twilio;

  constructor(
    configuration: IConfiguration,
    twilioClient: Twilio,
    database: IDatabase,
  ) {
    this.configuration = configuration;
    this.twilioClient = twilioClient;
    this.database = database;
  }

  public verifyOneTimePassword = async (
    request: Request,
    response: Response
  ) => {
    const { configuration, twilioClient, database } = this;
    const { code, phoneNumber } = request.body;
    const isV2Endpoint = getEndpointVersion(request) === 'v2';

    const isAutomationTokenValid: ValidateAutomationTokenResponseType =
      await validateAutomationToken(
        request,
        response,
        configuration,
        phoneNumber
      );
    let skipTwilioVerification = false;
    if (isAutomationTokenValid.status) {
      if (
        isAutomationTokenValid.errorMessage &&
        isAutomationTokenValid.errorRequest
      ) {
        return KnownFailureResponse(
          response,
          isAutomationTokenValid.errorRequest,
          isAutomationTokenValid.errorMessage
        );
      } else {
        skipTwilioVerification = code === getResponseLocal(response, 'code');
      }
    }

    const { twilioVerificationServiceId } = configuration;

    try {
      if (!skipTwilioVerification) {
        if (isV2Endpoint) {
          await validateOneTimePasswordV2(configuration, phoneNumber, code);
        } else {
          await validateOneTimePassword(
            twilioClient,
            twilioVerificationServiceId,
            phoneNumber,
            code
          );
        }
      }

      let account: IAccount | IAccountCreationKeyValues | undefined;
      let accountKey: string | undefined;
      let token: string;
      let recoveryEmailExists: boolean;
      let patientAccount: IPatientAccount | undefined;
      let termsAndConditionsAcceptance: ITermsAndConditionsWithAuthTokenAcceptance;

      if (isV2Endpoint) {
        patientAccount = await getPatientAccountByPhoneNumber(
          configuration,
          phoneNumber
        );

        const generateTokenResponse = await generateDeviceTokenV2(
          phoneNumber,
          configuration,
          patientAccount
        );

        token = generateTokenResponse.token;
        accountKey = generateTokenResponse.accountKey;
        recoveryEmailExists = generateTokenResponse.recoveryEmailExists;

        termsAndConditionsAcceptance = buildTermsAndConditionsAcceptance(
          request,
          token
        );

        if (patientAccount) {
          await updatePatientAccountTermsAndConditionsAcceptance(
            configuration,
            patientAccount,
            termsAndConditionsAcceptance
          );
        }

        if (!patientAccount || !isPatientAccountVerified(patientAccount)) {
          if (!patientAccount) {
            await publishTermsAndConditionsHealthRecordEvent(
              termsAndConditionsAcceptance,
              phoneNumber
            );
          }

          return memberRegistrationRequiredResponse(
            phoneNumber,
            termsAndConditionsAcceptance,
            token,
            response
          );
        }
      } else {
        const generateTokenResponse = await generateDeviceToken(
          phoneNumber,
          configuration,
          database
        );

        token = generateTokenResponse.token;
        account = generateTokenResponse.account;
        accountKey = generateTokenResponse.accountKey;
        recoveryEmailExists = generateTokenResponse.recoveryEmailExists;

        termsAndConditionsAcceptance = buildTermsAndConditionsAcceptance(
          request,
          token
        );
      }

      if (!isV2Endpoint) {
        if (!account || !account.dateOfBirth) {
          const personList: IPerson[] | null =
            await getAllRecordsForLoggedInPerson(database, phoneNumber);
          const member: IPerson | undefined = getFirstOrDefault(
            personList,
            sortMemberByPersonCode
          );

          if (!member) {
            return memberRegistrationRequiredResponse(
              phoneNumber,
              termsAndConditionsAcceptance,
              token,
              response
            );
          }

          const hasCashMember = findCashProfile(personList);

          if (!hasCashMember) {
            await createCashProfileAndAddToRedis(
              database,
              configuration,
              member.firstName,
              member.lastName,
              member.dateOfBirth,
              phoneNumber
            );
          }

          return createPinResponse(
            phoneNumber,
            termsAndConditionsAcceptance,
            token,
            member,
            response,
            configuration.redisPhoneNumberRegistrationKeyExpiryTime
          );
        }
      }

      await publishAccountUpdateMessage({
        phoneNumber,
        termsAndConditionsAcceptances: termsAndConditionsAcceptance,
      });

      const identityVerificationData:
        | IIdentityVerificationKeyValues
        | undefined = await getIdentityVerificationAttemptsDataFromRedis(
        phoneNumber
      );

      if (
        identityVerificationData &&
        isTooManyIdentityVerificationAttempts(
          identityVerificationData,
          configuration
        )
      ) {
        return SuccessResponse<IVerifyOneTimePasswordControllerResponseData>(
          response,
          'SHOW_ACCOUNT_LOCKED',
          { deviceToken: token, recoveryEmailExists },
          undefined,
          undefined,
          undefined,
          InternalResponseCode.SHOW_ACCOUNT_LOCKED
        );
      }

      return phoneLoginSuccessResponse(
        accountKey,
        token,
        response,
        recoveryEmailExists
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
        phoneNumber,
        error as RestException
      );
    }
  };
}

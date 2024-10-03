// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPinKeyValues } from '../../../utils/redis/redis.helper';
import { addPinVerificationKeyInRedis } from '../../../databases/redis/redis-query-helper';
import { SuccessResponse } from '../../../utils/response-helper';
import { SuccessConstants } from '../../../constants/response-messages';
import { getPersonIdentifiers } from './get-person-identifiers.helper';
import { generateAccountToken } from '../../../utils/account-token.helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IConfiguration } from '../../../configuration';
import { EndpointVersion } from '../../../models/endpoint-version';
import {
  IAccountTokenPayload,
  IAccountTokenPayloadV2,
} from '../../../models/account-token-payload';
import { IPatientAccount } from '../../../models/platform/patient-account/patient-account';
import { getMasterId } from '../../../utils/patient-account/patient-account.helper';
import { assertHasAccountId } from '../../../assertions/assert-has-account-id';
import { assertHasPatientAccount } from '../../../assertions/assert-has-patient-account';

export const verifyPinSuccessResponse = async (
  response: Response,
  phoneNumber: string,
  deviceIdentifier: string,
  pinDetails: IPinKeyValues,
  configuration: IConfiguration,
  database: IDatabase,
  version: EndpointVersion,
  patientAccount?: IPatientAccount
): Promise<Response> => {
  await addPinVerificationKeyInRedis(
    phoneNumber,
    configuration.redisPinVerificationKeyExpiryTime,
    deviceIdentifier
  );

  const personIdentifiers: string[] | undefined | null =
    await getPersonIdentifiers(phoneNumber, database);

  const buildAccountTokenPayload = ():
    | IAccountTokenPayload
    | IAccountTokenPayloadV2 => {
    if (version === 'v2') {
      assertHasPatientAccount(patientAccount);
      assertHasAccountId(patientAccount.accountId);

      const accountTokenPayloadV2: IAccountTokenPayloadV2 = {
        patientAccountId: patientAccount.accountId,
        phoneNumber,
        cashMasterId: getMasterId(patientAccount),
      };
      return accountTokenPayloadV2;
    }

    const accountTokenPayloadV1: IAccountTokenPayload = {
      firstName: pinDetails.firstName ?? '',
      identifier: pinDetails._id ?? '',
      lastName: pinDetails.lastName ?? '',
      phoneNumber,
      membershipIdentifiers: personIdentifiers,
    };
    return accountTokenPayloadV1;
  };

  const token = generateAccountToken(
    buildAccountTokenPayload(),
    configuration.jwtTokenSecretKey,
    configuration.accountTokenExpiryTime
  );
  return SuccessResponse(response, SuccessConstants.VERIFY_PIN_SUCCESS, {
    accountToken: token,
  });
};

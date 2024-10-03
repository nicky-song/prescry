// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../../configuration';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import { ErrorConstants } from '../../../constants/response-messages';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { getPinDataFromRedis } from '../../../databases/redis/redis-query-helper';
import { compareHashValue } from '../../../utils/bcryptjs-helper';
import { IPinKeyValues } from '../../../utils/redis/redis.helper';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { pinDetailsCreator } from '../helpers/pin-creator.helper';
import { invalidPinResponse } from '../helpers/invalid-pin-response.helper';
import { verifyPinSuccessResponse } from '../helpers/verify-pin-success-response.helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { IAppLocals } from '../../../models/app-locals';
import { getPinKeyValuesFromPatientAccount } from '../../../utils/patient-account/get-pin-key-values-from-patient-account';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function verifyPinHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration
) {
  try {
    const version = getEndpointVersion(request);
    const { encryptedPin } = request.body;
    const { redisPinKeyExpiryTime } = configuration;

    const { data: phoneNumber, identifier: deviceIdentifier } =
      getRequiredResponseLocal(response, 'device');

    const locals = response.locals as IAppLocals;
    const { patientAccount } = locals;

    const getPinKeyValues = async (): Promise<IPinKeyValues | undefined> => {
      if (version === 'v2') {
        return getPinKeyValuesFromPatientAccount(patientAccount);
      }

      return await pinDetailsCreator(database, phoneNumber);
    };

    const pinDetails: IPinKeyValues | undefined = await getPinDataFromRedis(
      phoneNumber,
      undefined,
      getPinKeyValues,
      redisPinKeyExpiryTime
    );

    if (!pinDetails?.pinHash) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.FORBIDDEN_ERROR,
        ErrorConstants.PIN_MISSING,
        undefined,
        InternalResponseCode.REQUIRE_USER_SET_PIN
      );
    }

    const isPinValid: boolean = await compareHashValue(
      encryptedPin,
      pinDetails.pinHash
    );

    if (!isPinValid) {
      return await invalidPinResponse(
        response,
        phoneNumber,
        deviceIdentifier,
        configuration,
        false
      );
    }
    return await verifyPinSuccessResponse(
      response,
      phoneNumber,
      deviceIdentifier,
      pinDetails,
      configuration,
      database,
      version,
      patientAccount
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}

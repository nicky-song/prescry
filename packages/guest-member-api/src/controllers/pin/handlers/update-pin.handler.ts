// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../../configuration';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import { ErrorConstants } from '../../../constants/response-messages';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  addPinVerificationKeyInRedis,
  getPinDataFromRedis,
} from '../../../databases/redis/redis-query-helper';
import { compareHashValue } from '../../../utils/bcryptjs-helper';

import { IPinKeyValues } from '../../../utils/redis/redis.helper';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { pinDetailsCreator } from '../helpers/pin-creator.helper';
import { invalidPinResponse } from '../helpers/invalid-pin-response.helper';
import { updatePinSuccessResponse } from '../helpers/update-pin-success-response.helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import {
  IPinDetails,
  getPinDetails,
} from '../../../utils/patient-account/get-pin-details';
import { IPatientAccount } from '../../../models/platform/patient-account/patient-account';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function updatePinHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration
) {
  const version = getEndpointVersion(request);
  const { encryptedPinCurrent, encryptedPinNew } = request.body;
  const { redisPinKeyExpiryTime, redisPinVerificationKeyExpiryTime } =
    configuration;

  const { data: phoneNumber, identifier: deviceIdentifier } =
    getRequiredResponseLocal(response, 'device');
  let pinDetails: IPinKeyValues | undefined;
  let patientAccount: IPatientAccount | undefined;
  try {
    if (version === 'v2') {
      patientAccount = getRequiredResponseLocal(response, 'patientAccount');
      const pinInfo: IPinDetails | undefined = getPinDetails(patientAccount);
      if (pinInfo) {
        pinDetails = {
          pinHash: pinInfo.pinHash,
          accountKey: pinInfo.accountKey,
        };
      }
    } else {
      pinDetails = await getPinDataFromRedis(
        phoneNumber,
        undefined,
        () => pinDetailsCreator(database, phoneNumber),
        redisPinKeyExpiryTime
      );
    }

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
      encryptedPinCurrent,
      pinDetails.pinHash
    );

    if (!isPinValid) {
      return await invalidPinResponse(
        response,
        phoneNumber,
        deviceIdentifier,
        configuration,
        true
      );
    }

    await addPinVerificationKeyInRedis(
      phoneNumber,
      redisPinVerificationKeyExpiryTime,
      deviceIdentifier
    );

    const isNewPinSame: boolean = await compareHashValue(
      encryptedPinNew,
      pinDetails.pinHash
    );

    if (isNewPinSame) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.NEW_PIN_SAME,
        undefined,
        InternalResponseCode.USE_ANOTHER_PIN
      );
    }
    return await updatePinSuccessResponse(
      response,
      phoneNumber,
      encryptedPinNew,
      pinDetails,
      configuration,
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

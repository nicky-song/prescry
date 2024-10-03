// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IAccount } from '@phx/common/src/models/account';
import { IConfiguration } from '../../../configuration';
import { HttpStatusCodes } from '../../../constants/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  addPinKeyInRedis,
  getAccountCreationDataFromRedis,
} from '../../../databases/redis/redis-query-helper';
import { generateHash } from '../../../utils/bcryptjs-helper';
import { trackAddPinEvent } from '../../../utils/custom-event-helper';
import { IPinKeyValues } from '../../../utils/redis/redis.helper';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { generateAccountToken } from '../../../utils/account-token.helper';
import { getPersonIdentifiers } from '../helpers/get-person-identifiers.helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';

export async function addPinHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration
) {
  const { jwtTokenSecretKey, accountTokenExpiryTime, redisPinKeyExpiryTime } =
    configuration;

  const { encryptedPin } = request.body;

  const phoneNumber = getRequiredResponseLocal(response, 'device').data;
  const deviceKeyRedis = getRequiredResponseLocal(response, 'deviceKeyRedis');

  try {
    const accountDetails: IAccount | null = await searchAccountByPhoneNumber(
      database,
      phoneNumber
    );
    let dataInRedis;
    if (!accountDetails || !accountDetails.dateOfBirth) {
      dataInRedis = await getAccountCreationDataFromRedis(phoneNumber);
      if (!dataInRedis) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.UNAUTHORIZED_REQUEST,
          ErrorConstants.PHONE_NUMBER_MISSING
        );
      }
    }
    if (accountDetails && accountDetails.pinHash) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.FORBIDDEN_ERROR,
        ErrorConstants.PIN_ALREADY_SET
      );
    }

    const pinHash = await generateHash(encryptedPin);

    const pinKeyValues: IPinKeyValues = {
      firstName: accountDetails?.firstName || dataInRedis?.firstName,
      lastName: accountDetails?.lastName || dataInRedis?.lastName,
      dateOfBirth: accountDetails?.dateOfBirth || dataInRedis?.dateOfBirth,
      pinHash,
      accountKey: deviceKeyRedis,
      _id: accountDetails?._id,
    };
    await addPinKeyInRedis(phoneNumber, pinKeyValues, redisPinKeyExpiryTime);

    const personIdentifiers: string[] | undefined = await getPersonIdentifiers(
      phoneNumber,
      database
    );

    const token = generateAccountToken(
      {
        firstName: (accountDetails?.firstName || dataInRedis?.firstName) ?? '',
        identifier: accountDetails?._id ?? '',
        lastName: (accountDetails?.lastName || dataInRedis?.lastName) ?? '',
        phoneNumber,
        membershipIdentifiers: personIdentifiers,
      },
      jwtTokenSecretKey,
      accountTokenExpiryTime
    );

    await publishAccountUpdateMessage({
      accountKey: deviceKeyRedis,
      phoneNumber,
      pinHash,
      recentlyUpdated: true,
    });
    trackAddPinEvent(accountDetails?._id ?? '');
    return SuccessResponse(response, SuccessConstants.ADD_PIN_SUCCESS, {
      accountToken: token,
    });
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}

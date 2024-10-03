// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  UnknownFailureResponse,
  SuccessResponse,
} from '../../../utils/response-helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';

import { searchSmartPriceUserByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';

export interface ISmartPriceQuery {
  phoneNumber: string;
}

export async function isRegisteredUserHandler(
  _: Request,
  response: Response,
  database: IDatabase
) {
  const phoneNumber = getRequiredResponseLocal(response, 'device').data;
  try {
    const person = await searchSmartPriceUserByPhoneNumber(
      database,
      phoneNumber
    );
    return SuccessResponse<boolean>(
      response,
      SuccessConstants.SUCCESS_OK,
      person !== null
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}

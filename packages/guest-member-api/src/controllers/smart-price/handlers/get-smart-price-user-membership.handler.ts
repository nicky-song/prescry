// Copyright 2021 Prescryptive Health, Inc.

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
import { ISmartPriceMembership } from '../smart-price-membership';
export interface ISmartPriceQuery {
  phoneNumber: string;
}

export async function getSmartPriceUserMembershipHandler(
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
    if (person) {
      return SuccessResponse<ISmartPriceMembership>(
        response,
        SuccessConstants.SUCCESS_OK,
        {
          memberId: `${person.primaryMemberFamilyId} ${person.primaryMemberPersonCode}`,
          rxGroup: person.rxGroup,
          rxBin: person.rxBin,
          carrierPCN: person.carrierPCN,
        }
      );
    }
    return SuccessResponse(
      response,
      SuccessConstants.SUCCESS_OK,
      ErrorConstants.SMARTPRICE_USER_DOES_NOT_EXIST
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}

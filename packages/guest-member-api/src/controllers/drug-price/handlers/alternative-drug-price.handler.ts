// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { IConfiguration } from '../../../configuration';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { getAlternativeDrugPriceByNdcAndNcpdp } from '../../../utils/external-api/get-alternative-drug-price-by-ndc-and-ncpdp';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { ErrorConstants } from '../../../constants/response-messages';

export async function alternativeDrugPriceHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const ndc = getRequestQuery(request, 'ndc');
    const ncpdp = getRequestQuery(request, 'ncpdp');

    if (!ndc || !ncpdp) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.QUERYSTRING_INVALID
      );
    }

    return await getAlternativeDrugPriceByNdcAndNcpdp(
      response,
      ndc,
      ncpdp,
      configuration
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}

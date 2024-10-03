// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { HttpStatusCodes } from '../constants/error-codes';
import { ErrorConstants } from '../constants/response-messages';
import { isValidYear } from '../validators/year.validator';
import { getRequestQuery } from './request/get-request-query';
import { KnownFailureResponse } from './response-helper';

export const getClaimsYear = (request: Request, response: Response) => {
  const claimsYearString = getRequestQuery(request, 'year');

  if (claimsYearString && !isValidYear(claimsYearString)) {
    return KnownFailureResponse(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INVALID_YEAR_FORMAT
    );
  }

  return (
    (claimsYearString && Number(claimsYearString)) ?? new Date().getFullYear()
  );
};

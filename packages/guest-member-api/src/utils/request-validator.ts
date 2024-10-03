// Copyright 2018 Prescryptive Health, Inc.

import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { HttpStatusCodes } from '../constants/error-codes';
import { ErrorConstants } from '../constants/response-messages';
import { KnownFailureResponse } from './response-helper';

export const validate = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errors: Result<ValidationError> = validationResult(request);

  if (!errors.isEmpty()) {
    return KnownFailureResponse(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.BAD_REQUEST_PARAMS,
      new Error(ErrorConstants.BAD_REQUEST_PARAMS),
      undefined,
      errors
    );
  } else {
    return next();
  }
};

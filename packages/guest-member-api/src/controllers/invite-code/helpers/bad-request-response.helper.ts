// Copyright 2021 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { KnownFailureResponse } from '../../../utils/response-helper';
import { Response } from 'express';

export const badRequestForInviteCodeResponse = (
  response: Response,
  error: string,
  code: number
): Response => {
  return KnownFailureResponse(
    response,
    HttpStatusCodes.BAD_REQUEST,
    error,
    undefined,
    code
  );
};

// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../constants/error-codes';
import { ErrorConstants } from '../../constants/response-messages';
import { RequestError } from './request.error';

export class UnauthorizedRequestError extends RequestError {
  constructor() {
    super(
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.UNAUTHORIZED_ACCESS
    );
    Object.setPrototypeOf(this, UnauthorizedRequestError.prototype);
  }
}

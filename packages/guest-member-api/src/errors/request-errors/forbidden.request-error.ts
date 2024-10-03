// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../constants/error-codes';
import { RequestError } from './request.error';

export class ForbiddenRequestError extends RequestError {
  constructor(errorMessage: string) {
    super(HttpStatusCodes.FORBIDDEN_ERROR, errorMessage);
    Object.setPrototypeOf(this, ForbiddenRequestError.prototype);
  }
}

// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../constants/error-codes';
import { RequestError } from './request.error';

export class BadRequestError extends RequestError {
  constructor(errorMessage: string, internalCode?: number) {
    super(HttpStatusCodes.BAD_REQUEST, errorMessage, internalCode);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

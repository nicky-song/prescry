// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../constants/error-codes';
import { RequestError } from './request.error';

export class InternalServerRequestError extends RequestError {
  constructor(errorMessage: string, internalCode?: number) {
    super(HttpStatusCodes.INTERNAL_SERVER_ERROR, errorMessage, internalCode);
    Object.setPrototypeOf(this, InternalServerRequestError.prototype);
  }
}

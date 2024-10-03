// Copyright 2018 Prescryptive Health, Inc.

import { ErrorConstants } from '../experiences/guest-experience/api/api-response-messages';
import { InternalErrorCode } from './error-codes';
import { ErrorWithCode } from './error-with-code';

export class ErrorJsonWebTokenExpired extends ErrorWithCode<number> {
  constructor(innerError?: Error) {
    super(
      ErrorConstants.JWT_TOKEN_EXPIRED,
      InternalErrorCode.TOKEN_EXPIRED,
      innerError
    );
    Object.setPrototypeOf(this, ErrorJsonWebTokenExpired.prototype);
  }
}

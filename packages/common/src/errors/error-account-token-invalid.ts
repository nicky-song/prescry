// Copyright 2018 Prescryptive Health, Inc.

import { ErrorConstants } from '../experiences/guest-experience/api/api-response-messages';
import { InternalErrorCode } from './error-codes';
import { ErrorWithCode } from './error-with-code';

export class ErrorAccountTokenInvalid extends ErrorWithCode<number> {
  constructor(innerError?: Error) {
    super(
      ErrorConstants.INVALID_TOKEN,
      InternalErrorCode.INVALID_ACCOUNT_TOKEN,
      innerError
    );
    Object.setPrototypeOf(this, ErrorAccountTokenInvalid.prototype);
  }
}

// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../experiences/guest-experience/api/api-response-messages';
import { HttpStatusCodes } from './error-codes';
import { ErrorWithCode } from './error-with-code';

export class ErrorPartnerTokenInvalid extends ErrorWithCode<number> {
  constructor(innerError?: Error) {
    super(
      ErrorConstants.INVALID_TOKEN,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      innerError
    );
    Object.setPrototypeOf(this, ErrorPartnerTokenInvalid.prototype);
  }
}

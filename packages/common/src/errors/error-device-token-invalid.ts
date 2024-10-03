// Copyright 2018 Prescryptive Health, Inc.

import { ErrorConstants } from '../experiences/guest-experience/api/api-response-messages';
import { InternalErrorCode } from './error-codes';
import { ErrorWithCode } from './error-with-code';

export class ErrorDeviceTokenInvalid extends ErrorWithCode<number> {
  constructor(innerError?: Error) {
    super(
      ErrorConstants.INVALID_TOKEN,
      InternalErrorCode.INVALID_DEVICE_TOKEN,
      innerError
    );
    Object.setPrototypeOf(this, ErrorDeviceTokenInvalid.prototype);
  }
}

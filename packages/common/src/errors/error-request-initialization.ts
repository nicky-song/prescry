// Copyright 2018 Prescryptive Health, Inc.

import { ErrorConstants } from '../experiences/guest-experience/api/api-response-messages';
import { ErrorWithCode } from './error-with-code';

export class ErrorRequestInitialization extends ErrorWithCode<string> {
  constructor(key: string, innerError?: Error) {
    super(ErrorConstants.INTERNAL_SERVER_ERROR, key, innerError);
    Object.setPrototypeOf(this, ErrorRequestInitialization.prototype);
  }
}

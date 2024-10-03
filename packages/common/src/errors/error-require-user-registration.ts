// Copyright 2018 Prescryptive Health, Inc.

import { ErrorConstants } from '../theming/constants';

export class ErrorRequireUserRegistration extends Error {
  constructor() {
    const errorMessage = ErrorConstants.errorRequireUserRegistration;
    super(errorMessage);
    Object.setPrototypeOf(this, ErrorRequireUserRegistration.prototype);
  }
}

// Copyright 2018 Prescryptive Health, Inc.

import { ErrorConstants } from '../theming/constants';

export class ErrorShowPinFeatureWelcomeScreen extends Error {
  constructor() {
    const errorMessage = ErrorConstants.errorRequireUserSetPin;
    super(errorMessage);
    Object.setPrototypeOf(this, ErrorShowPinFeatureWelcomeScreen.prototype);
  }
}

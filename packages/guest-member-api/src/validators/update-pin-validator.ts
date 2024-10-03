// Copyright 2020 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { UpdatePinValidationMessage as responseMessage } from '../constants/response-messages';
import { validate } from '../utils/request-validator';

export class UpdatePinRequestValidator {
  public validate = [
    body('encryptedPinCurrent')
      .not()
      .isEmpty()
      .withMessage(responseMessage.ENCRYPTED_PIN_CURRENT_REQUIRED)
      .trim(),
    body('encryptedPinNew')
      .not()
      .isEmpty()
      .withMessage(responseMessage.ENCRYPTED_PIN_NEW_REQUIRED)
      .trim(),
    validate,
  ];
}

// Copyright 2020 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { AddPinValidationCodes as responseMessage } from '../constants/response-messages';
import { validate } from '../utils/request-validator';

export class AddPinRequestValidator {
  public validate = [
    body('encryptedPin')
      .not()
      .isEmpty()
      .withMessage(responseMessage.ENCRYPTED_PIN_REQUIRED)
      .trim(),
    validate,
  ];
}

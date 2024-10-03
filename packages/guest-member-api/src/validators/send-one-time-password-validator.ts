// Copyright 2018 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { SendOneTimePasswordRequestValidationCodes as responseMessage } from '../constants/response-messages';
import { validate } from '../utils/request-validator';

export class SendOneTimePasswordRequestValidator {
  public validate = [
    body('phoneNumber')
      .not()
      .isEmpty()
      .withMessage(responseMessage.PHONE_NUMBER_REQUIRED)
      .trim(),
    validate,
  ];
}

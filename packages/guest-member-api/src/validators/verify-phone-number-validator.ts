// Copyright 2018 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { VerifyPhoneNumberValidationCodes as responseMessage } from '../constants/response-messages';
import { validate } from '../utils/request-validator';

export class VerifyPhoneNumberRequestValidator {
  public validate = [
    body('code')
      .not()
      .isEmpty()
      .withMessage(responseMessage.CODE_REQUIRED)
      .custom((code) => {
        return code.match(/^[0-9]{6}$/);
      })
      .withMessage(responseMessage.INVALID_CODE)
      .trim(),
    body('phoneNumber')
      .not()
      .isEmpty()
      .withMessage(responseMessage.PHONE_NUMBER_REQUIRED)
      .trim(),
    validate,
  ];
}

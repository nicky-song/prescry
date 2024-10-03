// Copyright 2018 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { MemberUpdateRequestValidationCodes as responseMessage } from '../constants/response-messages';
import { validate } from '../utils/request-validator';

export class MemberUpdateRequestValidator {
  public validate = [
    body('email')
      .not()
      .isEmpty()
      .withMessage(responseMessage.EMAIL_ID_REQUIRED)
      .custom((email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
      })
      .withMessage(responseMessage.INVALID_EMAIL_ID)
      .trim(),
    body('phoneNumber')
      .not()
      .isEmpty()
      .withMessage(responseMessage.PHONE_NUMBER_REQUIRED)
      .trim(),
    validate,
  ];
}

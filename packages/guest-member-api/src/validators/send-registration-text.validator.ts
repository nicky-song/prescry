// Copyright 2021 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { VerifyPhoneNumberValidationCodes as responseMessage } from '../constants/response-messages';
import { validate } from '../utils/request-validator';
import { isPhoneNumberValid } from '@phx/common/src/utils/validators/phone-number.validator';

export class SendRegistrationTextRequestValidator {
  public validate = [
    body('phoneNumber')
      .not()
      .isEmpty()
      .withMessage(responseMessage.PHONE_NUMBER_REQUIRED)
      .trim()
      .custom(isPhoneNumberValid),
    validate,
  ];
}

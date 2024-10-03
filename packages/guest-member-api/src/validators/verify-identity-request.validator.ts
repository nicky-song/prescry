// Copyright 2021 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { isEmailValid } from '@phx/common/src/utils/email.helper';
import DateValidator from '@phx/common/src/utils/validators/date.validator';
import { validate } from '../utils/request-validator';
import { isPhoneNumberValid } from '@phx/common/src/utils/validators/phone-number.validator';

export class VerifyIdentityRequestValidator {
  public verifyIdentityValidate = [
    body('phoneNumber')
      .not()
      .isEmpty()
      .withMessage({ code: 'PHONE_NUMBER_REQUIRED' })
      .bail()
      .trim()
      .custom(isPhoneNumberValid)
      .withMessage({ code: 'PHONE_NUMBER_INVALID' }),
    body('emailAddress')
      .not()
      .isEmpty()
      .withMessage({ code: 'EMAIL_ADDRESS_REQUIRED' })
      .bail()
      .trim()
      .custom(isEmailValid)
      .withMessage({ code: 'INVALID_EMAIL_ADDRESS' }),
    body('dateOfBirth')
      .not()
      .isEmpty()
      .withMessage({ code: 'DATE_OF_BIRTH_REQUIRED' })
      .bail()
      .trim()
      .custom(DateValidator.isDateOfBirthValid)
      .withMessage({ code: 'DATE_OF_BIRTH_INVALID' }),
    validate,
  ];
}

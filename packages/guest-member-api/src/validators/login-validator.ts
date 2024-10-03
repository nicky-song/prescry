// Copyright 2018 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { isEmailValid } from '@phx/common/src/utils/email.helper';
import { LoginRequestValidationCodes as responseMessage } from '../constants/response-messages';
import { validate } from '../utils/request-validator';
import { validateMemberDateOfBirth } from './member-date-of-birth.validator';

export class LoginRequestValidator {
  public login = [
    body('firstName')
      .not()
      .isEmpty()
      .withMessage(responseMessage.FIRSTNAME_REQUIRED)
      .bail()
      .isLength({ max: 255, min: 1 })
      .withMessage(responseMessage.MAX_LENGTH_EXCEEDED)
      .trim(),
    body('lastName')
      .not()
      .isEmpty()
      .withMessage(responseMessage.LASTNAME_REQUIRED)
      .bail()
      .isLength({ max: 255, min: 1 })
      .withMessage(responseMessage.MAX_LENGTH_EXCEEDED)
      .trim(),
    body('dateOfBirth')
      .not()
      .isEmpty()
      .withMessage(responseMessage.DATE_OF_BIRTH_REQUIRED)
      .bail()
      .custom(validateMemberDateOfBirth)
      .withMessage(responseMessage.INVALID_DATE_FORMAT)
      .trim(),
    body('accountRecoveryEmail')
      .not()
      .isEmpty()
      .withMessage(responseMessage.EMAIL_ID_REQUIRED)
      .bail()
      .custom(isEmailValid)
      .withMessage(responseMessage.INVALID_EMAIL_ID)
      .trim(),
    validate,
  ];
}

// Copyright 2021 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { validate } from '../utils/request-validator';
import { isEmailValid } from '@phx/common/src/utils/email.helper';

export class RecoveryEmailRequestValidator {
  public addRecoveryEmailValidate = [
    body('email')
      .not()
      .isEmpty()
      .withMessage({ code: 'EMAIL_REQUIRED' })
      .bail()
      .custom(isEmailValid)
      .withMessage({ code: 'INVALID_EMAIL_ADDRESS' })
      .trim(),
    validate,
  ];

  public updateRecoveryEmailValidate = [
    body('email')
      .not()
      .isEmpty()
      .withMessage({ code: 'NEW_EMAIL_REQUIRED' })
      .bail()
      .custom(isEmailValid)
      .withMessage({ code: 'INVALID_EMAIL_ADDRESS' })
      .trim(),
    body('oldEmail')
      .not()
      .isEmpty()
      .withMessage({ code: 'OLD_EMAIL_REQUIRED' })
      .bail(),
    validate,
  ];
}

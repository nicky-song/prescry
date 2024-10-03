// Copyright 2022 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { validate } from '../utils/request-validator';
import { validateMemberDateOfBirth } from './member-date-of-birth.validator';

export class VerifyPrescriptionInfoRequestValidator {
  public verifyIdentityValidate = [
    body('firstName')
      .not()
      .isEmpty()
      .withMessage({ code: 'FIRSTNAME_REQUIRED' })
      .bail()
      .isLength({ max: 255, min: 1 })
      .withMessage({ code: 'MAX_LENGTH_EXCEEDED' })
      .trim(),
    body('dateOfBirth')
      .not()
      .isEmpty()
      .withMessage({ code: 'DATE_OF_BIRTH_REQUIRED' })
      .bail()
      .trim()
      .custom(validateMemberDateOfBirth)
      .withMessage({ code: 'DATE_OF_BIRTH_INVALID' }),
    validate,
  ];
}

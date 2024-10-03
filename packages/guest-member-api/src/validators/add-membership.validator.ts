// Copyright 2018 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { validate } from '../utils/request-validator';
import { validateMemberDateOfBirth } from './member-date-of-birth.validator';

export class AddMembershipRequestValidator {
  public addMembershipValidate = [
    body('firstName')
      .not()
      .isEmpty()
      .withMessage({ code: 'FIRSTNAME_REQUIRED' })
      .bail()
      .isLength({ max: 255, min: 1 })
      .withMessage({ code: 'MAX_LENGTH_EXCEEDED' })
      .trim(),
    body('lastName')
      .not()
      .isEmpty()
      .withMessage({ code: 'LASTNAME_REQUIRED' })
      .bail()
      .isLength({ max: 255, min: 1 })
      .withMessage({ code: 'MAX_LENGTH_EXCEEDED' })
      .trim(),
    body('primaryMemberRxId')
      .not()
      .isEmpty()
      .withMessage({ code: 'PRIMARY_RX_ID_REQUIRED' })
      .trim(),
    body('dateOfBirth')
      .not()
      .isEmpty()
      .withMessage({ code: 'DATE_OF_BIRTH_REQUIRED' })
      .bail()
      .custom(validateMemberDateOfBirth)
      .withMessage({ code: 'INVALID_DATE_FORMAT' })
      .trim(),
    validate,
  ];
}

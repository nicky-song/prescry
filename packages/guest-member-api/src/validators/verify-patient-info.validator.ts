// Copyright 2023 Prescryptive Health, Inc.

import { body, param } from 'express-validator';
import { validate } from '../utils/request-validator';
import { validateMemberDateOfBirth } from './member-date-of-birth.validator';

export class VerifyPatientInfoRequestValidator {
  public verifyPatientInfoValidate = [
    param('smartContractAddress')
      .not()
      .isEmpty()
      .withMessage({ code: 'SMART_CONTRACT_ADDRESS_REQUIRED' })
      .bail()
      .isLength({ max: 255, min: 1 })
      .withMessage({ code: 'MAX_LENGTH_EXCEEDED' })
      .trim(),
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

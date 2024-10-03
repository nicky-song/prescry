// Copyright 2018 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { isEmailValid } from '@phx/common/src/utils/email.helper';
import { isPhoneNumberValid } from '@phx/common/src/utils/validators/phone-number.validator';
import { validate } from '../utils/request-validator';
import { validateMemberDateOfBirth } from './member-date-of-birth.validator';

export class VerifyMembershipRequestValidator {
  public verifyMembership = [
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
      .custom(validateMemberDateOfBirth)
      .withMessage({ code: 'INVALID_DATE_FORMAT' })
      .trim(),
    body('email')
      .not()
      .isEmpty()
      .withMessage({ code: 'EMAIL_ID_REQUIRED' })
      .bail()
      .custom(isEmailValid)
      .withMessage({ code: 'INVALID_EMAIL_ID' })
      .trim(),
    body('primaryMemberRxId')
      .not()
      .isEmpty()
      .withMessage({ code: 'MEMBER_ID_REQUIRED' })
      .bail()
      .trim(),
    body('phoneNumber')
      .not()
      .isEmpty()
      .withMessage({ code: 'PHONE_NUMBER_REQUIRED' })
      .bail()
      .trim()
      .custom(isPhoneNumberValid)
      .withMessage({ code: 'INVALID_PHONE_NUMBER' }),
    validate,
  ];
}

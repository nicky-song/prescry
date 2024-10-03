// Copyright 2018 Prescryptive Health, Inc.

import {
  LoginRequestValidationCodes,
  SmartPriceRegistrationCodes,
} from '../../../constants/response-messages';
import { MemberUpdateRequestValidationCodes } from '../../../constants/response-messages';

import { validate } from '../../../utils/request-validator';
import { isEmailValid } from '@phx/common/src/utils/email.helper';
import { isPhoneNumberValid } from '@phx/common/src/utils/validators/phone-number.validator';
import { body } from 'express-validator';

export const SmartPriceRegistrationMinAge = 13;
export const RegexPhone = /^\+1(\d{10})$/;

export const validateDateOfBirthForSmartPricePlan = (
  dateOfBirth: string
): boolean => {
  const dobNumber = Date.parse((dateOfBirth || '').trim());
  if (isNaN(dobNumber)) {
    return false;
  }

  const dob = new Date(dobNumber);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();
  const minDateOfBirth = new Date(
    year - SmartPriceRegistrationMinAge,
    month,
    date
  );
  return dob < minDateOfBirth;
};

export class SmartPriceRegistrationRequestValidator {
  public registration = [
    body('firstName')
      .not()
      .isEmpty()
      .withMessage(LoginRequestValidationCodes.FIRSTNAME_REQUIRED)
      .bail()
      .isLength({ max: 255, min: 1 })
      .withMessage(LoginRequestValidationCodes.MAX_LENGTH_EXCEEDED)
      .trim(),
    body('lastName')
      .not()
      .isEmpty()
      .withMessage(LoginRequestValidationCodes.LASTNAME_REQUIRED)
      .bail()
      .isLength({ max: 255, min: 1 })
      .withMessage(LoginRequestValidationCodes.MAX_LENGTH_EXCEEDED)
      .trim(),
    body('dateOfBirth')
      .not()
      .isEmpty()
      .withMessage(LoginRequestValidationCodes.DATE_OF_BIRTH_REQUIRED)
      .bail()
      .trim()
      .custom(validateDateOfBirthForSmartPricePlan)
      .withMessage(SmartPriceRegistrationCodes.DATE_OF_BIRTH_NOT_ALLOWED),
    body('email')
      .not()
      .isEmpty()
      .withMessage(MemberUpdateRequestValidationCodes.EMAIL_ID_REQUIRED)
      .bail()
      .custom(isEmailValid)
      .withMessage(MemberUpdateRequestValidationCodes.INVALID_EMAIL_ID)
      .trim(),
    body('phoneNumber')
      .not()
      .isEmpty()
      .withMessage(MemberUpdateRequestValidationCodes.PHONE_NUMBER_REQUIRED)
      .bail()
      .trim()
      .custom(isPhoneNumberValid)
      .withMessage(SmartPriceRegistrationCodes.VALID_PHONE_NUMBER_REQUIRED),
    body('verifyCode')
      .not()
      .isEmpty()
      .withMessage('Verification code is required')
      .bail()
      .isLength({ max: 6, min: 6 })
      .withMessage('Verification code is required')
      .trim(),
    body('consent').not().equals('true').withMessage('Eligibility consent'),
    body('terms')
      .not()
      .equals('true')
      .withMessage('Must accept terms, conditions and privacy policy'),
    validate,
  ];

  public appRegistration = [
    body('firstName')
      .not()
      .isEmpty()
      .withMessage(LoginRequestValidationCodes.FIRSTNAME_REQUIRED)
      .bail()
      .isLength({ max: 255, min: 1 })
      .withMessage(LoginRequestValidationCodes.MAX_LENGTH_EXCEEDED)
      .trim(),
    body('lastName')
      .not()
      .isEmpty()
      .withMessage(LoginRequestValidationCodes.LASTNAME_REQUIRED)
      .bail()
      .isLength({ max: 255, min: 1 })
      .withMessage(LoginRequestValidationCodes.MAX_LENGTH_EXCEEDED)
      .trim(),
    body('dateOfBirth')
      .not()
      .isEmpty()
      .withMessage(LoginRequestValidationCodes.DATE_OF_BIRTH_REQUIRED)
      .bail()
      .trim()
      .custom(validateDateOfBirthForSmartPricePlan)
      .withMessage(SmartPriceRegistrationCodes.DATE_OF_BIRTH_NOT_ALLOWED),
    body('email')
      .not()
      .isEmpty()
      .withMessage(MemberUpdateRequestValidationCodes.EMAIL_ID_REQUIRED)
      .bail()
      .custom(isEmailValid)
      .withMessage(MemberUpdateRequestValidationCodes.INVALID_EMAIL_ID)
      .trim(),
    body('phoneNumber')
      .not()
      .isEmpty()
      .withMessage(MemberUpdateRequestValidationCodes.PHONE_NUMBER_REQUIRED)
      .bail()
      .trim()
      .custom(isPhoneNumberValid)
      .withMessage(SmartPriceRegistrationCodes.VALID_PHONE_NUMBER_REQUIRED),
    validate,
  ];
}

// Copyright 2022 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { MemberUpdateRequestValidationCodes } from '../constants/response-messages';
import { validate } from '../utils/request-validator';

export class LanguageCodeValidator {
  public updateLanguageCodeValidate = [
    body('languageCode')
      .not()
      .isEmpty()
      .withMessage(MemberUpdateRequestValidationCodes.LANGUAGE_CODE_REQUIRED)
      .bail()
      .trim(),
    validate,
  ];
}

// Copyright 2022 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { SsoJwtTokenValidationCodes } from '../constants/response-messages';

import { validate } from '../utils/request-validator';

export class VerifySsoJwtTokenRequestValidator {
  public validateRequest = [
    body('jwt_token')
      .not()
      .isEmpty()
      .withMessage(SsoJwtTokenValidationCodes.JWT_TOKEN_REQUIRED)
      .trim(),
    validate,
  ];
}

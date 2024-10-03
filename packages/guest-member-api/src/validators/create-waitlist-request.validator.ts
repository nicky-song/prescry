// Copyright 2018 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { validate } from '../utils/request-validator';

export class CreateWaitlistRequestValidator {
  public createWaitlistValidate = [
    body('serviceType')
      .not()
      .isEmpty()
      .withMessage({ code: 'SERVICETYPE_REQUIRED' })
      .bail()
      .trim(),
    body('zipCode')
      .not()
      .isEmpty()
      .withMessage({ code: 'ZIPCODE_REQUIRED' })
      .bail()
      .trim()
      .isLength({ max: 5, min: 5 })
      .withMessage({ code: 'INVALID_LENGTH_ZIPCODE' }),
    body('maxMilesAway')
      .not()
      .isEmpty()
      .withMessage({ code: 'MILES_REQUIRED' })
      .trim(),
    validate,
  ];
}

// Copyright 2021 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { validate } from '../utils/request-validator';

export class SendPrescriptionRequestValidator {
  public validate = [
    body('ncpdp')
      .not()
      .isEmpty()
      .withMessage({ code: 'PHARMACY_NCPDP_REQUIRED' })
      .trim(),
    body('identifier')
      .not()
      .isEmpty()
      .withMessage({ code: 'PRESCRIPTION_IDENTIFIER_REQUIRED' })
      .bail(),
    validate,
  ];
}

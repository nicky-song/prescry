// Copyright 2021 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { validate } from '../utils/request-validator';

export class TransferPrescriptionRequestValidator {
  public validate = [
    body('sourceNcpdp')
      .not()
      .isEmpty()
      .withMessage({ code: 'SOURCE_PHARMACY_NCPDP_REQUIRED' })
      .bail()
      .trim(),
    body('destinationNcpdp')
      .not()
      .isEmpty()
      .withMessage({ code: 'DESTINATION_PHARMACY_NCPDP_REQUIRED' })
      .bail()
      .trim(),
    body('daysSupply')
      .not()
      .isEmpty()
      .withMessage({ code: 'DAYS_SUPPLY_REQUIRED' })
      .bail(),
    body('quantity')
      .not()
      .isEmpty()
      .withMessage({ code: 'QUANTITY_REQUIRED' })
      .bail(),
    body('ndc').not().isEmpty().withMessage({ code: 'NDC_REQUIRED' }).bail(),
    validate,
  ];
}

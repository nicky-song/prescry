// Copyright 2018 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { validate } from '../utils/request-validator';

export class ProviderLocationRequestValidator {
  public getAvailabilityValidate = [
    body('locationId')
      .not()
      .isEmpty()
      .withMessage({ code: 'LOCATION_ID_REQUIRED' })
      .trim(),
    body('serviceType')
      .not()
      .isEmpty()
      .withMessage({
        code: 'SERVICE_TYPE_REQUIRED',
      })
      .trim(),
    body('start')
      .not()
      .isEmpty()
      .withMessage({ code: 'START_DATE_REQUIRED' })
      .trim(),
    body('end')
      .not()
      .isEmpty()
      .withMessage({ code: 'END_DATE_REQUIRED' })
      .trim(),
    validate,
  ];
  public createBookingValidate = [
    body('locationId')
      .not()
      .isEmpty()
      .withMessage({ code: 'LOCATION_ID_REQUIRED' })
      .trim(),
    body('serviceType')
      .not()
      .isEmpty()
      .withMessage({
        code: 'SERVICE_TYPE_REQUIRED',
      })
      .trim(),
    body('start')
      .not()
      .isEmpty()
      .withMessage({ code: 'START_DATE_REQUIRED' })
      .trim(),
    validate,
  ];

  public cancelBookingValidate = [
    body('orderNumber')
      .not()
      .isEmpty()
      .withMessage({ code: 'ORDER_NUMBER_REQUIRED' })
      .trim(),
    validate,
  ];

  public lockSlotValidate = [
    body('locationId')
      .not()
      .isEmpty()
      .withMessage({ code: 'LOCATION_ID_REQUIRED' })
      .trim(),
    body('serviceType')
      .not()
      .isEmpty()
      .withMessage({
        code: 'SERVICE_TYPE_REQUIRED',
      })
      .trim(),
    body('startDate')
      .not()
      .isEmpty()
      .withMessage({ code: 'START_DATE_REQUIRED' })
      .trim(),
    body('customerPhoneNumber')
      .not()
      .isEmpty()
      .withMessage({ code: 'PHONE_NUMBER_REQUIRED' })
      .trim(),
    validate,
  ];
}

// Copyright 2021 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { validate } from '../utils/request-validator';

export class RemoveWaitlistRequestValidator {
  public validate = [
    body('To').not().isEmpty().withMessage({ code: 'TO_REQUIRED' }).bail(),
    body('AccountSid')
      .not()
      .isEmpty()
      .withMessage({ code: 'ACCOUNT_SID_REQUIRED' })
      .bail(),
    body('MessageSid')
      .not()
      .isEmpty()
      .withMessage({ code: 'MESSAGE_SID_REQUIRED' })
      .bail(),
    body('Body')
      .not()
      .isEmpty()
      .withMessage({ code: 'MESSAGE_BODY_REQUIRED' })
      .bail(),
    body('From')
      .not()
      .isEmpty()
      .withMessage({ code: 'MESSAGE_FROM_REQUIRED' })
      .bail(),
    body('FromCity')
      .not()
      .isEmpty()
      .withMessage({ code: 'MESSAGE_FROM_CITY_REQUIRED' })
      .bail(),
    body('FromState')
      .not()
      .isEmpty()
      .withMessage({ code: 'MESSAGE_FROM_STATE_REQUIRED' })
      .bail(),
    body('FromZip')
      .not()
      .isEmpty()
      .withMessage({ code: 'MESSAGE_FROM_ZIP_REQUIRED' })
      .bail(),
    validate,
  ];
}

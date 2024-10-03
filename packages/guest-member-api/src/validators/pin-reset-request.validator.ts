// Copyright 2021 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { VerificationTypesEnum } from '@phx/common/src/models/api-request-body/send-verification-code.request-body';
import { validate } from '../utils/request-validator';

export class PinResetRequestValidator {
  public sendVerificationCodeValidate = [
    body('verificationType')
      .not()
      .isEmpty()
      .withMessage({ code: 'VERIFICATION_TYPE_REQUIRED' })
      .bail()
      .trim()
      .isIn(Object.keys(VerificationTypesEnum))
      .withMessage({ code: 'VERIFICATION_TYPE_INVALID' }),
    validate,
  ];

  public resetPinValidate = [
    body('verificationType')
      .not()
      .isEmpty()
      .withMessage({ code: 'VERIFICATION_TYPE_REQUIRED' })
      .bail()
      .trim()
      .isIn(Object.keys(VerificationTypesEnum))
      .withMessage({ code: 'VERIFICATION_TYPE_INVALID' }),
    body('maskedValue')
      .not()
      .isEmpty()
      .withMessage({ code: 'MASKED_VALUE_REQUIRED' })
      .bail()
      .trim(),
    body('code')
      .not()
      .isEmpty()
      .withMessage({ code: 'VERIFICATION_CODE_REQUIRED' })
      .bail()
      .trim()
      .custom((code) => {
        return code.match(/^[0-9]{6}$/);
      })
      .withMessage({ code: 'VERIFICATION_CODE_INVALID' }),
    validate,
  ];
}

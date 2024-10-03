// Copyright 2021 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import { VerifyPhoneNumberValidationCodes as responseMessage } from '../constants/response-messages';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { SendRegistrationTextRequestValidator } from './send-registration-text.validator';

const ResponseMock = {} as Response;

describe('Send Registration Text Validator', () => {
  it('empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new SendRegistrationTextRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(2);
    expect(errors[0].msg).toEqual(responseMessage.PHONE_NUMBER_REQUIRED);
  });
  it('should not generate error if phone number is defined and valid', async () => {
    const requestMock = {
      body: { phoneNumber: '+12345678910' },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new SendRegistrationTextRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

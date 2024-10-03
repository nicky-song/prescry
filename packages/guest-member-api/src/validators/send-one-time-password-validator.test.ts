// Copyright 2018 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import { SendOneTimePasswordRequestValidationCodes as responseMessage } from '../constants/response-messages';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { SendOneTimePasswordRequestValidator } from './send-one-time-password-validator';

const ResponseMock = {} as Response;

describe('Send OneTimePassword Validator', () => {
  it('empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new SendOneTimePasswordRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(responseMessage.PHONE_NUMBER_REQUIRED);
  });
  it('should not generate error if phone number is defined', async () => {
    const requestMock = {
      body: { phoneNumber: '1234567890' },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new SendOneTimePasswordRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

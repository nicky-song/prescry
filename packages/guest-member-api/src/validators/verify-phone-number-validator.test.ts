// Copyright 2018 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import { VerifyPhoneNumberValidationCodes as responseMessage } from '../constants/response-messages';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { VerifyPhoneNumberRequestValidator } from './verify-phone-number-validator';

const ResponseMock = {} as Response;

describe('Verify Phone Number Validator', () => {
  it('empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPhoneNumberRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(3);
  });

  it('should Invaidate Request for Missing Code ', async () => {
    const requestMock = {
      body: {
        phoneNumber: 'mock-phoneNumber',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPhoneNumberRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(2);
    expect(errors[0].msg).toEqual(responseMessage.CODE_REQUIRED);
  });

  it('should Invaidate Request If code is not a number', async () => {
    const requestMock = {
      body: {
        code: '12345u',
        phoneNumber: 'mock-phoneNumber',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPhoneNumberRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.INVALID_CODE);
  });

  it('should Invaidate Request If code length is not 6', async () => {
    const requestMock = {
      body: {
        code: '12345678',
        phoneNumber: 'mock-phoneNumber',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPhoneNumberRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.INVALID_CODE);
  });

  it('should Invaidate Request for Missing phoneNumber ', async () => {
    const requestMock = {
      body: {
        code: '123456',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPhoneNumberRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.PHONE_NUMBER_REQUIRED);
  });

  it('should not generate error if valid data is provided in request body', async () => {
    const requestMock = {
      body: { phoneNumber: '1234567890', code: '123456' },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPhoneNumberRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

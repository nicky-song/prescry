// Copyright 2018 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import { AddPinValidationCodes as responseMessage } from '../constants/response-messages';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { AddPinRequestValidator } from './add-pin-validator';

const ResponseMock = {} as Response;

describe('Add Pin Validator', () => {
  it('empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new AddPinRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });

  it('should Invaidate Request for Missing encryptedPin', async () => {
    const requestMock = {
      body: {
        pin: 'encryptedPin',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new AddPinRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.ENCRYPTED_PIN_REQUIRED);
  });

  it('should not generate error if valid data is provided in request body', async () => {
    const requestMock = {
      body: {
        encryptedPin: 'encryptedPin',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new AddPinRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

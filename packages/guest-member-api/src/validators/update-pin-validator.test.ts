// Copyright 2020 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import { UpdatePinValidationMessage as responseMessage } from '../constants/response-messages';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { UpdatePinRequestValidator } from './update-pin-validator';

const ResponseMock = {} as Response;

describe('UpdatePinRequestValidator', () => {
  it('should Invalidate Request for Missing encryptedPinCurrent', async () => {
    const requestMock = {
      body: {
        encryptedPinNew: 'encryptedPinNew',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new UpdatePinRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(
      responseMessage.ENCRYPTED_PIN_CURRENT_REQUIRED
    );
  });

  it('should Invalidate Request for Missing encryptedPinNew', async () => {
    const requestMock = {
      body: {
        encryptedPinCurrent: 'encryptedPinCurrent',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new UpdatePinRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.ENCRYPTED_PIN_NEW_REQUIRED);
  });

  it('should not generate error if valid data is provided in request body', async () => {
    const requestMock = {
      body: {
        encryptedPinCurrent: 'encryptedPinCurrent',
        encryptedPinNew: 'encryptedPinNew',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new UpdatePinRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

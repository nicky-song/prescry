// Copyright 2021 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import {
  ResponseCode,
  WaitlistValidationCodes,
} from '@phx/common/src/experiences/guest-experience/api/api-response-codes';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { CreateWaitlistRequestValidator } from './create-waitlist-request.validator';

const ResponseMock = {} as Response;

describe('CreateWaitlistRequestValidator:  createWaitlistValidate', () => {
  it('Empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateWaitlistRequestValidator().createWaitlistValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(3);
  });
  it('Should Invalidate Request for missing serviceType ', async () => {
    const requestMock = {
      body: {
        zipCode: '12345',
        maxMilesAway: 10,
      },
    } as unknown as Request;
    const validationError: ResponseCode<WaitlistValidationCodes> = {
      code: 'SERVICETYPE_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateWaitlistRequestValidator().createWaitlistValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing zipCode ', async () => {
    const requestMock = {
      body: {
        serviceType: 'service-type',
        maxMilesAway: 10,
      },
    } as unknown as Request;
    const validationError: ResponseCode<WaitlistValidationCodes> = {
      code: 'ZIPCODE_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateWaitlistRequestValidator().createWaitlistValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for invalid zipCode ', async () => {
    const requestMock = {
      body: {
        serviceType: 'service-type',
        zipCode: '1235',
        maxMilesAway: 10,
      },
    } as unknown as Request;
    const validationError: ResponseCode<WaitlistValidationCodes> = {
      code: 'INVALID_LENGTH_ZIPCODE',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateWaitlistRequestValidator().createWaitlistValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing maxMilesAway ', async () => {
    const requestMock = {
      body: {
        zipCode: '12345',
        serviceType: 'service-type',
      },
    } as unknown as Request;
    const validationError: ResponseCode<WaitlistValidationCodes> = {
      code: 'MILES_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateWaitlistRequestValidator().createWaitlistValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should not return error if request body is valid', async () => {
    const requestMock = {
      body: {
        zipCode: '12345',
        serviceType: 'service-type',
        maxMilesAway: 10,
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateWaitlistRequestValidator().createWaitlistValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

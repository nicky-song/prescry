// Copyright 2020 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import {
  ProviderLocationRequestValidationCodes,
  ResponseCode,
} from '@phx/common/src/experiences/guest-experience/api/api-response-codes';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { ProviderLocationRequestValidator } from './provider-location-request.validator';

const ResponseMock = {} as Response;

describe('ProviderLocationRequest Validations Tests getAvailabilityValidate', () => {
  it('Empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new ProviderLocationRequestValidator().getAvailabilityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(4);
  });

  it('Should Invaidate Request for Missing location id ', async () => {
    const requestMock = {
      body: {
        serviceType: '111',
        start: '2020-11-15',
        end: '2020-11-30',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new ProviderLocationRequestValidator().getAvailabilityValidate
    );
    const validationError: ResponseCode<ProviderLocationRequestValidationCodes> =
      {
        code: 'LOCATION_ID_REQUIRED',
      };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invaidate Request for Missing serviceType ', async () => {
    const requestMock = {
      body: {
        locationId: '122',
        start: '2020-11-15',
        end: '2020-11-30',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new ProviderLocationRequestValidator().getAvailabilityValidate
    );
    const validationError: ResponseCode<ProviderLocationRequestValidationCodes> =
      {
        code: 'SERVICE_TYPE_REQUIRED',
      };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invaidate Request for Missing start date ', async () => {
    const requestMock = {
      body: {
        locationId: '122',
        serviceType: '111',
        end: '2020-11-30',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new ProviderLocationRequestValidator().getAvailabilityValidate
    );
    const validationError: ResponseCode<ProviderLocationRequestValidationCodes> =
      {
        code: 'START_DATE_REQUIRED',
      };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invaidate Request for Missing end time ', async () => {
    const requestMock = {
      body: {
        locationId: '122',
        serviceType: '111',
        start: '2020-11-15',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new ProviderLocationRequestValidator().getAvailabilityValidate
    );
    const validationError: ResponseCode<ProviderLocationRequestValidationCodes> =
      {
        code: 'END_DATE_REQUIRED',
      };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should not have any errors if request is valid ', async () => {
    const requestMock = {
      body: {
        locationId: '122',
        serviceType: '111',
        start: '2020-11-15',
        end: '2020-11-30',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new ProviderLocationRequestValidator().getAvailabilityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(0);
  });
});

describe('ProviderLocationRequest Validations Tests createBookingValidate', () => {
  it('Empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new ProviderLocationRequestValidator().createBookingValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(3);
  });

  it('Should Invaidate Request for Missing location id ', async () => {
    const requestMock = {
      body: {
        serviceType: '111',
        start: '2020-11-15',
        questions: [],
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new ProviderLocationRequestValidator().createBookingValidate
    );
    const validationError: ResponseCode<ProviderLocationRequestValidationCodes> =
      {
        code: 'LOCATION_ID_REQUIRED',
      };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invaidate Request for Missing serviceType ', async () => {
    const requestMock = {
      body: {
        locationId: '122',
        start: '2020-11-15',
        questions: [],
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new ProviderLocationRequestValidator().createBookingValidate
    );
    const validationError: ResponseCode<ProviderLocationRequestValidationCodes> =
      {
        code: 'SERVICE_TYPE_REQUIRED',
      };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invaidate Request for Missing start date ', async () => {
    const requestMock = {
      body: {
        locationId: '122',
        serviceType: '111',
        questions: [],
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new ProviderLocationRequestValidator().createBookingValidate
    );
    const validationError: ResponseCode<ProviderLocationRequestValidationCodes> =
      {
        code: 'START_DATE_REQUIRED',
      };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should not have any errors if request is valid ', async () => {
    const requestMock = {
      body: {
        locationId: '122',
        serviceType: '111',
        start: '2020-11-15',
        questions: [],
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new ProviderLocationRequestValidator().createBookingValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(0);
  });
});

describe('ProviderLocationRequest Validations Tests cancelBookingValidate', () => {
  it('Should not have any errors if request is valid ', async () => {
    const requestMock = {
      body: {
        orderNumber: '1234',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new ProviderLocationRequestValidator().cancelBookingValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(0);
  });
  it('Should Invalidate Request for Missing order Number', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new ProviderLocationRequestValidator().cancelBookingValidate
    );
    const validationError: ResponseCode<ProviderLocationRequestValidationCodes> =
      {
        code: 'ORDER_NUMBER_REQUIRED',
      };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });
});

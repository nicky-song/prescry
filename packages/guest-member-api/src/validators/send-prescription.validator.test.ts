// Copyright 2020 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import {
  ResponseCode,
  PrescriptionRequestValidationCodes,
} from '@phx/common/src/experiences/guest-experience/api/api-response-codes';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { SendPrescriptionRequestValidator } from './send-prescription.validator';

const ResponseMock = {} as Response;

describe('SendPrescriptionRequestValidator', () => {
  it('Empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new SendPrescriptionRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(2);
  });
  it('Should Invalidate Request for missing ncpdp ', async () => {
    const requestMock = {
      body: {
        identifier: 'id-1',
      },
    } as unknown as Request;
    const validationError: ResponseCode<PrescriptionRequestValidationCodes> = {
      code: 'PHARMACY_NCPDP_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new SendPrescriptionRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing identifier', async () => {
    const requestMock = {
      body: {
        ncpdp: 'ncpdp',
      },
    } as unknown as Request;
    const validationError: ResponseCode<PrescriptionRequestValidationCodes> = {
      code: 'PRESCRIPTION_IDENTIFIER_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new SendPrescriptionRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });

  it('Should not return error if request body is valid', async () => {
    const requestMock = {
      body: {
        ncpdp: 'ncpdp',
        identifier: 'id-1',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new SendPrescriptionRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

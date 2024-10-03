// Copyright 2021 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { TransferPrescriptionRequestValidator } from './transfer-prescription-validator';

const ResponseMock = {} as Response;

describe('Transfer Prescription Request Validator', () => {
  it('should generate validation errors when request is empty', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new TransferPrescriptionRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(5);
  });
  it('Should Invalidate Request for missing sourceNcpdp', async () => {
    const requestMock = {
      body: {
        destinationNcpdp: '5815141',
        ndc: '69665061001',
        daysSupply: 30,
        quantity: 5,
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new TransferPrescriptionRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual({ code: 'SOURCE_PHARMACY_NCPDP_REQUIRED' });
  });
  it('Should Invalidate Request for missing destination ncpdp', async () => {
    const requestMock = {
      body: {
        sourceNcpdp: '3300162',
        ndc: '69665061001',
        daysSupply: 30,
        quantity: 5,
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new TransferPrescriptionRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual({
      code: 'DESTINATION_PHARMACY_NCPDP_REQUIRED',
    });
  });
  it('Should Invalidate Request for missing days supply', async () => {
    const requestMock = {
      body: {
        sourceNcpdp: '3300162',
        destinationNcpdp: '5815141',
        ndc: '69665061001',
        quantity: 5,
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new TransferPrescriptionRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });
  it('Should Invalidate Request for missing quantity', async () => {
    const requestMock = {
      body: {
        sourceNcpdp: '3300162',
        destinationNcpdp: '5815141',
        ndc: '69665061001',
        daysSupply: 30,
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new TransferPrescriptionRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual({ code: 'QUANTITY_REQUIRED' });
  });
  it('should not generate error if request body is valid', async () => {
    const requestMock = {
      body: {
        sourceNcpdp: '3300162',
        destinationNcpdp: '5815141',
        ndc: '69665061001',
        daysSupply: 30,
        quantity: 5,
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new TransferPrescriptionRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

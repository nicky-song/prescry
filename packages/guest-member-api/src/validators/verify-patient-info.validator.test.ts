// Copyright 2023 Prescryptive Health, Inc.

import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { validationResult } from 'express-validator';
import { VerifyPatientInfoRequestValidator } from './verify-patient-info.validator';

const ResponseMock = {} as Response;

describe('VerifyPatientInfoRequestValidator', () => {
  it('throws no errors when all parameters are valid', async () => {
    const requestMock = {
      params: {
        smartContractAddress: 'smart-contract-address',
      },
      body: {
        firstName: 'JOHN',
        lastName: 'SMITH',
        dateOfBirth: 'January-01-2000',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPatientInfoRequestValidator().verifyPatientInfoValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });

  it('throws error when date of birth IS NOT valid', async () => {
    const requestMock = {
      params: {
        smartContractAddress: 'smart-contract-address',
      },
      body: {
        firstName: 'JOHN',
        lastName: 'SMITH',
        dateOfBirth: '2000',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPatientInfoRequestValidator().verifyPatientInfoValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });

  it('throws error when first name IS NOT valid', async () => {
    const requestMock = {
      params: {
        smartContractAddress: 'smart-contract-address',
      },
      body: {
        firstName: '',
        lastName: 'SMITH',
        dateOfBirth: 'January-01-2000',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPatientInfoRequestValidator().verifyPatientInfoValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });

  it('throws error when lastName IS NOT valid', async () => {
    const requestMock = {
      params: {
        smartContractAddress: 'smart-contract-address',
      },
      body: {
        firstName: 'JOHN',
        lastName: '',
        dateOfBirth: 'January-01-2000',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPatientInfoRequestValidator().verifyPatientInfoValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });

  it('throws error when smartContractAddress IS NOT valid', async () => {
    const requestMock = {
      params: {
        smartContractAddress: '',
      },
      body: {
        firstName: 'JOHN',
        lastName: 'SMITH',
        dateOfBirth: 'January-01-2000',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPatientInfoRequestValidator().verifyPatientInfoValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });
});

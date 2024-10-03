// Copyright 2022 Prescryptive Health, Inc.

import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { validationResult } from 'express-validator';
import { VerifyPrescriptionInfoRequestValidator } from './verify-prescription-info.validator';

const ResponseMock = {} as Response;

describe('VerifyPrescriptionInfoRequestValidator', () => {
  it('throws no errors when name, and date of birth are valid', async () => {
    const requestMock = {
      body: {
        firstName: 'JOHN',
        dateOfBirth: 'January-01-2000',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPrescriptionInfoRequestValidator().verifyIdentityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });

  it('throws error when name is valid, and date of birth IS NOT valid', async () => {
    const requestMock = {
      body: {
        firstName: 'JOHN',
        dateOfBirth: '2000',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPrescriptionInfoRequestValidator().verifyIdentityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });

  it('throws error when name is valid, and date of birth is missing', async () => {
    const requestMock = {
      body: {
        firstName: 'JOHN',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPrescriptionInfoRequestValidator().verifyIdentityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });

  it('throws error when name IS NOT valid, and date of birth is valid', async () => {
    const requestMock = {
      body: {
        firstName: '',
        dateOfBirth: 'January-01-2000',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPrescriptionInfoRequestValidator().verifyIdentityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });

  it('throws error when name is missing, and date of birth is valid', async () => {
    const requestMock = {
      body: {
        dateOfBirth: 'January-01-2000',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPrescriptionInfoRequestValidator().verifyIdentityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });

  it('throws error when name IS NOT valid, and date of birth IS NOT valid', async () => {
    const requestMock = {
      body: {
        firstName: '',
        dateOfBirth: '2000',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyPrescriptionInfoRequestValidator().verifyIdentityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(2);
  });
});

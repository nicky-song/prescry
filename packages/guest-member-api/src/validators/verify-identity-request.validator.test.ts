// Copyright 2021 Prescryptive Health, Inc.

import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { VerifyIdentityRequestValidator } from './verify-identity-request.validator';
import { validationResult } from 'express-validator';

const ResponseMock = {} as Response;

describe('VerifyIdentityRequestValidator', () => {
  it('throws no errors when phone, email, and date of birth are valid', async () => {
    const requestMock = {
      body: {
        phoneNumber: '+12223334455',
        emailAddress: 'email@email.com',
        dateOfBirth: '2000-01-01',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyIdentityRequestValidator().verifyIdentityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
  it('throws error when phone is missing', async () => {
    const requestMock = {
      body: {
        emailAddress: 'email@email.com',
        dateOfBirth: '2000-01-01',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyIdentityRequestValidator().verifyIdentityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual({ code: 'PHONE_NUMBER_REQUIRED' });
  });
  it('throws error when phone is invalid', async () => {
    const requestMock = {
      body: {
        phoneNumber: '+1222333445',
        emailAddress: 'email@email.com',
        dateOfBirth: '2000-01-01',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyIdentityRequestValidator().verifyIdentityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual({ code: 'PHONE_NUMBER_INVALID' });
  });
  it('throws error when email is missing', async () => {
    const requestMock = {
      body: {
        phoneNumber: '+12223334455',
        dateOfBirth: '2000-01-01',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyIdentityRequestValidator().verifyIdentityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual({ code: 'EMAIL_ADDRESS_REQUIRED' });
  });
  it('throws error when email is invalid', async () => {
    const requestMock = {
      body: {
        phoneNumber: '+12223334455',
        emailAddress: 'invalid-email',
        dateOfBirth: '2000-01-01',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyIdentityRequestValidator().verifyIdentityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual({ code: 'INVALID_EMAIL_ADDRESS' });
  });
  it('throws error when date of birth is missing', async () => {
    const requestMock = {
      body: {
        phoneNumber: '+12223334455',
        emailAddress: 'email@email.com',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyIdentityRequestValidator().verifyIdentityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual({ code: 'DATE_OF_BIRTH_REQUIRED' });
  });
  it('throws error when date of birth is missing', async () => {
    const requestMock = {
      body: {
        phoneNumber: '+12223334455',
        emailAddress: 'email@email.com',
        dateOfBirth: '20000',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifyIdentityRequestValidator().verifyIdentityValidate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual({ code: 'DATE_OF_BIRTH_INVALID' });
  });
});

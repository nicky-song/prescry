// Copyright 2018 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import { LoginRequestValidationCodes as responseMessage } from '../constants/response-messages';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { LoginRequestValidator } from '../validators/login-validator';

const ResponseMock = {} as Response;

describe('Login Validations Tests', () => {
  it('Empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new LoginRequestValidator().login
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(4);
  });

  it('Should Invalidate Request for Missing Firstname ', async () => {
    const requestMock = {
      body: {
        dateOfBirth: 'April-24-1987',
        lastName: 'TestName',
        primaryMemberRxId: 'AFT0012345',
        accountRecoveryEmail: 'test@test.com',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new LoginRequestValidator().login
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.FIRSTNAME_REQUIRED);
  });

  it('Should Invalidate Request for Max Length on Firstname ', async () => {
    const requestMock = {
      body: {
        dateOfBirth: 'April-24-1987',
        firstName:
          'TestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestName ',
        lastName: 'TestName',
        primaryMemberRxId: 'AFT0012345',
        accountRecoveryEmail: 'test@test.com',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new LoginRequestValidator().login
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.MAX_LENGTH_EXCEEDED);
  });

  it('Should Invalidate Request for Missing LastName ', async () => {
    const requestMock = {
      body: {
        dateOfBirth: 'April-24-1987',
        firstName: 'TestName',
        primaryMemberRxId: 'AFT0012345',
        accountRecoveryEmail: 'test@test.com',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new LoginRequestValidator().login
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.LASTNAME_REQUIRED);
  });

  it('Should Invalidate Request for Max Length on LastName ', async () => {
    const requestMock = {
      body: {
        dateOfBirth: 'April-24-1987',
        firstName: 'TestName',
        lastName:
          'TestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestName ',
        primaryMemberRxId: 'AFT0012345',
        accountRecoveryEmail: 'test@test.com',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new LoginRequestValidator().login
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.MAX_LENGTH_EXCEEDED);
  });

  it('Should Invalidate Request for Missing dateOfBirth ', async () => {
    const requestMock = {
      body: {
        firstName: 'TestName',
        lastName: 'TestlastName',
        primaryMemberRxId: 'AFT0012345',
        accountRecoveryEmail: 'test@test.com',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new LoginRequestValidator().login
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.DATE_OF_BIRTH_REQUIRED);
  });

  it('Should Invalidate Request for Invalid dateOfBirth ', async () => {
    const requestMock = {
      body: {
        dateOfBirth: '1981-12-21',
        firstName: 'TestName',
        lastName: 'TestlastName',
        primaryMemberRxId: 'AFT0012345',
        accountRecoveryEmail: 'test@test.com',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new LoginRequestValidator().login
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.INVALID_DATE_FORMAT);
  });
  it('Should Invalidate Request for Missing accountRecoveryEmail ', async () => {
    const requestMock = {
      body: {
        firstName: 'TestName',
        lastName: 'TestlastName',
        primaryMemberRxId: 'AFT0012345',
        dateOfBirth: 'April-24-1987',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new LoginRequestValidator().login
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.EMAIL_ID_REQUIRED);
  });

  it('Should Invalidate Request for Invalid accountRecoveryEmail ', async () => {
    const requestMock = {
      body: {
        dateOfBirth: 'April-24-1987',
        firstName: 'TestName',
        lastName: 'TestlastName',
        primaryMemberRxId: 'AFT0012345',
        accountRecoveryEmail: 'test@test',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new LoginRequestValidator().login
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.INVALID_EMAIL_ID);
  });
});

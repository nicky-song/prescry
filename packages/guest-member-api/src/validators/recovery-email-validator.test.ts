// Copyright 2021 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import {
  ResponseCode,
  RecoveryEmailValidationCodes,
} from '@phx/common/src/experiences/guest-experience/api/api-response-codes';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { RecoveryEmailRequestValidator } from './recovery-email-validator';

const ResponseMock = {} as Response;

describe('RecoveryEmailRequestValidator:  addRecoveryEmailValidate', () => {
  it('Empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RecoveryEmailRequestValidator().addRecoveryEmailValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });
  it('Should Invalidate Request for missing email ', async () => {
    const requestMock = {
      body: {
        lastName: 'TestName',
      },
    } as unknown as Request;
    const validationError: ResponseCode<RecoveryEmailValidationCodes> = {
      code: 'EMAIL_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RecoveryEmailRequestValidator().addRecoveryEmailValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for invalid email ', async () => {
    const requestMock = {
      body: {
        email: 'testemail',
      },
    } as unknown as Request;
    const validationError: ResponseCode<RecoveryEmailValidationCodes> = {
      code: 'INVALID_EMAIL_ADDRESS',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RecoveryEmailRequestValidator().addRecoveryEmailValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should not return error if request body is valid', async () => {
    const requestMock = {
      body: {
        email: 'testemail@test.com',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RecoveryEmailRequestValidator().addRecoveryEmailValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

describe('RecoveryEmailRequestValidator:  updateRecoveryEmailValidate', () => {
  it('Empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RecoveryEmailRequestValidator().updateRecoveryEmailValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(2);
  });
  it('Should Invalidate Request for missing email ', async () => {
    const requestMock = {
      body: {
        oldEmail: 'test@test.com',
      },
    } as unknown as Request;
    const validationError: ResponseCode<RecoveryEmailValidationCodes> = {
      code: 'NEW_EMAIL_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RecoveryEmailRequestValidator().updateRecoveryEmailValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing oldEmail ', async () => {
    const requestMock = {
      body: {
        email: 'test@test.com',
      },
    } as unknown as Request;
    const validationError: ResponseCode<RecoveryEmailValidationCodes> = {
      code: 'OLD_EMAIL_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RecoveryEmailRequestValidator().updateRecoveryEmailValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for invalid email ', async () => {
    const requestMock = {
      body: {
        email: 'testemail',
        oldEmail: 'test@test.com',
      },
    } as unknown as Request;
    const validationError: ResponseCode<RecoveryEmailValidationCodes> = {
      code: 'INVALID_EMAIL_ADDRESS',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RecoveryEmailRequestValidator().updateRecoveryEmailValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should not return error if request body is valid', async () => {
    const requestMock = {
      body: {
        email: 'testemail@test.com',
        oldEmail: 'test@test.com',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RecoveryEmailRequestValidator().updateRecoveryEmailValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

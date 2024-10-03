// Copyright 2021 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import {
  ResponseCode,
  CreateAccountRequestValidationCodes,
} from '@phx/common/src/experiences/guest-experience/api/api-response-codes';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { CreateAccountRequestValidator } from './create-account.request.validator';

const ResponseMock = {} as Response;

const validRequestBody = {
  firstName: 'Johnny',
  lastName: 'AppleSeed',
  email: 'test@test.com',
  dateOfBirth: 'January-01-2010',
  phoneNumber: '+11234567890',
  code: '123456',
};
describe('CreateAccountRequestValidator: createAccount', () => {
  it('Empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateAccountRequestValidator().createAccount
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(6);
  });

  it('Should Invalidate Request for missing firstName', async () => {
    const requestMock = {
      body: {
        ...validRequestBody,
        firstName: undefined,
      },
    } as unknown as Request;
    const validationError: ResponseCode<CreateAccountRequestValidationCodes> = {
      code: 'FIRSTNAME_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateAccountRequestValidator().createAccount
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for invalid firstName', async () => {
    const requestMock = {
      body: {
        ...validRequestBody,
        firstName:
          'TestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestName ',
      },
    } as unknown as Request;
    const validationError: ResponseCode<CreateAccountRequestValidationCodes> = {
      code: 'MAX_LENGTH_EXCEEDED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateAccountRequestValidator().createAccount
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing lastName', async () => {
    const requestMock = {
      body: {
        ...validRequestBody,
        lastName: undefined,
      },
    } as unknown as Request;
    const validationError: ResponseCode<CreateAccountRequestValidationCodes> = {
      code: 'LASTNAME_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateAccountRequestValidator().createAccount
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing date of birth', async () => {
    const requestMock = {
      body: {
        ...validRequestBody,
        dateOfBirth: undefined,
      },
    } as unknown as Request;
    const validationError: ResponseCode<CreateAccountRequestValidationCodes> = {
      code: 'DATE_OF_BIRTH_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateAccountRequestValidator().createAccount
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for invalid date of birth', async () => {
    const requestMock = {
      body: {
        ...validRequestBody,
        dateOfBirth: 'date',
      },
    } as unknown as Request;
    const validationError: ResponseCode<CreateAccountRequestValidationCodes> = {
      code: 'INVALID_DATE_FORMAT',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateAccountRequestValidator().createAccount
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing email', async () => {
    const requestMock = {
      body: {
        ...validRequestBody,
        email: undefined,
      },
    } as unknown as Request;
    const validationError: ResponseCode<CreateAccountRequestValidationCodes> = {
      code: 'EMAIL_ID_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateAccountRequestValidator().createAccount
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for invalid email', async () => {
    const requestMock = {
      body: {
        ...validRequestBody,
        email: 'test',
      },
    } as unknown as Request;
    const validationError: ResponseCode<CreateAccountRequestValidationCodes> = {
      code: 'INVALID_EMAIL_ID',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateAccountRequestValidator().createAccount
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing code', async () => {
    const requestMock = {
      body: {
        ...validRequestBody,
        code: undefined,
      },
    } as unknown as Request;
    const validationError: ResponseCode<CreateAccountRequestValidationCodes> = {
      code: 'CODE_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateAccountRequestValidator().createAccount
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing phone number', async () => {
    const requestMock = {
      body: {
        ...validRequestBody,
        phoneNumber: undefined,
      },
    } as unknown as Request;
    const validationError: ResponseCode<CreateAccountRequestValidationCodes> = {
      code: 'PHONE_NUMBER_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateAccountRequestValidator().createAccount
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for invalid phone number', async () => {
    const requestMock = {
      body: {
        ...validRequestBody,
        phoneNumber: '+222222',
      },
    } as unknown as Request;
    const validationError: ResponseCode<CreateAccountRequestValidationCodes> = {
      code: 'INVALID_PHONE_NUMBER',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateAccountRequestValidator().createAccount
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });

  it('Should not return error if request body is valid', async () => {
    const requestMock = {
      body: validRequestBody,
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new CreateAccountRequestValidator().createAccount
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

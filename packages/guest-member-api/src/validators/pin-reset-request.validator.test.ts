// Copyright 2021 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import {
  ResponseCode,
  PinResetValidationCodes,
} from '@phx/common/src/experiences/guest-experience/api/api-response-codes';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { PinResetRequestValidator } from './pin-reset-request.validator';

const ResponseMock = {} as Response;

describe('PinResetRequestValidator: sendVerificationCodeValidate', () => {
  it('Empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new PinResetRequestValidator().sendVerificationCodeValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });
  it('Should Invalidate Request for missing verificationType ', async () => {
    const requestMock = {
      body: {
        test: 1,
      },
    } as unknown as Request;
    const validationError: ResponseCode<PinResetValidationCodes> = {
      code: 'VERIFICATION_TYPE_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new PinResetRequestValidator().sendVerificationCodeValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for invalid verificationType ', async () => {
    const requestMock = {
      body: {
        verificationType: 'some-value',
      },
    } as unknown as Request;
    const validationError: ResponseCode<PinResetValidationCodes> = {
      code: 'VERIFICATION_TYPE_INVALID',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new PinResetRequestValidator().sendVerificationCodeValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });

  it('Should not return error if request body is valid', async () => {
    const requestMock = {
      body: {
        verificationType: 'EMAIL',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new PinResetRequestValidator().sendVerificationCodeValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
  it('Should not return error if request body is valid', async () => {
    const requestMock = {
      body: {
        verificationType: 'PHONE',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new PinResetRequestValidator().sendVerificationCodeValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

describe('PinResetRequestValidator: resetPinValidate', () => {
  it('Empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new PinResetRequestValidator().resetPinValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(3);
  });
  it('Should Invalidate Request for missing verificationType ', async () => {
    const requestMock = {
      body: {
        code: '123456',
        maskedValue: '12**11',
      },
    } as unknown as Request;
    const validationError: ResponseCode<PinResetValidationCodes> = {
      code: 'VERIFICATION_TYPE_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new PinResetRequestValidator().resetPinValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for invalid verificationType ', async () => {
    const requestMock = {
      body: {
        verificationType: 'some-value',
        code: '123456',
        maskedValue: '12**11',
      },
    } as unknown as Request;
    const validationError: ResponseCode<PinResetValidationCodes> = {
      code: 'VERIFICATION_TYPE_INVALID',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new PinResetRequestValidator().resetPinValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing code ', async () => {
    const requestMock = {
      body: {
        verificationType: 'EMAIL',
        maskedValue: '12**11',
      },
    } as unknown as Request;
    const validationError: ResponseCode<PinResetValidationCodes> = {
      code: 'VERIFICATION_CODE_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new PinResetRequestValidator().resetPinValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for invalid code ', async () => {
    const requestMock = {
      body: {
        verificationType: 'EMAIL',
        code: '12345',
        maskedValue: '12**11',
      },
    } as unknown as Request;
    const validationError: ResponseCode<PinResetValidationCodes> = {
      code: 'VERIFICATION_CODE_INVALID',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new PinResetRequestValidator().resetPinValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing code ', async () => {
    const requestMock = {
      body: {
        verificationType: 'EMAIL',
        code: '123411',
      },
    } as unknown as Request;
    const validationError: ResponseCode<PinResetValidationCodes> = {
      code: 'MASKED_VALUE_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new PinResetRequestValidator().resetPinValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should not return error if request body is valid', async () => {
    const requestMock = {
      body: {
        verificationType: 'EMAIL',
        code: '123456',
        maskedValue: '12**11',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new PinResetRequestValidator().resetPinValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
  it('Should not return error if request body is valid', async () => {
    const requestMock = {
      body: {
        verificationType: 'PHONE',
        code: '123456',
        maskedValue: '12**11',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new PinResetRequestValidator().resetPinValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

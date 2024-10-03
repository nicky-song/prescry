// Copyright 2021 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import {
  ResponseCode,
  WaitlistValidationCodes,
} from '@phx/common/src/experiences/guest-experience/api/api-response-codes';

import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { RemoveWaitlistRequestValidator } from './remove-waitlist-request.validator';

const ResponseMock = {} as Response;

describe('RemoveWaitlistRequestValidator:  validate', () => {
  it('should generate validation errors for empty request', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RemoveWaitlistRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(8);
  });
  it('should Invalidate Request for missing TO ', async () => {
    const requestMock = {
      body: {
        AccountSid: 'account-id',
        Body: 'ACTUAL TEXT MESSAGE USER SENT',
        From: 'SENDER PHONE NUMBER',
        FromCity: 'TACOMA',
        FromState: 'WA',
        FromZip: '98402',
        MessageSid: 'MESSAGEID from twilio',
      },
    } as unknown as Request;
    const validationError: ResponseCode<WaitlistValidationCodes> = {
      code: 'TO_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RemoveWaitlistRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing AccountSid ', async () => {
    const requestMock = {
      body: {
        To: '+11234567890',
        Body: 'ACTUAL TEXT MESSAGE USER SENT',
        From: 'SENDER PHONE NUMBER',
        FromCity: 'TACOMA',
        FromState: 'WA',
        FromZip: '98402',
        MessageSid: 'MESSAGEID from twilio',
      },
    } as unknown as Request;
    const validationError: ResponseCode<WaitlistValidationCodes> = {
      code: 'ACCOUNT_SID_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RemoveWaitlistRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for invalid MessageSid ', async () => {
    const requestMock = {
      body: {
        To: '+11234567890',
        AccountSid: 'account-id',
        Body: 'ACTUAL TEXT MESSAGE USER SENT',
        From: 'SENDER PHONE NUMBER',
        FromCity: 'TACOMA',
        FromState: 'WA',
        FromZip: '98402',
      },
    } as unknown as Request;
    const validationError: ResponseCode<WaitlistValidationCodes> = {
      code: 'MESSAGE_SID_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RemoveWaitlistRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing BODY ', async () => {
    const requestMock = {
      body: {
        To: '+11234567890',
        AccountSid: 'account-id',
        From: 'SENDER PHONE NUMBER',
        FromCity: 'TACOMA',
        FromState: 'WA',
        FromZip: '98402',
        MessageSid: 'MESSAGEID from twilio',
      },
    } as unknown as Request;
    const validationError: ResponseCode<WaitlistValidationCodes> = {
      code: 'MESSAGE_BODY_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RemoveWaitlistRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });

  it('should Invalidate Request for missing FROM ', async () => {
    const requestMock = {
      body: {
        To: '+11234567890',
        AccountSid: 'account-id',
        Body: 'ACTUAL TEXT MESSAGE USER SENT',
        FromCity: 'TACOMA',
        FromState: 'WA',
        FromZip: '98402',
        MessageSid: 'MESSAGEID from twilio',
      },
    } as unknown as Request;
    const validationError: ResponseCode<WaitlistValidationCodes> = {
      code: 'MESSAGE_FROM_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RemoveWaitlistRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing FromCity ', async () => {
    const requestMock = {
      body: {
        To: '+11234567890',
        AccountSid: 'account-id',
        Body: 'ACTUAL TEXT MESSAGE USER SENT',
        From: 'SENDER PHONE NUMBER',
        FromState: 'WA',
        FromZip: '98402',
        MessageSid: 'MESSAGEID from twilio',
      },
    } as unknown as Request;
    const validationError: ResponseCode<WaitlistValidationCodes> = {
      code: 'MESSAGE_FROM_CITY_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RemoveWaitlistRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for invalid FromState ', async () => {
    const requestMock = {
      body: {
        To: '+11234567890',
        AccountSid: 'account-id',
        Body: 'ACTUAL TEXT MESSAGE USER SENT',
        From: 'SENDER PHONE NUMBER',
        FromCity: 'TACOMA',
        FromZip: '98402',
        MessageSid: 'MESSAGEID from twilio',
      },
    } as unknown as Request;
    const validationError: ResponseCode<WaitlistValidationCodes> = {
      code: 'MESSAGE_FROM_STATE_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RemoveWaitlistRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for missing FromZip ', async () => {
    const requestMock = {
      body: {
        To: '+11234567890',
        AccountSid: 'account-id',
        Body: 'ACTUAL TEXT MESSAGE USER SENT',
        From: 'SENDER PHONE NUMBER',
        FromCity: 'TACOMA',
        FromState: 'WA',
        MessageSid: 'MESSAGEID from twilio',
      },
    } as unknown as Request;
    const validationError: ResponseCode<WaitlistValidationCodes> = {
      code: 'MESSAGE_FROM_ZIP_REQUIRED',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RemoveWaitlistRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should not return error if request body is valid', async () => {
    const requestMock = {
      body: {
        To: '+11234567890',
        AccountSid: 'account-id',
        Body: 'ACTUAL TEXT MESSAGE USER SENT',
        From: 'SENDER PHONE NUMBER',
        FromCity: 'TACOMA',
        FromState: 'WA',
        FromZip: '98402',
        MessageSid: 'MESSAGEID from twilio',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new RemoveWaitlistRequestValidator().validate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

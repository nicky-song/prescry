// Copyright 2018 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import { MemberUpdateRequestValidationCodes as responseMessage } from '../constants/response-messages';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { MemberUpdateRequestValidator } from './member-update-validator';

const ResponseMock = {} as Response;

describe('Member Update Validator', () => {
  it('empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new MemberUpdateRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(3);
  });

  it('should Invaidate Request for Missing Email ', async () => {
    const requestMock = {
      body: {
        phoneNumber: 'mock-phoneNumber',
        secondaryMemberIdentifier: 'mock-identifier',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new MemberUpdateRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(2);
    expect(errors[0].msg).toEqual(responseMessage.EMAIL_ID_REQUIRED);
  });

  it('should Invaidate Request for Invalid Email ', async () => {
    const requestMock = {
      body: {
        email: 'invalidEmail',
        phoneNumber: 'mock-phoneNumber',
        secondaryMemberIdentifier: 'mock-identifier',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new MemberUpdateRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.INVALID_EMAIL_ID);
  });

  it('should Invaidate Request for Missing phoneNumber ', async () => {
    const requestMock = {
      body: {
        email: 'fakemail@gmail.com',
        secondaryMemberIdentifier: 'mock-identifier',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new MemberUpdateRequestValidator().validate
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(responseMessage.PHONE_NUMBER_REQUIRED);
  });
});

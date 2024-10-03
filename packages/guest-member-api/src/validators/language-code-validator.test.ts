// Copyright 2022 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { LanguageCodeValidator } from './language-code-validator';
import { MemberUpdateRequestValidationCodes } from '../constants/response-messages';

const ResponseMock = {} as Response;

describe('LanguageCodeValidator: updateLanguageCodeValidate', () => {
  it('should generate validation errors on empty request', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new LanguageCodeValidator().updateLanguageCodeValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });
  it('should invalidate request for invalid languageCode', async () => {
    const requestMock = {
      body: {
        languageCode: undefined,
      },
    } as unknown as Request;
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new LanguageCodeValidator().updateLanguageCodeValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(
      MemberUpdateRequestValidationCodes.LANGUAGE_CODE_REQUIRED
    );
  });
  it('should not return error if request body is valid', async () => {
    const requestMock = {
      body: {
        languageCode: 'en-us',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new LanguageCodeValidator().updateLanguageCodeValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});

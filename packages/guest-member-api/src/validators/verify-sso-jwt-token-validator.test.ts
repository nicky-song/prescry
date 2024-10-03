// Copyright 2022 Prescryptive Health, Inc.

import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { validationResult } from 'express-validator';
import { VerifySsoJwtTokenRequestValidator } from './verify-sso-jwt-token-validator';

const ResponseMock = {} as Response;

describe('VerifySsoJwtTokenRequestValidator', () => {
  it('throws no errors when jwt is valid', async () => {
    const requestMock = {
      body: {
        jwt_token: 'jwt',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifySsoJwtTokenRequestValidator().validateRequest
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });

  it('throws error when jwt_token is missing', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new VerifySsoJwtTokenRequestValidator().validateRequest
    );

    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });
});

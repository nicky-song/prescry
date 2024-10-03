// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../constants/error-codes';
import { ErrorConstants } from '../../constants/response-messages';
import { UnauthorizedRequestError } from './unauthorized.request-error';

describe('UnauthorizedRequestError', () => {
  it('creates instance', () => {
    const error = new UnauthorizedRequestError();

    expect(error).toBeInstanceOf(UnauthorizedRequestError);
    expect(error.httpCode).toEqual(HttpStatusCodes.UNAUTHORIZED_REQUEST);
    expect(error.message).toEqual(ErrorConstants.UNAUTHORIZED_ACCESS);
    expect(error.internalCode).toBeUndefined();
  });
});

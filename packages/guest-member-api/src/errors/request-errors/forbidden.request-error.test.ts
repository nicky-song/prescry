// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../constants/error-codes';
import { ForbiddenRequestError } from './forbidden.request-error';

describe('ForbiddenRequestError', () => {
  it('creates instance', () => {
    const errorMessageMock = 'error-message';
    const error = new ForbiddenRequestError(errorMessageMock);

    expect(error).toBeInstanceOf(ForbiddenRequestError);
    expect(error.httpCode).toEqual(HttpStatusCodes.FORBIDDEN_ERROR);
    expect(error.message).toEqual(errorMessageMock);
    expect(error.internalCode).toBeUndefined();
  });
});

// Copyright 2022 Prescryptive Health, Inc.

import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../constants/error-codes';
import { BadRequestError } from './bad.request-error';

describe('BadRequestError', () => {
  it('creates instance', () => {
    const errorMessageMock = 'error-message';
    const internalCodeMock =
      InternalResponseCode.ACTIVATION_PERSON_DATA_MISMATCH;
    const error = new BadRequestError(errorMessageMock, internalCodeMock);

    expect(error).toBeInstanceOf(BadRequestError);
    expect(error.httpCode).toEqual(HttpStatusCodes.BAD_REQUEST);
    expect(error.message).toEqual(errorMessageMock);
    expect(error.internalCode).toEqual(internalCodeMock);
  });
});

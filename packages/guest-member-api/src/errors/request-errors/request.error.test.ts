// Copyright 2022 Prescryptive Health, Inc.

import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../constants/error-codes';
import { RequestError } from './request.error';

describe('RequestError', () => {
  it('creates instance', () => {
    const httpCodeMock = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessageMock = 'error-message';
    const internalCodeMock =
      InternalResponseCode.ACTIVATION_PERSON_DATA_MISMATCH;
    const error = new RequestError(
      httpCodeMock,
      errorMessageMock,
      internalCodeMock
    );

    expect(error).toBeInstanceOf(RequestError);
    expect(error.httpCode).toEqual(httpCodeMock);
    expect(error.message).toEqual(errorMessageMock);
    expect(error.internalCode).toEqual(internalCodeMock);
  });
});

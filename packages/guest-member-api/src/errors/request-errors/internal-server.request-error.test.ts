// Copyright 2022 Prescryptive Health, Inc.

import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../constants/error-codes';
import { InternalServerRequestError } from './internal-server.request-error';

describe('InternalServerRequestError', () => {
  it('creates instance', () => {
    const errorMessageMock = 'error-message';
    const internalCodeMock =
      InternalResponseCode.ACTIVATION_PERSON_DATA_MISMATCH;
    const error = new InternalServerRequestError(
      errorMessageMock,
      internalCodeMock
    );

    expect(error).toBeInstanceOf(InternalServerRequestError);
    expect(error.httpCode).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(error.message).toEqual(errorMessageMock);
    expect(error.internalCode).toEqual(internalCodeMock);
  });
});

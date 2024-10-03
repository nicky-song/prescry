// Copyright 2022 Prescryptive Health, Inc.

import { EndpointError } from './endpoint.error';

describe('EndpointError', () => {
  it('creates instance', () => {
    const errorCodeMock = 500;
    const errorMessageMock = 'error-message';
    const error = new EndpointError(errorCodeMock, errorMessageMock);

    expect(error).toBeInstanceOf(EndpointError);
    expect(error.errorCode).toEqual(errorCodeMock);
    expect(error.message).toEqual(errorMessageMock);
  });
});

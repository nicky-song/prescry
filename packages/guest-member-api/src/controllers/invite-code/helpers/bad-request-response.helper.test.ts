// Copyright 2021 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { KnownFailureResponse } from '../../../utils/response-helper';
import { Response } from 'express';

import { badRequestForInviteCodeResponse } from './bad-request-response.helper';

jest.mock('../../../utils/response-helper');

const knownFailureResponseMock = KnownFailureResponse as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});
describe('badRequestForInviteCodeResponse', () => {
  it('it calls knownfailure mock with given error message', () => {
    const routerResponseMock = {} as Response;
    const code = 1234;

    badRequestForInviteCodeResponse(routerResponseMock, 'error', code);

    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      'error',
      undefined,
      code
    );
  });
});

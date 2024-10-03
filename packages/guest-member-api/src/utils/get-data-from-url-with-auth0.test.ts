// Copyright 2020 Prescryptive Health, Inc.

import { getDataFromUrl, RequestMethod } from './get-data-from-url';
import { Auth0Audience, getAuth0Token } from '../auth0/auth0.helper';
import { configurationMock } from '../mock-data/configuration.mock';
import { HeaderInit } from 'node-fetch';
import {
  getDataFromUrlWithAuth0,
  IGetDataFromUrlWithAuth0ErrorResponse,
  TOKEN_EXPIRED_CODE,
} from './get-data-from-url-with-auth0';
import { defaultRetryPolicy } from './fetch-retry.helper';
import { ApiConstants } from '../constants/api-constants';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('../auth0/auth0.helper');
const getAuth0TokenMock = getAuth0Token as jest.Mock;

jest.mock('./get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

describe('getDataFromUrlWithAuth0', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requests data with auth0 token header', async () => {
    const tokenMock = 'token';
    getAuth0TokenMock.mockResolvedValue(tokenMock);

    const responseMock: Partial<Response> = {
      ok: true,
    };
    getDataFromUrlMock.mockResolvedValue(responseMock);

    const audienceMock: Auth0Audience = 'identity';
    const endpointMock = 'endpoint';
    const methodMock: RequestMethod = 'POST';
    const bodyMock = {};
    const headersMock: HeaderInit = {
      something: 'something',
    };
    const logRequestMock = true;
    const timeoutMock = 10000;

    const response = await getDataFromUrlWithAuth0(
      audienceMock,
      configurationMock.auth0,
      endpointMock,
      bodyMock,
      methodMock,
      headersMock,
      logRequestMock,
      timeoutMock,
      defaultRetryPolicy
    );

    const expectedHeaders: HeaderInit = {
      ...headersMock,
      [ApiConstants.AUTHORIZATION_HEADER_KEY]: tokenMock,
    };
    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlMock,
      endpointMock,
      bodyMock,
      methodMock,
      expectedHeaders,
      logRequestMock,
      timeoutMock,
      defaultRetryPolicy
    );

    expect(response).toEqual(responseMock);
  });

  it('returns cloned response when error occurs that is not token expired', async () => {
    const tokenMock = 'token';
    getAuth0TokenMock.mockResolvedValue(tokenMock);

    const errorResponseMock: IGetDataFromUrlWithAuth0ErrorResponse = {
      code: 666,
      message: 'Something wicked this way comes',
    };
    const clonedResponseMock: Partial<Response> = {
      ok: false,
    };
    const responseMock: Partial<Response> = {
      ok: false,
      json: jest.fn().mockResolvedValue(errorResponseMock),
      clone: jest.fn().mockReturnValue(clonedResponseMock),
    };
    getDataFromUrlMock.mockResolvedValue(responseMock);

    const response = await getDataFromUrlWithAuth0(
      'identity',
      configurationMock.auth0,
      'endpoint'
    );

    expect(getDataFromUrlMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual(clonedResponseMock);
  });

  it('requests data with new token if initial token expired', async () => {
    const expiredTokenMock = 'expired-token';
    getAuth0TokenMock.mockResolvedValueOnce(expiredTokenMock);

    const newTokenMock = 'new-token';
    getAuth0TokenMock.mockResolvedValueOnce(newTokenMock);

    const expiredTokenResponseMock: IGetDataFromUrlWithAuth0ErrorResponse = {
      code: TOKEN_EXPIRED_CODE,
      message: 'Token is expired (or something like that)',
    };
    const expiredResponseMock: Partial<Response> = {
      ok: false,
      json: jest.fn().mockResolvedValue(expiredTokenResponseMock),
      clone: jest.fn(),
    };
    getDataFromUrlMock.mockResolvedValueOnce(expiredResponseMock);

    const secondDataResponseMock: Partial<Response> = {
      ok: true,
    };
    getDataFromUrlMock.mockResolvedValueOnce(secondDataResponseMock);

    const audienceMock: Auth0Audience = 'identity';
    const endpointMock = 'endpoint';
    const methodMock: RequestMethod = 'POST';
    const bodyMock = {};
    const headersMock: HeaderInit = {
      something: 'something',
    };
    const logRequestMock = true;
    const timeoutMock = 10000;

    const response = await getDataFromUrlWithAuth0(
      audienceMock,
      configurationMock.auth0,
      endpointMock,
      bodyMock,
      methodMock,
      headersMock,
      logRequestMock,
      timeoutMock,
      defaultRetryPolicy
    );

    expect(getAuth0TokenMock).toHaveBeenCalledTimes(2);
    expect(getAuth0TokenMock).toHaveBeenNthCalledWith(
      2,
      audienceMock,
      configurationMock.auth0,
      false
    );

    expect(getDataFromUrlMock).toHaveBeenCalledTimes(2);

    const expectedHeaders: HeaderInit = {
      ...headersMock,
      [ApiConstants.AUTHORIZATION_HEADER_KEY]: newTokenMock,
    };
    expect(getDataFromUrlMock).toHaveBeenNthCalledWith(
      2,
      endpointMock,
      bodyMock,
      methodMock,
      expectedHeaders,
      logRequestMock,
      timeoutMock,
      defaultRetryPolicy
    );
    expect(response).toEqual(secondDataResponseMock);
  });
});

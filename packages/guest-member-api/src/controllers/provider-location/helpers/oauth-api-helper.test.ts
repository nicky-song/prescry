// Copyright 2020 Prescryptive Health, Inc.

import fetch, { Headers } from 'node-fetch';
import { generateBearerToken } from './oauth-api-helper';
jest.mock('node-fetch');

const fetchMock = fetch as unknown as jest.Mock;

describe('generateBearerToken', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });
  it('should call fetch with parameters and return token if success', async () => {
    const responseMock = {
      token_type: 'auth-token',
      expires_in: 3599,
      ext_expires_in: 3599,
      access_token: 'mock-token',
    };
    fetchMock.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(responseMock),
      ok: true,
    });
    const token = await generateBearerToken(
      'tenant-id',
      'client-id',
      'client-secret',
      'scope'
    );
    const url = 'https://login.microsoftonline.com/tenant-id/oauth2/v2.0/token';
    const body =
      'client_id=client-id&client_secret=client-secret&scope=scope&grant_type=client_credentials';

    expect(fetch).toHaveBeenCalledWith(url, {
      body,
      headers: new Headers({
        ['Content-Type']: 'application/x-www-form-urlencoded',
        ['Accept']: '*/*',
      }),
      method: 'POST',
    });
    expect(token).toEqual('mock-token');
  });
  it('should throw exception if graph api return error', async () => {
    const errorResponseMock = {
      error: 'error-messsage',
      error_description: 'error-description',
    };
    expect.assertions(1);

    fetchMock.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(errorResponseMock),
      ok: false,
    });
    try {
      await generateBearerToken(
        'tenant-id',
        'client-id',
        'client-secret',
        'scope'
      );
    } catch (error) {
      expect(error).toEqual(new Error('error-messsage error-description'));
    }
  });
  it('should call fetch with resource parameters if isResourceUrl is true', async () => {
    const responseMock = {
      token_type: 'auth-token',
      expires_in: 3599,
      ext_expires_in: 3599,
      access_token: 'mock-token',
    };
    fetchMock.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(responseMock),
      ok: true,
    });
    const token = await generateBearerToken(
      'tenant-id',
      'client-id',
      'client-secret',
      'scope',
      true
    );
    const url = 'https://login.microsoftonline.com/tenant-id/oauth2/token';
    const body =
      'client_id=client-id&client_secret=client-secret&resource=scope&grant_type=client_credentials';

    expect(fetch).toHaveBeenCalledWith(url, {
      body,
      headers: new Headers({
        ['Content-Type']: 'application/x-www-form-urlencoded',
        ['Accept']: '*/*',
      }),
      method: 'POST',
    });
    expect(token).toEqual('mock-token');
  });
});

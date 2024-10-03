// Copyright 2018 Prescryptive Health, Inc.

import { InternalResponseCode } from '../../../errors/error-codes';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { RequestHeaders } from './api-request-headers';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { updatePin } from './api-v1.pin';

jest.mock('../../../utils/api.helper', () => ({
  buildCommonHeaders: jest.fn(),
  buildUrl: jest.fn(),
  call: jest.fn(),
}));

jest.mock('./api-v1-helper', () => ({
  APITypes: { ADD_PIN: 'ADD_PIN' },
  handleHttpErrors: jest.fn(),
}));

const mockBuildURL = buildUrl as jest.Mock;
const mockCall = call as jest.Mock;
const handleHttpErrorsMock = handleHttpErrors as jest.Mock;
const buildCommonHeadersMock = buildCommonHeaders as jest.Mock;

const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {},
};

const token = 'auth-token';
const deviceToken = 'device-token';
const encryptedPinCurrent = 'encrypted-pin-current';
const encryptedPinNew = 'encrypted-pin-new';

describe('updatePin', () => {
  beforeEach(() => {
    mockBuildURL.mockReset();
    mockBuildURL.mockReturnValue('route-url');
    handleHttpErrorsMock.mockReset();
    mockCall.mockReset();
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
      ok: true,
    });
    buildCommonHeadersMock.mockReset();
  });

  it('should call buildUrl()', async () => {
    await updatePin(
      mockConfig,
      token,
      deviceToken,
      encryptedPinCurrent,
      encryptedPinNew
    );
    expect(mockBuildURL).toHaveBeenCalledWith(mockConfig, 'updatePin', {});
  });

  it('should call buildCommonHeadersMock()', async () => {
    await updatePin(
      mockConfig,
      token,
      deviceToken,
      encryptedPinCurrent,
      encryptedPinNew
    );
    expect(buildCommonHeadersMock).toHaveBeenCalledWith(
      mockConfig,
      token,
      deviceToken
    );
  });

  it('should call call()', async () => {
    buildCommonHeadersMock.mockImplementation(() => {
      return {
        Authorization: token,
        [RequestHeaders.deviceTokenRequestHeader]: deviceToken,
      };
    });

    await updatePin(
      mockConfig,
      token,
      deviceToken,
      encryptedPinCurrent,
      encryptedPinNew
    );
    expect(mockCall).toHaveBeenCalledWith(
      'route-url',
      {
        encryptedPinCurrent: 'encrypted-pin-current',
        encryptedPinNew: 'encrypted-pin-new',
      },
      'POST',
      {
        Authorization: token,
        [RequestHeaders.deviceTokenRequestHeader]: deviceToken,
      }
    );
  });

  it('should return response json if response is success', async () => {
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: { accountToken: 'account-token' },
        message: 'fake message',
        status: 'success',
      }),
      ok: true,
    });
    const response = await updatePin(
      mockConfig,
      token,
      deviceToken,
      encryptedPinCurrent,
      encryptedPinNew
    );
    expect(response).toEqual({
      data: { accountToken: 'account-token' },
      message: 'fake message',
      status: 'success',
    });
  });

  it('includes refresh token in response', async () => {
    const refreshToken = 'refresh-token';
    const headers = new Headers();
    headers.append(RequestHeaders.refreshAccountToken, refreshToken);

    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: { accountToken: 'account-token' },
        message: 'fake message',
        status: 'success',
      }),
      ok: true,
      headers,
    });

    const response = await updatePin(
      mockConfig,
      token,
      deviceToken,
      encryptedPinCurrent,
      encryptedPinNew
    );
    expect(response.refreshToken).toEqual(refreshToken);
  });

  it('should call handleHttpErrors in case of error', async () => {
    handleHttpErrorsMock.mockImplementation(
      () => new Error('invalid account token')
    );
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ code: 'error-code' }),
      ok: false,
      status: 404,
    });

    try {
      await updatePin(
        mockConfig,
        token,
        deviceToken,
        encryptedPinCurrent,
        encryptedPinNew
      );
      expect(handleHttpErrorsMock).toHaveBeenCalledWith(
        404,
        ErrorConstants.errorForUpdatingingPin,
        APITypes.UPDATE_PIN,
        'error-code'
      );
    } catch (error) {
      expect(error).toEqual(new Error('invalid account token'));
    }
  });

  it('should return errorResponse if API returns 2009 code in case of error', async () => {
    const errorResponse = { code: InternalResponseCode.USE_ANOTHER_PIN };
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue(errorResponse),
      ok: false,
      status: 400,
    });

    try {
      await updatePin(
        mockConfig,
        token,
        deviceToken,
        encryptedPinCurrent,
        encryptedPinNew
      );
    } catch (error) {
      expect(error).toBe(errorResponse);
    }
  });
});

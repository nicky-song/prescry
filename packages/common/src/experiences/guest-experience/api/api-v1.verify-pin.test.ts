// Copyright 2018 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { RequestHeaders } from './api-request-headers';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { verifyPin } from './api-v1.pin';

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
  paths: {
    verifyPin: '/account/pin/verify',
  },
};

const deviceToken = 'device-token';
const encryptedPin = 'encrypted-pin';

describe('verifyPin', () => {
  beforeEach(() => {
    mockBuildURL.mockReset();
    mockBuildURL.mockReturnValue('route-url');
    handleHttpErrorsMock.mockReset();
    mockCall.mockReset();
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: {
          accountToken: 'account-token',
        },
      }),
      ok: true,
    });
    buildCommonHeadersMock.mockReset();
  });

  it('should call buildUrl()', async () => {
    await verifyPin(mockConfig, deviceToken, encryptedPin);
    expect(mockBuildURL).toHaveBeenCalledWith(mockConfig, 'verifyPin', {});
  });

  it('should call buildCommonHeadersMock()', async () => {
    await verifyPin(mockConfig, deviceToken, encryptedPin);
    expect(buildCommonHeadersMock).toHaveBeenCalledWith(
      mockConfig,
      undefined,
      deviceToken
    );
  });

  it('should call call()', async () => {
    buildCommonHeadersMock.mockImplementation(() => {
      return {
        [RequestHeaders.deviceTokenRequestHeader]: deviceToken,
      };
    });
    await verifyPin(mockConfig, deviceToken, encryptedPin);
    expect(mockCall).toHaveBeenCalledWith(
      'route-url',
      { encryptedPin: 'encrypted-pin' },
      'POST',
      { [RequestHeaders.deviceTokenRequestHeader]: deviceToken }
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
    const response = await verifyPin(mockConfig, deviceToken, encryptedPin);
    expect(response).toEqual({
      data: { accountToken: 'account-token' },
      message: 'fake message',
      status: 'success',
    });
  });

  it('should call handleHttpErrors in case of error', async () => {
    const details = {
      numberOfFailedAttempts: 5,
    };
    handleHttpErrorsMock.mockImplementation(() => new Error('invalid pin'));

    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        code: 'error-code',
        details,
      }),
      ok: false,
      status: 400,
    });

    try {
      await verifyPin(mockConfig, deviceToken, encryptedPin);
    } catch (error) {
      expect(error).toEqual(new Error('invalid pin'));
      expect(handleHttpErrorsMock).toHaveBeenCalledWith(
        400,
        ErrorConstants.errorForVerifyingPin,
        APITypes.VERIFY_PIN,
        undefined,
        {
          code: 'error-code',
          details,
        }
      );
    }
  });
});

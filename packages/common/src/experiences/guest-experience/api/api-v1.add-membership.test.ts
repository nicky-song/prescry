// Copyright 2018 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { addMembership } from './api-v1.add-membership';
import { IMemberLoginState } from '../store/member-login/member-login-reducer';
import { RequestHeaders } from './api-request-headers';

jest.mock('../../../utils/api.helper', () => ({
  buildCommonHeaders: jest.fn(),
  buildUrl: jest.fn(),
  call: jest.fn(),
}));

jest.mock('./api-v1-helper', () => ({
  APITypes: { ADD_MEMBERSHIP: 'ADD_MEMBERSHIP' },
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
    members: '/members',
  },
};

const deviceToken = 'device-token';
const accountToken = 'account-token';

const memberLoginInfo: IMemberLoginState = {
  dateOfBirth: '05-15-1947',
  errorMessage: '',
  firstName: 'fake firstName',
  isTermAccepted: true,
  lastName: 'fake lastName',
  primaryMemberRxId: '1947',
};

describe('addMembership', () => {
  beforeEach(() => {
    mockBuildURL.mockReset();
    mockBuildURL.mockReturnValue('route-url');
    handleHttpErrorsMock.mockReset();
    mockCall.mockReset();
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        message: 'Authentication successful!',
        status: 'success',
      }),
      ok: true,
    });
    buildCommonHeadersMock.mockReset();
  });

  it('should call buildUrl()', async () => {
    await addMembership(mockConfig, memberLoginInfo, deviceToken, accountToken);
    expect(mockBuildURL).toHaveBeenCalledWith(mockConfig, 'members', {});
  });

  it('should call buildCommonHeadersMock()', async () => {
    await addMembership(mockConfig, memberLoginInfo, deviceToken, accountToken);
    expect(buildCommonHeadersMock).toHaveBeenCalledWith(
      mockConfig,
      accountToken,
      deviceToken
    );
  });

  it('should call call()', async () => {
    buildCommonHeadersMock.mockImplementation(() => {
      return {
        [RequestHeaders.accessTokenRequestHeader]: accountToken,
        [RequestHeaders.deviceTokenRequestHeader]: deviceToken,
      };
    });

    await addMembership(
      mockConfig,
      memberLoginInfo,
      deviceToken,
      accountToken,
      undefined
    );
    expect(mockCall).toHaveBeenCalledWith(
      'route-url',
      memberLoginInfo,
      'POST',
      {
        [RequestHeaders.accessTokenRequestHeader]: accountToken,
        [RequestHeaders.deviceTokenRequestHeader]: deviceToken,
      },
      undefined
    );
  });

  it('should return response json if response is success', async () => {
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        message: 'Authentication successful!',
        refreshToken: undefined,
        status: 'success',
      }),
      ok: true,
    });
    const response = await addMembership(
      mockConfig,
      memberLoginInfo,
      deviceToken,
      accountToken
    );
    expect(response).toEqual({
      message: 'Authentication successful!',
      refreshToken: undefined,
      status: 'success',
    });
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
      await addMembership(
        mockConfig,
        memberLoginInfo,
        deviceToken,
        accountToken
      );
      expect(handleHttpErrorsMock).toHaveBeenCalledWith(
        404,
        ErrorConstants.errorInUpdatingMemberInfo,
        APITypes.ADD_MEMBERSHIP,
        'error-code'
      );
    } catch (error) {
      expect(error).toEqual(new Error('invalid account token'));
    }
  });
});

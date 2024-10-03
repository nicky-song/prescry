// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../errors/error-codes';
import { IMemberInfoResponse } from '../../../models/api-response/member-info-response';
import { ILimitedAccount } from '../../../models/member-profile/member-profile-info';
import { ErrorConstants } from '../../../theming/constants';
import { buildUrl, call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { profileListMock } from '../__mocks__/profile-list.mock';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { getMemberProfileInfo } from './api-v1.get-member-profile';
import { getFavoritedPharmacies } from './api-v1.get-favorited-pharmacies';
import { RequestHeaders } from './api-request-headers';

jest.mock('./api-v1.get-favorited-pharmacies');
const getFavoritedPharmaciesMock = getFavoritedPharmacies as jest.Mock;

jest.mock('../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../utils/api.helper') as object),
  call: jest.fn(),
}));
const mockCall = call as jest.Mock;

jest.mock('./api-v1-helper', () => ({
  ...(jest.requireActual('./api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));
const mockHandleHttpErrors = handleHttpErrors as jest.Mock;

const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    appointmentDetails: '/appointment/:id',
  },
};
const authToken = 'auth-token';
const deviceToken = 'device-token';
const mockRetryPolicy = {} as IRetryPolicy;

const accountMock: ILimitedAccount = {
  firstName: 'fake-first',
  lastName: 'fake-last',
  dateOfBirth: '01-01-2000',
  phoneNumber: 'fake-phone',
  recoveryEmail: 'test@test.com',
  favoritedPharmacies: [],
};

const mockResponse: IMemberInfoResponse = {
  data: {
    account: accountMock,
    profileList: profileListMock,
  },
  message: '',
  status: 'success',
};

const customHeaders = new Headers();

describe('getAppointmentDetails', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
    getFavoritedPharmaciesMock.mockReturnValue({
      data: { favoritedPharmacies: [] },
    });
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      headers: customHeaders,
      json: () => mockResponse,
      ok: true,
    });

    await getMemberProfileInfo(
      mockConfig,
      authToken,
      mockRetryPolicy,
      deviceToken
    );

    const expectedUrl = buildUrl(mockConfig, 'members', {});
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: mockConfig.env.version,
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      null,
      'GET',
      expectedHeaders,
      mockRetryPolicy
    );
  });

  it('returns expected response', async () => {
    mockCall.mockResolvedValue({
      headers: customHeaders,
      json: () => mockResponse,
      ok: true,
    });

    const response = await getMemberProfileInfo(
      mockConfig,
      authToken,
      mockRetryPolicy,
      deviceToken
    );
    const expectedResponse = {
      ...mockResponse,
      memberInfoRequestId: null,
      refreshToken: undefined,
    };

    expect(response).toEqual(expectedResponse);
  });

  it('returns expected response on getFavoritedPharmacies failure', async () => {
    getFavoritedPharmaciesMock.mockImplementation(() => {
      throw new Error();
    });
    mockCall.mockResolvedValue({
      headers: customHeaders,
      json: () => mockResponse,
      ok: true,
    });

    const response = await getMemberProfileInfo(
      mockConfig,
      authToken,
      mockRetryPolicy,
      deviceToken
    );
    const expectedResponse = {
      ...mockResponse,
      memberInfoRequestId: null,
      refreshToken: undefined,
    };

    expect(response).toEqual(expectedResponse);
  });

  it('throws expected error if response invalid', async () => {
    const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const error = new ErrorApiResponse(ErrorConstants.errorInternalServer());
    const errorCode = 1;

    mockCall.mockResolvedValue({
      json: () => ({
        code: errorCode,
      }),
      ok: false,
      status: statusCode,
    });

    mockHandleHttpErrors.mockReturnValue(error);

    try {
      await getMemberProfileInfo(
        mockConfig,
        authToken,
        mockRetryPolicy,
        deviceToken
      );
      fail('Throw expected Exception');
    } catch (ex) {
      expect(ex).toEqual(error);
    }
    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorForGettingMemberContactInfo,
      APITypes.GET_MEMBERS,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});

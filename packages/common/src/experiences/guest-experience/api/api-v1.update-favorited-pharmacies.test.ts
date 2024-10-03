// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../errors/error-codes';
import { ErrorFavoritingPharmacy } from '../../../errors/error-favoriting-pharmacy';
import { IUpdateFavoritedPharmaciesRequestBody } from '../../../models/api-request-body/update-favorited-pharmacies.request-body';
import { ErrorConstants } from '../../../theming/constants';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { RequestHeaders } from './api-request-headers';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { updateFavoritedPharmacies } from './api-v1.update-favorited-pharmacies';

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
    favoritedPharmacies: '/account/favorited-pharmacies',
  },
};

const mockRetryPolicy = {} as IRetryPolicy;

const favoritedPharmaciesMock = ['ncpdp-mock-1', 'ncpdp-mock-2'];

const updateFavoritedPharmaciesRequestBody = {
  favoritedPharmacies: favoritedPharmaciesMock,
} as IUpdateFavoritedPharmaciesRequestBody;

const mockResponse = {
  message: 'all good',
  status: 'success',
};

describe('update favorited-pharmacies', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const authToken = 'auth-token';
    const deviceToken = 'device-token';
    await updateFavoritedPharmacies(
      mockConfig,
      updateFavoritedPharmaciesRequestBody,
      deviceToken,
      authToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.favoritedPharmacies}`;
    const expectedBody = updateFavoritedPharmaciesRequestBody;
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'POST',
      expectedHeaders,
      mockRetryPolicy
    );

    expect(mockHandleHttpErrors).not.toHaveBeenCalled();
  });

  it('throws ErrorFavoritingPharmacy on INTERNAL_SERVER_ERROR', async () => {
    const errorCode = 1;
    const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;

    mockCall.mockResolvedValue({
      json: () => ({
        code: errorCode,
      }),
      ok: false,
      status: statusCode,
    });

    const authToken = 'auth-token';
    const deviceToken = 'device-token';

    try {
      await updateFavoritedPharmacies(
        mockConfig,
        updateFavoritedPharmaciesRequestBody,
        deviceToken,
        authToken,
        mockRetryPolicy
      );
    } catch (error) {
      expect(error instanceof ErrorFavoritingPharmacy).toBeTruthy();
      expect((error as ErrorFavoritingPharmacy).message).toEqual(
        ErrorConstants.errorForUpdateFavoritedPharmacies
      );
    }
  });

  it('throws handleHttpErrors on non-INTERNAL_SERVER_ERROR codes', async () => {
    const errorCodeMock = 1;
    const statusCodeMock = HttpStatusCodes.SERVICE_UNAVAILABLE;
    const errorResponseMock = {
      json: () => ({
        code: errorCodeMock,
      }),
      ok: false,
      status: statusCodeMock,
    };

    mockCall.mockResolvedValue(errorResponseMock);

    const authToken = 'auth-token';
    const deviceToken = 'device-token';

    try {
      await updateFavoritedPharmacies(
        mockConfig,
        updateFavoritedPharmaciesRequestBody,
        deviceToken,
        authToken,
        mockRetryPolicy
      );
    } catch (error) {
      expect(mockHandleHttpErrors).toHaveBeenCalledTimes(1);
      expect(mockHandleHttpErrors).toHaveBeenNthCalledWith(
        1,
        statusCodeMock,
        ErrorConstants.errorForUpdateFavoritedPharmacies,
        APITypes.UPDATE_FAVORITED_PHARMACIES,
        errorCodeMock,
        { code: errorCodeMock }
      );
    }
  });
});

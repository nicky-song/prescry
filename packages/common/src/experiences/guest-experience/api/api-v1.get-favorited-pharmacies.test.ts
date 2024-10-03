// Copyright 2022 Prescryptive Health, Inc.

import { IFavoritedPharmacyResponse } from '../../../models/api-response/favorited-pharmacy-response';
import {
  buildUrl,
  buildCommonHeaders,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { getFavoritedPharmacies } from './api-v1.get-favorited-pharmacies';
import { ensureGetFavoritedPharmacyResponse } from './ensure-api-response/ensure-get-favorited-pharmacy-response';
import { withRefreshToken } from './with-refresh-token';
import { handleHttpErrors, APITypes } from './api-v1-helper';
import { ErrorConstants } from '../../../theming/constants';

jest.mock('../../../theming/constants', () => ({
  ErrorConstants: {
    errorForGetFavoritedPharmacies: 'error-for-get-favorited-pharmacies-mock',
  },
}));

jest.mock('../../../utils/api.helper', () => ({
  buildUrl: jest.fn(),
  buildCommonHeaders: jest.fn(),
  call: jest.fn(),
}));
const buildUrlMock = buildUrl as jest.Mock;
const buildCommonHeadersMock = buildCommonHeaders as jest.Mock;
const callMock = call as jest.Mock;

jest.mock('./api-v1-helper', () => ({
  APITypes: {
    GET_FAVORITED_PHARMACIES: 'get-favorited-pharmacies-mock',
  },
  handleHttpErrors: jest.fn().mockReturnValue(false),
}));

jest.mock('./ensure-api-response/ensure-get-favorited-pharmacy-response');
const ensureGetFavoritedPharmacyResponseMock =
  ensureGetFavoritedPharmacyResponse as jest.Mock;

jest.mock('./with-refresh-token');
const withRefreshTokenMock = withRefreshToken as jest.Mock;

describe('getFavoritedPharmacies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls ensureGetFavoritedPharmacyResponse with expected response and url + withRefreshToken', async () => {
    const urlMock = 'url-mock';

    buildUrlMock.mockReturnValue(urlMock);

    const responseJsonMock = {};

    const responseMock = {
      ok: true,
      json: jest.fn().mockReturnValue(responseJsonMock),
    };

    callMock.mockReturnValue(responseMock);

    const favoritedPharmacyResponseMock = {} as IFavoritedPharmacyResponse;

    ensureGetFavoritedPharmacyResponseMock.mockReturnValue(
      favoritedPharmacyResponseMock
    );

    const configMock = {} as IApiConfig;
    const tokenMock = 'token-mock';
    const retryPolicyMock = {} as IRetryPolicy;
    const deviceTokenMock = 'device-token-mock';

    await getFavoritedPharmacies(
      configMock,
      tokenMock,
      retryPolicyMock,
      deviceTokenMock
    );

    expect(buildUrlMock).toHaveBeenCalledTimes(1);
    expect(buildUrlMock).toHaveBeenNthCalledWith(
      1,
      configMock,
      'favoritedPharmacies',
      {}
    );

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenNthCalledWith(
      1,
      urlMock,
      null,
      'GET',
      buildCommonHeaders(configMock, tokenMock, deviceTokenMock),
      retryPolicyMock
    );

    expect(buildCommonHeadersMock).toHaveBeenCalledTimes(2);
    expect(buildCommonHeadersMock).toHaveBeenNthCalledWith(
      1,
      configMock,
      tokenMock,
      deviceTokenMock
    );
    expect(buildCommonHeadersMock).toHaveBeenNthCalledWith(
      2,
      configMock,
      tokenMock,
      deviceTokenMock
    );

    expect(ensureGetFavoritedPharmacyResponseMock).toHaveBeenCalledTimes(1);
    expect(ensureGetFavoritedPharmacyResponseMock).toHaveBeenNthCalledWith(
      1,
      responseJsonMock,
      urlMock
    );

    expect(withRefreshToken).toHaveBeenCalledTimes(1);
    expect(withRefreshTokenMock).toHaveBeenNthCalledWith(
      1,
      favoritedPharmacyResponseMock,
      responseMock
    );
  });

  it('throws handleHttpErrors when response.ok is falsy', async () => {
    const urlMock = 'url-mock';

    buildUrlMock.mockReturnValue(urlMock);

    const responseJsonMock = { code: 'code-mock' };

    const responseMock = {
      ok: false,
      json: jest.fn().mockReturnValue(responseJsonMock),
      status: 'status-mock',
    };

    callMock.mockReturnValue(responseMock);

    const favoritedPharmacyResponseMock = {} as IFavoritedPharmacyResponse;

    ensureGetFavoritedPharmacyResponseMock.mockReturnValue(
      favoritedPharmacyResponseMock
    );

    const configMock = {} as IApiConfig;
    const tokenMock = 'token-mock';
    const retryPolicyMock = {} as IRetryPolicy;
    const deviceTokenMock = 'device-token-mock';

    try {
      await getFavoritedPharmacies(
        configMock,
        tokenMock,
        retryPolicyMock,
        deviceTokenMock
      );
    } catch (e) {
      expect(buildUrlMock).toHaveBeenCalledTimes(1);
      expect(buildUrlMock).toHaveBeenNthCalledWith(
        1,
        configMock,
        'favoritedPharmacies',
        {}
      );

      expect(callMock).toHaveBeenCalledTimes(1);
      expect(callMock).toHaveBeenNthCalledWith(
        1,
        urlMock,
        null,
        'GET',
        buildCommonHeaders(configMock, tokenMock, deviceTokenMock),
        retryPolicyMock
      );

      expect(buildCommonHeadersMock).toHaveBeenCalledTimes(2);
      expect(buildCommonHeadersMock).toHaveBeenNthCalledWith(
        1,
        configMock,
        tokenMock,
        deviceTokenMock
      );
      expect(buildCommonHeadersMock).toHaveBeenNthCalledWith(
        2,
        configMock,
        tokenMock,
        deviceTokenMock
      );

      expect(ensureGetFavoritedPharmacyResponseMock).toHaveBeenCalledTimes(0);
      expect(withRefreshToken).toHaveBeenCalledTimes(0);

      expect(handleHttpErrors).toHaveBeenCalledTimes(1);
      expect(handleHttpErrors).toHaveBeenNthCalledWith(
        1,
        responseMock.status,
        ErrorConstants.errorForGetFavoritedPharmacies,
        APITypes.GET_FAVORITED_PHARMACIES,
        responseJsonMock.code,
        responseJsonMock
      );
    }
  });
});

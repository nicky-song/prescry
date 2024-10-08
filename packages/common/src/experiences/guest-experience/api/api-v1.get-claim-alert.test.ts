// Copyright 2022 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../errors/error-codes';
import { IClaimAlertResponse } from '../../../models/api-response/claim-alert.response';
import { ErrorConstants } from '../../../theming/constants';
import { buildUrl, call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { alternativePlanComboGenericMock } from '../__mocks__/claim-alert.mock';
import { RequestHeaders } from './api-request-headers';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { getClaimAlert } from './api-v1.get-claim-alert';

jest.mock('../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../utils/api.helper') as object),
  call: jest.fn(),
}));

jest.mock('./api-v1-helper', () => ({
  ...(jest.requireActual('./api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));

const mockCall = call as jest.Mock;
const mockHandleHttpErrors = handleHttpErrors as jest.Mock;

const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v2',
    url: '/api',
  },
  paths: {
    claimAlert: '/claimAlert/:id',
  },
};
const authToken = 'auth-token';
const deviceToken = 'device-token';
const mockRetryPolicy = {} as IRetryPolicy;

const mockClaimAlertResponse: IClaimAlertResponse = {
  data: alternativePlanComboGenericMock,
  message: '',
  status: 'success',
};
const identifierMock = 'rogue-0';
describe('getClaimAlert', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request with query string', async () => {
    mockCall.mockResolvedValue({
      json: () => mockClaimAlertResponse,
      ok: true,
    });

    await getClaimAlert(
      mockConfig,
      identifierMock,
      authToken,
      deviceToken,
      mockRetryPolicy
    );

    const expectedUrl = buildUrl(mockConfig, 'claimAlert', {
      ':identifier': identifierMock,
    });

    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: mockConfig.env.version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      undefined,
      'GET',
      expectedHeaders,
      mockRetryPolicy
    );
  });

  it('returns valid response', async () => {
    mockCall.mockResolvedValue({
      json: () => mockClaimAlertResponse,
      ok: true,
      status: HttpStatusCodes.SUCCESS,
    });

    const response = await getClaimAlert(
      mockConfig,
      identifierMock,
      authToken,
      deviceToken,
      mockRetryPolicy
    );

    expect(response).toEqual(mockClaimAlertResponse);
  });

  it('throws error if response is invalid', async () => {
    const error = new ErrorApiResponse(ErrorConstants.errorInternalServer());

    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
      status: HttpStatusCodes.SUCCESS,
    });

    try {
      await getClaimAlert(
        mockConfig,
        identifierMock,
        authToken,
        deviceToken,
        mockRetryPolicy
      );
      fail('failing the test due to invalid response');
    } catch (ex) {
      expect(ex).toEqual(error);
    }
  });

  it('includes refresh token in response', async () => {
    const refreshToken = 'refresh-token';
    const headers = new Headers();
    headers.append(RequestHeaders.refreshAccountToken, refreshToken);

    mockCall.mockResolvedValue({
      json: () => mockClaimAlertResponse,
      ok: true,
      headers,
    });

    const response = await getClaimAlert(
      mockConfig,
      identifierMock,
      authToken,
      deviceToken,
      mockRetryPolicy
    );

    expect(response.refreshToken).toEqual(refreshToken);
  });

  it('throws error if response is failed to receive', async () => {
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
      await getClaimAlert(
        mockConfig,
        identifierMock,
        authToken,
        deviceToken,
        mockRetryPolicy
      );
      fail('Throw expected Exception');
    } catch (ex) {
      expect(ex).toEqual(error);
    }
    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorForGettingClaimAlert,
      APITypes.GET_CLAIM_ALERT,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});

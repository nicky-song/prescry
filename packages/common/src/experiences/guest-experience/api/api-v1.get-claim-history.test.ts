// Copyright 2022 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../errors/error-codes';
import { IClaimHistoryResponse } from '../../../models/api-response/claim-history.response';
import { IClaimHistory } from '../../../models/claim';
import { ErrorConstants } from '../../../theming/constants';
import { buildUrl, call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { claimHistoryMock } from '../__mocks__/medicine-cabinet-state.mock';
import { RequestHeaders } from './api-request-headers';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { getClaimHistory } from './api-v1.get-claim-history';

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

const claimMockWithNoFilledOn: IClaimHistory = {
  claims: [
    {
      prescriptionId: '1',
      drugName: 'Medicine A',
      ndc: '12345',
      formCode: 'TAB',
      strength: '100mg',
      quantity: 20,
      daysSupply: 22,
      refills: 2,
      orderNumber: '112233',
      practitioner: {
        id: 'practitioner-1',
        name: 'Dr. One',
        phoneNumber: '1111111111',
      },
      pharmacy: {
        name: 'Rx Pharmacy 1',
        ncpdp: '1',
      },
      billing: {
        memberPays: 1.86,
        deductibleApplied: 1.86,
      },
    },
  ],
  claimPdf: '',
};

const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    claimHistory: '/claims',
  },
};
const authToken = 'auth-token';
const deviceToken = 'device-token';
const mockRetryPolicy = {} as IRetryPolicy;

const mockClaimHistoryResponse: IClaimHistoryResponse = {
  data: claimHistoryMock,
  message: '',
  status: 'success',
};

const mockClaimHistoryResponseWithNoFilledOn: IClaimHistoryResponse = {
  data: claimMockWithNoFilledOn,
  message: '',
  status: 'success',
};

describe('getClaimHistory', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request with query string', async () => {
    mockCall.mockResolvedValue({
      json: () => mockClaimHistoryResponse,
      ok: true,
    });

    await getClaimHistory(mockConfig, authToken, deviceToken, mockRetryPolicy);

    const expectedUrl = buildUrl(mockConfig, 'claimHistory', {});

    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: mockConfig.env.version,
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
      json: () => mockClaimHistoryResponse,
      ok: true,
      status: HttpStatusCodes.SUCCESS,
    });

    const response = await getClaimHistory(
      mockConfig,
      authToken,
      deviceToken,
      mockRetryPolicy
    );
    expect(response).toEqual(mockClaimHistoryResponse);
  });

  it('throws error if response is invalid', async () => {
    const error = new ErrorApiResponse(ErrorConstants.errorInternalServer());

    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
      status: HttpStatusCodes.SUCCESS,
    });

    try {
      await getClaimHistory(
        mockConfig,
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
      json: () => mockClaimHistoryResponse,
      ok: true,
      headers,
    });

    const response = await getClaimHistory(
      mockConfig,
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
      await getClaimHistory(
        mockConfig,
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
      ErrorConstants.errorForGettingClaimHistory,
      APITypes.GET_CLAIM_HISTORY,
      errorCode,
      {
        code: errorCode,
      }
    );
  });

  it('returns valid response with no filledOn date', async () => {
    mockCall.mockResolvedValue({
      json: () => mockClaimHistoryResponseWithNoFilledOn,
      ok: true,
      status: HttpStatusCodes.SUCCESS,
    });

    const response = await getClaimHistory(
      mockConfig,
      authToken,
      deviceToken,
      mockRetryPolicy
    );
    response.data.claims.forEach((claim) => {
      expect(claim.filledOn).toStrictEqual(undefined);
    });
  });
});

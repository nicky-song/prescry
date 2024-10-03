// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../errors/error-codes';
import {
  IPastProcedure,
  IPastProcedureResponse,
} from '../../../models/api-response/past-procedure-response';
import { ErrorConstants } from '../../../theming/constants';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { RequestHeaders } from './api-request-headers';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { getPastProceduresList } from './api-v1.get-past-procedures-list';

jest.mock('../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../utils/api.helper') as object),
  call: jest.fn(),
}));
jest.mock('./api-v1-helper', () => ({
  ...(jest.requireActual('./api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));

const mockRetryPolicy = {} as IRetryPolicy;
const mockCall = call as jest.Mock;
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
    pastProcedures: '/past-procedures-list',
  },
};

const mockResult: IPastProcedure[] = [
  {
    orderNumber: '1234',
    time: 'appointment-time',
    date: 'appointment-date',
    serviceDescription: 'test',
    memberFirstName: 'FIRST1',
    memberLastName: 'LAST1',
    procedureType: 'observation',
  },
  {
    orderNumber: '1235',
    time: 'appointment-time',
    date: 'appointment-date',
    serviceDescription: 'test',
    memberFirstName: 'FIRST1',
    memberLastName: 'LAST1',
    procedureType: 'observation',
  },
  {
    orderNumber: '1224',
    time: 'appointment-time',
    date: 'appointment-date',
    serviceDescription: 'test',
    memberFirstName: 'FIRST2',
    memberLastName: 'LAST2',
    procedureType: 'observation',
  },
];

const mockResponse: IPastProcedureResponse = {
  data: {
    pastProcedures: mockResult,
  },
  message: '',
  status: 'success',
};

describe('getPastProceduresList', () => {
  const authToken = 'auth-token';
  const deviceToken = 'device-token';
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await getPastProceduresList(
      mockConfig,
      authToken,
      mockRetryPolicy,
      deviceToken
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedURL = `${protocol}://${host}:${port}${url}${mockConfig.paths.pastProcedures}`;
    const expectedBody = undefined;
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedURL,
      expectedBody,
      'GET',
      expectedHeaders,
      mockRetryPolicy
    );
  });

  it('throws expected error if response invalid', async () => {
    const statusCode = HttpStatusCodes.SUCCESS;
    const expectedError = new ErrorApiResponse(
      ErrorConstants.errorInternalServer()
    );
    mockCall.mockResolvedValueOnce({
      json: () => ({}),
      ok: true,
      status: statusCode,
    });

    try {
      await getPastProceduresList(
        mockConfig,
        authToken,
        mockRetryPolicy,
        deviceToken
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }
  });

  it('returns expected response', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const response = await getPastProceduresList(
      mockConfig,
      authToken,
      mockRetryPolicy,
      deviceToken
    );

    expect(response).toEqual(mockResponse);
  });

  it('includes refresh token in response', async () => {
    const refreshToken = 'refresh-token';
    const headers = new Headers();
    headers.append(RequestHeaders.refreshAccountToken, refreshToken);

    mockCall.mockResolvedValueOnce({
      json: () => mockResponse,
      ok: true,
      headers,
    });

    const response = await getPastProceduresList(
      mockConfig,
      authToken,
      mockRetryPolicy,
      deviceToken
    );

    expect(response.refreshToken).toEqual(refreshToken);
  });

  it('throws expected error if response failed', async () => {
    const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const expectedError = Error('failed');
    const errorCode = 1;

    mockCall.mockResolvedValue({
      json: () => ({
        code: errorCode,
      }),
      ok: false,
      status: statusCode,
    });

    mockHandleHttpErrors.mockReturnValue(expectedError);

    try {
      await getPastProceduresList(
        mockConfig,
        authToken,
        mockRetryPolicy,
        deviceToken
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorForGettingPastProceduresList,
      APITypes.TEST_RESULTS_LIST,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});

// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../errors/error-codes';
import {
  IImmunizationRecord,
  IImmunizationRecordResponse,
} from '../../../models/api-response/immunization-record-response';
import { ErrorConstants } from '../../../theming/constants';
import { buildUrl, call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { RequestHeaders } from './api-request-headers';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { getImmunizationRecordDetails } from './api-v1.get-immunization-record';

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

const orderNumber = '12345';
const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    immunizationRecord: '/immunization-record/:id',
  },
};
const authToken = 'auth-token';
const deviceToken = 'device-token';
const mockRetryPolicy = {} as IRetryPolicy;

const mockImmunizationRecordResponse: IImmunizationRecordResponse = {
  data: {
    immunizationResult: [
      {
        immunizationId: 'immunization-id',
        orderNumber: '12345',
        manufacturer: 'MODERNA',
        lotNumber: '12345',
        doseNumber: 1,
        locationName: 'Rx Pharmacy',
        address1: 'address1',
        city: 'Austin',
        state: 'Texas',
        zip: '78660',
        date: 'March 5 2021',
        time: '10:00 AM',
        memberId: ' member-id',
        vaccineCode: '91301',
      } as IImmunizationRecord,
    ],
  },
  message: '',
  status: 'success',
};

describe('getImmunizationRecordDetails', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockImmunizationRecordResponse,
      ok: true,
    });

    await getImmunizationRecordDetails(
      mockConfig,
      orderNumber,
      authToken,
      mockRetryPolicy,
      deviceToken
    );

    const expectedUrl = buildUrl(mockConfig, 'immunizationRecord', {
      ':id': orderNumber,
    });

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
      json: () => mockImmunizationRecordResponse,
      ok: true,
      status: HttpStatusCodes.SUCCESS,
    });

    const response = await getImmunizationRecordDetails(
      mockConfig,
      orderNumber,
      authToken,
      mockRetryPolicy,
      deviceToken
    );
    expect(response).toEqual(mockImmunizationRecordResponse);
  });

  it('throws error if response is invalid', async () => {
    const error = new ErrorApiResponse(ErrorConstants.errorInternalServer());

    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
      status: HttpStatusCodes.SUCCESS,
    });

    try {
      await getImmunizationRecordDetails(
        mockConfig,
        orderNumber,
        authToken,
        mockRetryPolicy,
        deviceToken
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
      json: () => mockImmunizationRecordResponse,
      ok: true,
      headers,
    });

    const response = await getImmunizationRecordDetails(
      mockConfig,
      orderNumber,
      authToken,
      mockRetryPolicy,
      deviceToken
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
      await getImmunizationRecordDetails(
        mockConfig,
        orderNumber,
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
      ErrorConstants.errorForGettingImmunizationRecordDetails,
      APITypes.IMMUNIZATION_RECORD_DETAILS,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});

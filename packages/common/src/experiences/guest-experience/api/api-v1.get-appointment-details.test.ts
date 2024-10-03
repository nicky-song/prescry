// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../errors/error-codes';
import { ErrorConstants } from '../../../theming/constants';
import { buildUrl, call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import {
  IAppointmentItem,
  IAppointmentResponse,
} from '../../../models/api-response/appointment.response';
import { getAppointmentDetails } from './api-v1.get-appointment-details';
import { RequestHeaders } from './api-request-headers';

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

const mockResponse: IAppointmentResponse = {
  data: {
    appointment: {
      additionalInfo: 'Patient must wear mask or face covering',
      address1: '7807 219th ST SW',
      city: 'Yakima',
      locationName: 'Rx Pharmacy',
      orderNumber: '1419',
      serviceName: 'COVID-19 Antigen Testing',
      state: 'WA',
      status: 'Accepted',
      zip: '98056',
      date: 'date',
      time: 'time',
      procedureCode: 'procedure-code',
      serviceDescription: 'description',
    } as IAppointmentItem,
  },
  message: '',
  status: 'success',
};

describe('getAppointmentDetails', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await getAppointmentDetails(
      mockConfig,
      '1234',
      authToken,
      mockRetryPolicy,
      deviceToken
    );

    const expectedUrl = buildUrl(mockConfig, 'appointmentDetails', {
      ':id': '1234',
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

  it('throws expected error if response invalid', async () => {
    const statusCode = HttpStatusCodes.SUCCESS;
    const expectedError = new ErrorApiResponse(
      ErrorConstants.errorInternalServer()
    );

    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
      status: statusCode,
    });

    try {
      await getAppointmentDetails(
        mockConfig,
        '1234',
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

    const response = await getAppointmentDetails(
      mockConfig,
      '1234',
      authToken,
      mockRetryPolicy,
      deviceToken
    );
    const expectedResponse = mockResponse;

    expect(response).toEqual(expectedResponse);
  });

  it('includes refresh token in response', async () => {
    const refreshToken = 'refresh-token';
    const headers = new Headers();
    headers.append(RequestHeaders.refreshAccountToken, refreshToken);

    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
      headers,
    });

    const response = await getAppointmentDetails(
      mockConfig,
      '1234',
      authToken,
      mockRetryPolicy,
      deviceToken
    );

    expect(response.refreshToken).toEqual(refreshToken);
  });

  it('throws expected error if response failed', async () => {
    const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const expectedError = Error('Failed');
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
      await getAppointmentDetails(
        mockConfig,
        '1234',
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
      ErrorConstants.errorForGettingAppointmentDetails,
      APITypes.APPOINTMENT_DETAILS,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});

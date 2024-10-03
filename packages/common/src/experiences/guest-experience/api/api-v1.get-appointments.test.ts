// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../errors/error-codes';
import { ErrorConstants } from '../../../theming/constants';
import { buildUrl, call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import {
  IAppointmentListItem,
  IAppointmentsResponse,
} from '../../../models/api-response/appointment.response';
import { getAppointments } from './api-v1.get-appointments';
import { RequestHeaders } from './api-request-headers';
import { appointmentsListContent } from '../../../components/member/lists/appointments-list/appointments-list.content';
import { defaultAppointmentsListState } from '../state/appointments-list/appointments-list.state';

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
const appointmentListDetailsMock = { appointmentsType: defaultAppointmentsListState.appointmentsType, start: defaultAppointmentsListState.start, batchSize: appointmentsListContent.appointmentBatchSize };

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

const mockResponse: IAppointmentsResponse = {
  data: {
    appointments: [
      {
        customerName: 'customerName',
        orderNumber: '1419',
        locationName: 'Rx Pharmacy',
        date: 'date',
        time: 'time',
        serviceDescription: 'description',
        bookingStatus: 'Confirmed',
        serviceType: 'serviceType',
        appointmentLink: 'appointmentLink',
      } as IAppointmentListItem,
    ],
  },
  message: '',
  status: 'success',
};

describe('getAppointments', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await getAppointments(
      mockConfig,
      appointmentListDetailsMock,
      authToken,
      mockRetryPolicy,
      deviceToken
    );

    const expectedUrl = buildUrl(mockConfig, 'appointments', {});
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: mockConfig.env.version,
    };

    expect(mockCall).toHaveBeenCalledWith(
      `${expectedUrl}?start=${0}&type=${'upcoming'}`,
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
      await getAppointments(
        mockConfig,
        appointmentListDetailsMock,
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

    const response = await getAppointments(
      mockConfig,
      appointmentListDetailsMock,
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

    const response = await getAppointments(
      mockConfig,
      appointmentListDetailsMock,
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
      await getAppointments(
        mockConfig,
        appointmentListDetailsMock,
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
      APITypes.APPOINTMENTS_LIST,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});

// Copyright 2021 Prescryptive Health, Inc.

import { IBookingResponseError } from '@phx/common/src/models/booking/booking-error';
import { ICreateAppointmentRequest } from '../../../models/pharmacy-portal/appointment-create.request';
import { ICreateAppointmentResponse } from '../../../models/pharmacy-portal/appointment-create.response';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../helpers/oauth-api-helper';
import {
  createAppointmentEndpointHelper,
  getCreateAppointmentEndpointUrl,
} from './create-appointment-endpoint.helper';

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

jest.mock('../helpers/oauth-api-helper');
const generateBearerTokenMock = generateBearerToken as jest.Mock;

const mockBookingPayload: ICreateAppointmentRequest = {
  memberFamilyId: 'member-family-id',
  memberPersonCode: 'member-person_code',
  accountIdentifier: 'accountIdentifier',
  orderNumber: '123456789',
  tags: ['member-personcodemember-family-id'],
  customerName: 'customername',
  customerPhone: 'customerphone',
  bookingId: 'bookingId',
  acceptMessageText: 'accept message text',
  memberRxId: 'member-personcodemember-family-id',
  questions: [],
  serviceType: 'serviceType',
  isTestAppointment: false,
  isDependentAppointment: false,
  sessionId: 'sessionId',
  productPriceId: '',
  unitAmount: 1,
  isTestPayment: false,
  stripeSessionId: '',
  stripeClientReferenceId: '',
  providerLocationId: 'loc-id',
};

const mockBookingResponse: ICreateAppointmentResponse = {
  statusCode: 201,
  message: 'success',
};
const mockBookingError: IBookingResponseError = {
  message: 'mock-error',
};
const apiBaseUrl = 'http://pharmacyportalapi.url/v1';
describe('createAppointmentEndpointHelper', () => {
  beforeEach(() => {
    getDataFromUrlMock.mockReset();
    generateBearerTokenMock.mockReset();
    generateBearerTokenMock.mockResolvedValue('token');
  });

  it('makes expected api request and return response if success', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockBookingResponse,
      ok: true,
    });

    const result = await createAppointmentEndpointHelper(
      apiBaseUrl,
      mockBookingPayload,
      'tenant-id',
      'client-id',
      'client-secret',
      'api-scope'
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'tenant-id',
      'client-id',
      'client-secret',
      'api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      `${apiBaseUrl}/appointments`,
      mockBookingPayload,
      'POST',
      { Authorization: 'Bearer token' }
    );
    expect(result).toEqual({
      message: 'success',
    });
  });
  it('makes expected api request and return error code if failure', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockBookingError,
      ok: false,
      status: 500,
    });

    const result = await createAppointmentEndpointHelper(
      apiBaseUrl,
      mockBookingPayload,
      'tenant-id',
      'client-id',
      'client-secret',
      'api-scope'
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'tenant-id',
      'client-id',
      'client-secret',
      'api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      `${apiBaseUrl}/appointments`,
      mockBookingPayload,
      'POST',
      { Authorization: 'Bearer token' }
    );
    expect(result).toEqual({
      errorCode: 500,
      message: 'mock-error',
    });
  });
});

describe('getCreateAppointmentEndpointUrl', () => {
  it('return expected url for the given parameters', () => {
    const expectedUrl = `${apiBaseUrl}/appointments`;
    const result = getCreateAppointmentEndpointUrl(
      'http://pharmacyportalapi.url/v1'
    );
    expect(result).toEqual(expectedUrl);
  });
});

// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { IGetAvailableBookingSlotsRequest } from '../../../models/pharmacy-portal/get-available-booking-slots.request';
import { IPharmacyPortalEndpointError } from '../../../models/pharmacy-portal/pharmacy-portal-error.response';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../helpers/oauth-api-helper';
import {
  convertToBookingAvailability,
  getAvailableBookingSlotsEndpointHelper,
} from './get-available-booking-slots-endpoint.helper';

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

jest.mock('../helpers/oauth-api-helper');
const generateBearerTokenMock = generateBearerToken as jest.Mock;

const configurationMock = {
  pharmacyPortalApiClientId: 'pharmacy-client-id',
  pharmacyPortalApiClientSecret: 'pharmacy-client-secret',
  pharmacyPortalApiScope: 'pharmacy-api-scope',
  pharmacyPortalApiTenantId: 'pharmacy-tenant-id',
  pharmacyPortalApiUrl: 'https://pharmacy-url',
} as IConfiguration;

const getBookingSlotsRequestMock: IGetAvailableBookingSlotsRequest = {
  serviceType: 'c19-vaccine-dose1',
  locationId: 'test-location',
  start: '2021-05-11T00:00:00',
  end: '2021-05-11T23:59:59',
};

const mockBookingError: IPharmacyPortalEndpointError = {
  message: 'mock-error',
};

describe('getAvailabileBookingSlotsEndpointHelper', () => {
  const getBookingSlotsResponseMock: Date[] = [
    new Date('2021-05-11T18:15:00+00:00'),
    new Date('2021-05-11T18:30:00+00:00'),
    new Date('2021-05-11T18:45:00+00:00'),
  ];

  beforeEach(() => {
    getDataFromUrlMock.mockReset();
    generateBearerTokenMock.mockReset();
    generateBearerTokenMock.mockResolvedValue('token');
  });

  const expectedUrl =
    'https://pharmacy-url/provider/booking/?locationId=test-location&start=2021-05-11T00%3A00%3A00&end=2021-05-11T23%3A59%3A59&serviceType=c19-vaccine-dose1';

  it('makes expected api request and return response if success', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => getBookingSlotsResponseMock,
      ok: true,
    });

    const result = await getAvailableBookingSlotsEndpointHelper(
      configurationMock,
      getBookingSlotsRequestMock
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );

    expect(getDataFromUrlMock).toBeCalledWith(
      expectedUrl,
      null,
      'GET',
      {
        Authorization: 'Bearer token',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    expect(result).toEqual({
      slots: getBookingSlotsResponseMock,
      message: 'success',
    });
  });

  it('makes expected api request and return error code if failure', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockBookingError,
      ok: false,
      status: 500,
    });

    const result = await getAvailableBookingSlotsEndpointHelper(
      configurationMock,
      getBookingSlotsRequestMock
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );

    expect(getDataFromUrlMock).toBeCalledWith(
      expectedUrl,
      null,
      'GET',
      {
        Authorization: 'Bearer token',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    expect(result).toEqual({
      errorCode: 500,
      message: 'mock-error',
    });
  });
});

describe('convertToBookingAvailability', () => {
  const dates: string[] = [
    // 13th
    '2021-05-13T08:00:00-04:00',
    '2021-05-13T08:15:00-04:00',
    '2021-05-13T09:30:00-04:00',
    // 15th
    '2021-05-15T10:00:00-04:00',
    '2021-05-15T10:45:00-04:00',
    '2021-05-15T09:30:00-04:00',
    // 16th
    '2021-05-16T13:00:00-04:00',
  ];

  it('return expected array', () => {
    const expectedResult = [
      {
        date: new Date('2021-05-13T00:00:00'),
        slots: [
          new Date('2021-05-13T08:00:00'),
          new Date('2021-05-13T08:15:00'),
          new Date('2021-05-13T09:30:00'),
        ],
      },
      { date: new Date('2021-05-14T00:00:00'), slots: [] },
      {
        date: new Date('2021-05-15T00:00:00'),
        slots: [
          new Date('2021-05-15T10:00:00'),
          new Date('2021-05-15T10:45:00'),
          new Date('2021-05-15T09:30:00'),
        ],
      },
      {
        date: new Date('2021-05-16T00:00:00'),
        slots: [new Date('2021-05-16T13:00:00')],
      },
    ];

    const result = convertToBookingAvailability(
      dates[0],
      dates[dates.length - 1],
      dates
    );
    expect(result).toEqual(expectedResult);
  });

  it('return BookingAvailability array with empty slots if availableSlotDates argument is empty array', () => {
    const expectedResult = [
      {
        date: new Date('2021-05-13T00:00:00'),
        slots: [],
      },
      { date: new Date('2021-05-14T00:00:00'), slots: [] },
      {
        date: new Date('2021-05-15T00:00:00'),
        slots: [],
      },
      { date: new Date('2021-05-16T00:00:00'), slots: [] },
    ];
    const result = convertToBookingAvailability(
      dates[0],
      dates[dates.length - 1],
      [] as string[]
    );
    expect(result).toEqual(expectedResult);
  });
});

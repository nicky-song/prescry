// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IAvailableSlotsData } from '@phx/common/src/models/api-response/available-slots-response';
import { IBookingAvailability } from '@phx/common/src/models/booking/booking-availability.response';
import { IConfiguration } from '../../../configuration';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { IGetAvailableBookingSlotsRequest } from '../../../models/pharmacy-portal/get-available-booking-slots.request';
import { IAvailableBookingSlotsResponse } from '../../../models/pharmacy-portal/get-available-booking-slots.response';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { getSlotsAndUnavailableDays } from '../helpers/get-slots-and-unavailable-days';
import {
  convertToBookingAvailability,
  getAvailableBookingSlotsEndpointHelper,
} from '../helpers/get-available-booking-slots-endpoint.helper';
import { getStaffAvailabilityHandler } from './get-staff-availability.handler';

jest.mock('../helpers/get-available-booking-slots-endpoint.helper');
jest.mock('../../../utils/response-helper');
jest.mock('../helpers/get-slots-and-unavailable-days');

const routerResponseMock = {} as Response;
const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const getAvailabileBookingSlotsEndpointHelperMock =
  getAvailableBookingSlotsEndpointHelper as jest.Mock;
const convertToBookingAvailabilityMock =
  convertToBookingAvailability as jest.Mock;
const getSlotsAndUnavailableDaysMock = getSlotsAndUnavailableDays as jest.Mock;

const configurationMock = {
  pharmacyPortalApiClientId: 'pharmacy-client-id',
  pharmacyPortalApiClientSecret: 'pharmacy-client-secret',
  pharmacyPortalApiScope: 'pharmacy-api-scope',
  pharmacyPortalApiTenantId: 'pharmacy-tenant-id',
  pharmacyPortalApiUrl: 'pharmacy-url',
} as IConfiguration;

beforeEach(() => {
  jest.clearAllMocks();
  unknownFailureResponseMock.mockReset();
  knownFailureResponseMock.mockReset();
  successResponseMock.mockReset();
  getAvailabileBookingSlotsEndpointHelperMock.mockReset();
  convertToBookingAvailabilityMock.mockReset();
  getSlotsAndUnavailableDaysMock.mockReset();
});

describe('getStaffAvailabilityHandler', () => {
  const requestMock = {
    body: {
      locationId: '111',
      serviceType: '222',
      start: '2020-06-20T00:00:00-07:00',
      end: '2020-06-24T00:00:00-07:00',
    },
  } as Request;

  const mockConvertToBookingAvailabilityResponse: IBookingAvailability[] = [
    {
      date: new Date('2021-05-13T00:00:00'),
      slots: [
        new Date('2021-05-13T15:00:00.000Z'),
        new Date('2021-05-13T15:15:00.000Z'),
        new Date('2021-05-13T16:30:00.000Z'),
      ],
    },
    { date: new Date('2021-05-14T00:00:00'), slots: [] },
    {
      date: new Date('2021-05-16T00:00:00'),
      slots: [new Date('2021-05-16T20:00:00.000Z')],
    },
  ];

  const mockGetAvailabilityResponse: IAvailableSlotsData = {
    slots: [
      {
        start: '2020-06-20T08:00:00',
        day: '2020-06-20',
        slotName: '8:00 am',
      },
      {
        start: '2020-06-20T08:15:00',
        day: '2020-06-20',
        slotName: '8:15 am',
      },
      {
        start: '2020-06-20T08:30:00',
        day: '2020-06-20',
        slotName: '8:30 am',
      },
      {
        start: '2020-06-22T15:00:00',
        day: '2020-06-22',
        slotName: '3:00 pm',
      },
      {
        start: '2020-06-22T16:15:00',
        day: '2020-06-22',
        slotName: '4:15 pm',
      },
    ],
    unAvailableDays: ['2020-06-21', '2020-06-23', '2020-06-24'],
  };

  it('should return success from handler successfully if there is no error from API', async () => {
    // Arrange
    const mockApiResponse: IAvailableBookingSlotsResponse = {
      slots: [
        '2021-05-07T19:45:00+00:00',
        '2021-05-07T20:00:00+00:00',
        '2021-05-07T20:15:00+00:00',
      ],
      message: 'success',
    };
    getAvailabileBookingSlotsEndpointHelperMock.mockResolvedValue(
      mockApiResponse
    );
    convertToBookingAvailabilityMock.mockReturnValueOnce(
      mockConvertToBookingAvailabilityResponse
    );
    getSlotsAndUnavailableDaysMock.mockReturnValueOnce(
      mockGetAvailabilityResponse
    );

    // Act
    await getStaffAvailabilityHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );

    // Assert
    expect(getAvailabileBookingSlotsEndpointHelperMock).toBeCalledTimes(1);
    expect(getAvailabileBookingSlotsEndpointHelperMock).toHaveBeenCalledWith(
      configurationMock,
      {
        locationId: '111',
        serviceType: '222',
        start: '2020-06-20T00:00:00-07:00',
        end: '2020-06-24T00:00:00-07:00',
      }
    );

    expect(convertToBookingAvailabilityMock).toBeCalledTimes(1);
    expect(convertToBookingAvailabilityMock).toHaveBeenCalledWith(
      '2020-06-20T00:00:00-07:00',
      '2020-06-24T00:00:00-07:00',
      mockApiResponse.slots
    );

    expect(getSlotsAndUnavailableDaysMock).toBeCalledTimes(1);
    expect(getSlotsAndUnavailableDaysMock).toHaveBeenCalledWith(
      mockConvertToBookingAvailabilityResponse
    );

    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.SUCCESS_OK,
      mockGetAvailabilityResponse
    );
  });

  it('should return error from handler if api returns error', async () => {
    // Arrange
    const mockApiResponse: IAvailableBookingSlotsResponse = {
      errorCode: 404,
      message: 'error',
    };
    getAvailabileBookingSlotsEndpointHelperMock.mockResolvedValue(
      mockApiResponse
    );

    // Act
    await getStaffAvailabilityHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );

    // Assert
    expect(getAvailabileBookingSlotsEndpointHelperMock).toBeCalledTimes(1);
    expect(getAvailabileBookingSlotsEndpointHelperMock).toHaveBeenCalledWith(
      configurationMock,
      {
        locationId: '111',
        serviceType: '222',
        start: '2020-06-20T00:00:00-07:00',
        end: '2020-06-24T00:00:00-07:00',
      } as IGetAvailableBookingSlotsRequest
    );

    expect(convertToBookingAvailabilityMock).not.toHaveBeenCalled();
    expect(getSlotsAndUnavailableDaysMock).not.toHaveBeenCalled();

    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      404,
      'error'
    );
  });
  it('should return error from handler if any exception occurs', async () => {
    // Arrange
    const error = { message: 'internal error' };

    getAvailabileBookingSlotsEndpointHelperMock.mockImplementation(() => {
      throw error;
    });

    // Act
    await getStaffAvailabilityHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );

    // Assert
    expect(getAvailabileBookingSlotsEndpointHelperMock).toHaveBeenCalledWith(
      configurationMock,
      {
        locationId: '111',
        serviceType: '222',
        start: '2020-06-20T00:00:00-07:00',
        end: '2020-06-24T00:00:00-07:00',
      } as IGetAvailableBookingSlotsRequest
    );

    expect(convertToBookingAvailabilityMock).not.toHaveBeenCalled();
    expect(getSlotsAndUnavailableDaysMock).not.toHaveBeenCalled();

    expect(unknownFailureResponseMock).toBeCalledTimes(1);
    expect(unknownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
});

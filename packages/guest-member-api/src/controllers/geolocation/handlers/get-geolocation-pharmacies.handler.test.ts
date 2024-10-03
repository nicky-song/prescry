// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { getLocationForRequest } from '../helpers/get-location-for-request';
import { searchAndCacheNearbyPharmaciesForCoordinates } from '../../../utils/external-api/search-and-cache-nearby-pharmacies-for-coordinates';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { ApiConstants } from '../../../constants/api-constants';

import { getGeolocationPharmaciesHandler } from './get-geolocation-pharmacies.handler';
import { ILocationCoordinates } from '@phx/common/src/models/location-coordinates';
import { IConfiguration } from '../../../configuration';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';

const mockIp = '8.8.8.8';

const requestMock = {
  body: {},
  headers: {
    'x-forwarded-for': mockIp,
  },
} as unknown as Request;
const configurationMock = {
  ipStackApiUrl: 'ipstack-url',
  ipStackApiKey: 'ipstack-key',
} as IConfiguration;

jest.mock('../../../utils/response-helper');
jest.mock('../helpers/get-location-for-request');
jest.mock(
  '../../../utils/external-api/search-and-cache-nearby-pharmacies-for-coordinates'
);

const getLocationForRequestMock = getLocationForRequest as jest.Mock;
const searchAndCacheNearbyPharmaciesForCoordinatesMock =
  searchAndCacheNearbyPharmaciesForCoordinates as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const unknownResponseMock = UnknownFailureResponse as jest.Mock;

describe('getGeolocationPharmaciesHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get geolocation if getLocationForRequest is success', async () => {
    const mockLocation: ILocationCoordinates = {
      zipCode: '11205',
      city: 'Brooklyn',
      state: 'NY',
      latitude: 40.694214,
      longitude: -73.96529,
    };
    getLocationForRequestMock.mockReturnValueOnce({ location: mockLocation });

    const responseMock = {} as Response;
    await getGeolocationPharmaciesHandler(
      requestMock,
      responseMock,
      configurationMock
    );

    expect(getLocationForRequestMock).toBeCalledWith(
      requestMock,
      configurationMock
    );
    expect(searchAndCacheNearbyPharmaciesForCoordinatesMock).toBeCalledWith(
      configurationMock,
      40.694214,
      -73.96529,
      ApiConstants.NEARBY_PHARMACIES_DEFAULT_DISTANCE,
      ApiConstants.NEARBY_PHARMACIES_DEFAULT_LIMIT
    );
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.SUCCESS_OK,
      { location: mockLocation }
    );
  });
  it('should call knownFailureResponse if getLocationForRequest returns error', async () => {
    getLocationForRequestMock.mockReturnValueOnce({
      errorCode: HttpStatusCodes.NOT_FOUND,
      message: ErrorConstants.INVALID_ZIPCODE_SEARCH,
    });

    const responseMock = {} as unknown as Response;
    await getGeolocationPharmaciesHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getLocationForRequestMock).toBeCalledWith(
      requestMock,
      configurationMock
    );
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.NOT_FOUND,
      ErrorConstants.INVALID_ZIPCODE_SEARCH
    );
    expect(searchAndCacheNearbyPharmaciesForCoordinatesMock).not.toBeCalled();
  });

  it('should call UnknownFailureResponse if exception occured', async () => {
    const errorMock = new Error('unknown error occured');
    getLocationForRequestMock.mockImplementation(() => {
      throw errorMock;
    });
    const responseMock = {} as Response;

    await getGeolocationPharmaciesHandler(
      requestMock,
      responseMock,
      configurationMock
    );

    expect(unknownResponseMock).toHaveBeenCalled();
    expect(unknownResponseMock).toHaveBeenCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      errorMock
    );
    expect(searchAndCacheNearbyPharmaciesForCoordinatesMock).not.toBeCalled();
  });
});

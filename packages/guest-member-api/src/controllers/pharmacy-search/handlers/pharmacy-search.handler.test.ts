// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { pharmacySearchHandler } from './pharmacy-search.handler';

import { configurationMock } from '../../../mock-data/configuration.mock';
import { pharmacyMock1, pharmacyMock2 } from '../../../mock-data/pharmacy.mock';
import { searchAndCacheNearbyPharmaciesForCoordinates } from '../../../utils/external-api/search-and-cache-nearby-pharmacies-for-coordinates';

jest.mock('../../../utils/response-helper');
jest.mock(
  '../../../utils/external-api/search-and-cache-nearby-pharmacies-for-coordinates'
);
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const searchAndCacheNearbyPharmaciesForCoordinatesMock =
  searchAndCacheNearbyPharmaciesForCoordinates as jest.Mock;

const mockPrescriptionPharmacies = [pharmacyMock1, pharmacyMock2];
const mockPharmacies = [pharmacyMock1, pharmacyMock2];
beforeEach(() => {
  jest.clearAllMocks();
  searchAndCacheNearbyPharmaciesForCoordinatesMock.mockResolvedValue({
    pharmacies: mockPrescriptionPharmacies,
  });
});

const zipCodeMock = '12345';
const latitudeMock = 42.833261;
const longitudeMock = -74.058015;
const radiusMileMock = 25;

describe('pharmacySearchHandler', () => {
  it('returns error if neither zipcode nor latitude/longitude is not passed in query string', async () => {
    const requestMock = {
      app: {},
      query: {},
    } as unknown as Request;
    const responseMock = {} as Response;

    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const actual = await pharmacySearchHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(
      searchAndCacheNearbyPharmaciesForCoordinatesMock
    ).not.toHaveBeenCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      400,
      ErrorConstants.QUERYSTRING_INVALID
    );
    expect(actual).toEqual(expected);
  });

  it('returns error if zipcode is not passed and only one from latitude or longittude is passed in query string', async () => {
    const requestMock = {
      app: {},
      query: {
        latitude: latitudeMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;

    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const actual = await pharmacySearchHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(
      searchAndCacheNearbyPharmaciesForCoordinatesMock
    ).not.toHaveBeenCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      400,
      ErrorConstants.QUERYSTRING_INVALID
    );
    expect(actual).toEqual(expected);
  });

  it('Returns error if no coordinates found for zipcode', async () => {
    const responseMock = {} as Response;
    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const requestMock = {
      app: {},
      query: {
        zipcode: '1111',
      },
    } as unknown as Request;

    const actual = await pharmacySearchHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(actual).toBe(expected);
    expect(
      searchAndCacheNearbyPharmaciesForCoordinatesMock
    ).not.toHaveBeenCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      400,
      ErrorConstants.INVALID_ZIPCODE_SEARCH
    );
  });

  it('Return error if api return error', async () => {
    const responseMock = {} as Response;

    const expected = {};
    searchAndCacheNearbyPharmaciesForCoordinatesMock.mockRejectedValueOnce(
      expected
    );

    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
      },
    } as unknown as Request;

    try {
      await pharmacySearchHandler(requestMock, responseMock, configurationMock);
    } catch (error) {
      expect(error).toBe(expected);
    }

    expect(unknownFailureResponseMock).toBeCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      expected
    );
  });

  it('makes expected api request and return response if success when zipcode is in the request', async () => {
    const responseMock = {} as Response;
    const expected = {};
    successResponseMock.mockReturnValueOnce(expected);

    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
      },
    } as unknown as Request;

    const actual = await pharmacySearchHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(searchAndCacheNearbyPharmaciesForCoordinatesMock).toBeCalledWith(
      configurationMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      50
    );
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      mockPharmacies
    );
    expect(actual).toBe(expected);
  });

  it('makes expected api request and return response if success when only latitude and longitude is in the request', async () => {
    const responseMock = {} as Response;
    const requestMock = {
      app: {},
      query: {
        latitude: latitudeMock,
        longitude: longitudeMock,
      },
    } as unknown as Request;

    const expected = {};
    successResponseMock.mockReturnValueOnce(expected);

    const actual = await pharmacySearchHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(searchAndCacheNearbyPharmaciesForCoordinatesMock).toBeCalledWith(
      configurationMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      50
    );
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      mockPharmacies
    );
    expect(actual).toBe(expected);
  });

  it('makes use of start if it is in the request', async () => {
    const responseMock = {} as Response;

    const expected = {};
    successResponseMock.mockReturnValueOnce(expected);
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
        start: 1,
      },
    } as unknown as Request;

    const actual = await pharmacySearchHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(searchAndCacheNearbyPharmaciesForCoordinatesMock).toBeCalledWith(
      configurationMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      51
    );
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      [pharmacyMock2]
    );
    expect(actual).toBe(expected);
  });
  it('makes use of limit if it is in the request', async () => {
    const responseMock = {} as Response;

    const expected = {};
    successResponseMock.mockReturnValueOnce(expected);
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
        start: 1,
        limit: 2,
      },
    } as unknown as Request;

    const actual = await pharmacySearchHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(searchAndCacheNearbyPharmaciesForCoordinatesMock).toBeCalledWith(
      configurationMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      3
    );
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      [pharmacyMock2]
    );
    expect(actual).toBe(expected);
  });
});

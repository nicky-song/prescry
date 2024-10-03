// Copyright 2022 Prescryptive Health, Inc.

import { Response, Request } from 'express';
import {
  SuccessConstants,
  ErrorConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { getGeolocationAutocompleteHandler } from './get-geolocation-autocomplete.handler';
import { IConfiguration } from '../../../configuration';
import { getGeolocationsByQuery } from '../helpers/get-geolocations-by-query';
import { IGetByQueryHelperResponse } from '@phx/common/src/models/api-response/geolocation-response';

jest.mock('../../../utils/request/get-request-query');
jest.mock('../../../utils/response-helper');
jest.mock('../helpers/get-geolocations-by-query');

const getRequestQueryMock = getRequestQuery as jest.Mock;
const getGeolocationsByQueryMock = getGeolocationsByQuery as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const knownResponseMock = KnownFailureResponse as jest.Mock;
const unknownResponseMock = UnknownFailureResponse as jest.Mock;

const mockQuery = '20032';
const mockLocations: IGetByQueryHelperResponse = {
  locations: [
    {
      city: 'Washington',
      state: 'District of Columbia',
      country: 'United States',
      fullAddress: 'Washington, District of Columbia 20032, United States',
      latitude: -77,
      longitude: 38.83,
    },
  ],
};
const requestMock = {
  body: {},
} as unknown as Request;
const configurationMock = {
  mapboxApiUrl: 'mapbox-url',
  mapboxAccessToken: 'mapbox-access-token',
} as IConfiguration;
describe('getGeolocationAutocompleteHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty success location if no params', async () => {
    getRequestQueryMock.mockReturnValueOnce(undefined);
    const responseMock = {} as Response;
    await getGeolocationAutocompleteHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.SUCCESS_OK,
      {
        locations: [],
      }
    );
  });

  it('should return success location', async () => {
    getRequestQueryMock.mockReturnValueOnce(mockQuery);
    const responseMock = {} as Response;
    getGeolocationsByQueryMock.mockReturnValueOnce(mockLocations);
    await getGeolocationAutocompleteHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      mockLocations
    );
  });

  it('should call KnownFailureResponse if mapbox call failure', async () => {
    const responseMock = {} as Response;
    const mockError = { errorCode: 404, message: 'example failure' };
    getRequestQueryMock.mockReturnValueOnce(mockQuery);
    getGeolocationsByQueryMock.mockReturnValueOnce(mockError);
    await getGeolocationAutocompleteHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getGeolocationsByQueryMock).toBeCalledWith(
      mockQuery,
      configurationMock
    );
    expect(knownResponseMock).toBeCalledWith(
      responseMock,
      mockError.errorCode,
      mockError.message
    );
  });

  it('should call UnknownFailureResponse if exception occured', async () => {
    const responseMock = {} as Response;
    getRequestQueryMock.mockReturnValueOnce(mockQuery);
    const errorMock = new Error('unknown error occured');
    getGeolocationsByQueryMock.mockImplementation(() => {
      throw errorMock;
    });
    await getGeolocationAutocompleteHandler(
      requestMock,
      responseMock,
      configurationMock
    );

    expect(unknownResponseMock).toBeCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      errorMock
    );
  });
});

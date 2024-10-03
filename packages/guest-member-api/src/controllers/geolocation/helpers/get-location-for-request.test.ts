// Copyright 2021 Prescryptive Health, Inc.

import { Request } from 'express';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { getLocationForRequest } from './get-location-for-request';
import { ILocationCoordinates } from '@phx/common/src/models/location-coordinates';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { getNearbyGeolocation } from './get-nearby-geolocation';
import { getGeolocationByZip } from './get-geolocation-by-zip';
import { getGeolocationByIp } from './get-geolocation-by-ip';
import { IConfiguration } from '../../../configuration';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';

const mockIp = '8.8.8.8';
const mockLocation: ILocationCoordinates = {
  zipCode: '11205',
  city: 'Brooklyn',
  state: 'NY',
  latitude: 40.694214,
  longitude: -73.96529,
};
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

jest.mock('../../../utils/request/get-request-query');
jest.mock('./get-geolocation-by-zip');
jest.mock('./get-geolocation-by-ip');
jest.mock('./get-nearby-geolocation');

const getRequestQueryMock = getRequestQuery as jest.Mock;
const getNearbyGeolocationMock = getNearbyGeolocation as jest.Mock;
const getGeolocationByZipMock = getGeolocationByZip as jest.Mock;
const getGeolocationByIpMock = getGeolocationByIp as jest.Mock;

describe('getLocationForRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get geolocation by ip if no params', async () => {
    getRequestQueryMock.mockReturnValueOnce(undefined);
    getRequestQueryMock.mockReturnValueOnce(undefined);
    getRequestQueryMock.mockReturnValueOnce(undefined);
    getGeolocationByIpMock.mockReturnValueOnce({ location: mockLocation });

    const actual = await getLocationForRequest(requestMock, configurationMock);
    expect(getNearbyGeolocationMock).not.toBeCalled();
    expect(getGeolocationByZipMock).not.toBeCalled();
    expect(getGeolocationByIpMock).toBeCalledTimes(1);
    expect(getGeolocationByIpMock).toBeCalledWith(mockIp, configurationMock);
    expect(actual).toEqual({ location: mockLocation });
  });
  it('should get geolocation by ip if only latitude is in params', async () => {
    getRequestQueryMock.mockReturnValueOnce(undefined);
    getRequestQueryMock.mockReturnValueOnce('0.41');
    getRequestQueryMock.mockReturnValueOnce(undefined);
    getGeolocationByIpMock.mockReturnValueOnce({ location: mockLocation });

    const actual = await getLocationForRequest(requestMock, configurationMock);
    expect(getNearbyGeolocationMock).not.toBeCalled();
    expect(getGeolocationByZipMock).not.toBeCalled();
    expect(getGeolocationByIpMock).toBeCalledTimes(1);
    expect(getGeolocationByIpMock).toBeCalledWith(mockIp, configurationMock);
    expect(actual).toEqual({ location: mockLocation });
  });
  it('should return failure if no params and ip call failure', async () => {
    getRequestQueryMock.mockReturnValueOnce(undefined);
    getRequestQueryMock.mockReturnValueOnce(undefined);
    getRequestQueryMock.mockReturnValueOnce(undefined);
    const mockError = { errorCode: 404, message: 'example failure' };
    getGeolocationByIpMock.mockReturnValueOnce(mockError);
    const actual = await getLocationForRequest(requestMock, configurationMock);
    expect(getNearbyGeolocationMock).not.toBeCalled();
    expect(getGeolocationByZipMock).not.toBeCalled();
    expect(getGeolocationByIpMock).toBeCalledTimes(1);
    expect(getGeolocationByIpMock).toBeCalledWith(mockIp, configurationMock);
    expect(actual).toEqual({
      errorCode: mockError.errorCode ?? HttpStatusCodes.NOT_FOUND,
      message: mockError.message ?? ErrorConstants.INTERNAL_SERVER_ERROR,
    });
  });
  it('should return known error if no nearest location', async () => {
    const zipCodeMock = '00000';

    getRequestQueryMock.mockReturnValueOnce(zipCodeMock);
    getRequestQueryMock.mockReturnValueOnce(undefined);
    getRequestQueryMock.mockReturnValueOnce(undefined);
    const mockError = {
      errorCode: 400,
      message: ErrorConstants.INVALID_ZIPCODE_SEARCH,
    };
    getGeolocationByIpMock.mockReturnValueOnce(mockError);
    const actual = await getLocationForRequest(requestMock, configurationMock);
    expect(getNearbyGeolocationMock).not.toBeCalled();
    expect(getGeolocationByZipMock).toHaveBeenCalledWith(zipCodeMock);
    expect(getGeolocationByIpMock).not.toBeCalled();
    expect(actual).toEqual({
      errorCode: HttpStatusCodes.NOT_FOUND,
      message: mockError.message,
    });
  });
  it('should get nearby location for passed coordinates', async () => {
    getRequestQueryMock.mockReturnValueOnce(undefined);
    getRequestQueryMock.mockReturnValueOnce('0.41');
    getRequestQueryMock.mockReturnValueOnce('0.52');
    getNearbyGeolocationMock.mockReturnValueOnce(mockLocation);
    const actual = await getLocationForRequest(requestMock, configurationMock);
    expect(getNearbyGeolocationMock).toBeCalledWith(0.41, 0.52);
    expect(getGeolocationByZipMock).not.toBeCalled();
    expect(getGeolocationByIpMock).not.toBeCalled();
    expect(actual).toEqual({ location: mockLocation });
  });

  it('should get location for zip if its passed in request params', async () => {
    getRequestQueryMock.mockReturnValueOnce('98124');
    getRequestQueryMock.mockReturnValueOnce(undefined);
    getRequestQueryMock.mockReturnValueOnce(undefined);

    getGeolocationByZipMock.mockReturnValue(mockLocation);
    const actual = await getLocationForRequest(requestMock, configurationMock);
    expect(getGeolocationByZipMock).toBeCalledWith('98124');
    expect(getNearbyGeolocationMock).not.toBeCalled();
    expect(getGeolocationByIpMock).not.toBeCalled();
    expect(actual).toEqual({ location: mockLocation });
  });

  it('should throw exception if exception occured', async () => {
    getRequestQueryMock.mockReturnValueOnce(undefined);
    getRequestQueryMock.mockReturnValueOnce('0.41');
    getRequestQueryMock.mockReturnValueOnce('0.52');
    const errorMock = new Error('unknown error occured');
    getNearbyGeolocationMock.mockImplementation(() => {
      throw errorMock;
    });

    await expect(() =>
      getLocationForRequest(requestMock, configurationMock)
    ).rejects.toThrow(errorMock);
  });
});

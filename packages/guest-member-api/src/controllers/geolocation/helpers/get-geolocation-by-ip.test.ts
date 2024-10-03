// Copyright 2021 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { ILocationCoordinates } from '@phx/common/src/models/location-coordinates';
import { IConfiguration } from '../../../configuration';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { getGeolocationByIp } from './get-geolocation-by-ip';
import { getGeolocationByZip } from './get-geolocation-by-zip';

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

jest.mock('./get-geolocation-by-zip');
const getGeolocationByZipMock = getGeolocationByZip as jest.Mock;

const configurationMock = {
  ipStackApiUrl: 'ipstack-url',
  ipStackApiKey: 'ipstack-key',
} as IConfiguration;
const mockIp = '8.8.8.8';

describe('getZipByIp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes expected api request and return expected response if success', async () => {
    const latitudeMock = 123.123456789;
    const longitudeMock = 123.123456789;
    const locationMock: ILocationCoordinates = {
      zipCode: 'zip-mock',
      state: 'state-mock',
      city: 'city-mock',
      latitude: latitudeMock,
      longitude: longitudeMock,
    };
    const ipStackLocationMock = {
      zip: 'zip-mock',
      region_code: 'state-mock',
      city: 'city-mock',
      latitude: latitudeMock,
      longitude: longitudeMock,
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => ipStackLocationMock,
      ok: true,
    });
    getGeolocationByZipMock.mockReturnValue(locationMock);

    const actual = await getGeolocationByIp(mockIp, configurationMock);
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'ipstack-url/8.8.8.8?access_key=ipstack-key',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    const expectedLatitudeMock = latitudeMock.toFixed(6);
    const expectedLongitudeMock = longitudeMock.toFixed(6);

    expect(actual).toEqual({
      location: {
        zipCode: 'zip-mock',
        state: 'state-mock',
        city: 'city-mock',
        latitude: Number(expectedLatitudeMock),
        longitude: Number(expectedLongitudeMock),
      },
    });
  });
  it.each([
    [123.123456789, 123.123457],
    [123.12345678, 123.123457],
    [123.1234567, 123.123457],
    [123.123456, 123.123456],
    [123.12345, 123.12345],
    [123.1234, 123.1234],
    [123.123, 123.123],
    [123.12, 123.12],
    [123.1, 123.1],
    [123, 123],
  ])(
    'makes expected api request with %d coordinate and return expected %d coordinate response if success',
    async (inputCoordinate: number, expectedCoordinate: number) => {
      const latitudeMock = inputCoordinate;
      const longitudeMock = inputCoordinate;
      getDataFromUrlMock.mockResolvedValue({
        json: () => ({
          zip: 'zip-mock',
          region_code: 'state-mock',
          city: 'city-mock',
          latitude: latitudeMock,
          longitude: longitudeMock,
        }),
        ok: true,
      });
      getGeolocationByZipMock.mockReturnValue({
        zip: 'zip-mock',
        region_code: 'state-mock',
        city: 'city-mock',
        latitude: latitudeMock,
        longitude: longitudeMock,
      });

      const actual = await getGeolocationByIp(mockIp, configurationMock);
      expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
        'ipstack-url/8.8.8.8?access_key=ipstack-key',
        undefined,
        'GET',
        undefined,
        undefined,
        undefined,
        { pause: 2000, remaining: 3 }
      );

      expect(actual).toEqual({
        location: {
          zipCode: 'zip-mock',
          state: 'state-mock',
          city: 'city-mock',
          latitude: expectedCoordinate,
          longitude: expectedCoordinate,
        },
      });
    }
  );
  it('makes expected api request and return response with no zipcode if zipcode is outside the US', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => ({
        zip: 'zip-mock',
        region_code: 'state-mock',
        city: 'city-mock',
        latitude: 123,
        longitude: 456,
      }),
      ok: true,
    });
    getGeolocationByZipMock.mockReturnValue(undefined);

    const actual = await getGeolocationByIp(mockIp, configurationMock);
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'ipstack-url/8.8.8.8?access_key=ipstack-key',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual({
      errorCode: HttpStatusCodes.NOT_FOUND,
      message:
        'This IP address is not for a valid US zip code zip-mock state-mock city-mock',
    });
  });
  it('returns error if IP Stack api returns error', async () => {
    const mockError = {
      status: 404,
      title: 'error',
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: 404,
    });

    const actual = await getGeolocationByIp(mockIp, configurationMock);
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'ipstack-url/8.8.8.8?access_key=ipstack-key',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual({ errorCode: 404, message: 'error' });
  });
});

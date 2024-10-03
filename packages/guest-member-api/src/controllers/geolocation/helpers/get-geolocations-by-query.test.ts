// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { getGeolocationsByQuery } from './get-geolocations-by-query';

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

const configurationMock = {
  mapboxApiUrl: 'mapbox-url',
  mapboxAccessToken: 'mapbox-access-token',
} as IConfiguration;

describe('getGeolocationsByQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes expected api request and return response if success', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => ({
        type: 'FeatureCollection',
        features: [
          {
            place_name: 'Washington, District of Columbia 20032, United States',
            geometry: {
              type: 'Point',
              coordinates: [-77, 38.83],
            },
            context: [
              {
                id: 'place.2915387490246050',
                wikidata: 'Q61',
                text: 'Washington',
              },
              {
                id: 'region.14064402149979320',
                short_code: 'US-DC',
                wikidata: 'Q3551781',
                text: 'District of Columbia',
              },
              {
                id: 'country.14135384517372290',
                wikidata: 'Q30',
                short_code: 'us',
                text: 'United States',
              },
            ],
          },
        ],
      }),
      ok: true,
    });

    const actual = await getGeolocationsByQuery('20032', configurationMock);
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'mapbox-url/20032.json?country=us&access_token=mapbox-access-token',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual({
      locations: [
        {
          city: 'Washington',
          state: 'District of Columbia',
          country: 'United States',
          fullAddress: 'Washington, District of Columbia 20032, United States',
          longitude: -77,
          latitude: 38.83,
        },
      ],
    });
  });
  it('returns error if Mapbox api returns error', async () => {
    const mockError = {
      status: 404,
      title: 'error',
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: 404,
    });
    const actual = await getGeolocationsByQuery('20032', configurationMock);
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'mapbox-url/20032.json?country=us&access_token=mapbox-access-token',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual({ errorCode: 404, message: 'error' });
  });
  it('returns error if Mapbox api is down', async () => {
    const errorMock = new Error('Mapbox is down');
    getDataFromUrlMock.mockImplementation(() => {
      throw errorMock;
    });
    const actual = await getGeolocationsByQuery('20032', configurationMock);
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'mapbox-url/20032.json?country=us&access_token=mapbox-access-token',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual({ errorCode: 500, message: 'Error in Mapbox API' });
  });
});

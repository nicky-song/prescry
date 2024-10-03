// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';
import {
  IMapBoxResponse,
  IMapBoxFeature,
  IMapBoxFeatureContext,
} from '../../../models/mapbox';
import { IGetByQueryHelperResponse } from '@phx/common/src/models/api-response/geolocation-response';

// Source: https://docs.mapbox.com/help/getting-started/geocoding/#source-data
export const mapboxSourceMap: Record<string, string> = {
  postcode: 'zipCode',
  place: 'city',
  district: 'county',
  region: 'state',
  country: 'country',
};

export async function getGeolocationsByQuery(
  query: string,
  configuration: IConfiguration
): Promise<IGetByQueryHelperResponse> {
  try {
    const apiResponse = await getDataFromUrl(
      buildGetMapboxUrl(
        configuration.mapboxApiUrl,
        configuration.mapboxAccessToken,
        query
      ),
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      defaultRetryPolicy
    );
    if (apiResponse.ok) {
      const { features }: IMapBoxResponse = await apiResponse.json();
      const locations = features.map((feature: IMapBoxFeature) => {
        const location: Record<string, string | number> = {};
        if (feature && feature.context) {
          feature.context.forEach((context: IMapBoxFeatureContext) => {
            const sourceData = context.id.split('.')[0];
            const key: string = mapboxSourceMap[sourceData];
            if (sourceData && key && context.text) {
              location[key] = context.text;
            }
          });
        }

        if (feature.place_name) {
          location.fullAddress = feature.place_name;
        }
        if (feature.geometry?.coordinates) {
          location.longitude = feature.geometry.coordinates[0];
          location.latitude = feature.geometry.coordinates[1];
        }

        return location;
      });

      return { locations };
    }

    const { status: errorCode, title: message } = await apiResponse.json();

    return { errorCode, message };
  } catch {
    return {
      errorCode: 500,
      message: 'Error in Mapbox API',
    };
  }
}

export function buildGetMapboxUrl(
  mapboxApiUrl: string,
  mapboxAccessToken: string,
  query: string
): string {
  return `${mapboxApiUrl}/${query}.json?country=us&access_token=${mapboxAccessToken}`;
}

// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { translateCoordinateHelper } from '@phx/common/src/utils/translate-coordinate.helper';
import { getGeolocationByZip } from './get-geolocation-by-zip';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { ILocationResponse } from '@phx/common/src/models/api-response/geolocation-response';

export async function getGeolocationByIp(
  ip: string,
  configuration: IConfiguration
): Promise<ILocationResponse> {
  const apiResponse = await getDataFromUrl(
    buildGetZipUrl(
      configuration.ipStackApiUrl,
      configuration.ipStackApiKey,
      ip
    ),
    undefined,
    'GET',
    undefined,
    undefined,
    undefined,
    defaultRetryPolicy
  );
  if (apiResponse.ok) {
    const {
      zip: zipCode,
      region_code: state,
      city,
      latitude,
      longitude,
    } = await apiResponse.json();
    const zipCodeLocation = getGeolocationByZip(zipCode);
    if (zipCodeLocation) {
      return {
        location: {
          zipCode,
          state,
          city,
          latitude: translateCoordinateHelper(latitude),
          longitude: translateCoordinateHelper(longitude),
        },
      };
    }
    return {
      errorCode: HttpStatusCodes.NOT_FOUND,
      message: StringFormatter.format(
        ErrorConstants.INVALID_US_LOCATION,
        new Map<string, string>([
          ['zipCode', zipCode],
          ['state', state],
          ['city', city],
        ])
      ),
    };
  }

  const { status: errorCode, title: message } = await apiResponse.json();
  return { errorCode, message };
}

export function buildGetZipUrl(
  ipStackApiUrl: string,
  ipStackApiKey: string,
  ip: string
) {
  return `${ipStackApiUrl}/${ip}?access_key=${ipStackApiKey}`;
}

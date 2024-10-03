// Copyright 2023 Prescryptive Health, Inc.

import { getDataFromUrlWithAuth0 } from '../../utilities/api/get-data-from-url-with-auth0';
import { TenantType, TenantHeaders } from '../../utilities/tenant-headers';
import {
  GEARS_API_SUBSCRIPTION_KEY,
  PLATFORM_GEARS_API_URL,
} from '../../utilities/settings';
import {type Coverage, type Bundle } from 'fhir/r4';
import { Auth0IdentityConstants } from '../../utilities/api/auth0-identity-constants';

const coverageUrl = `${PLATFORM_GEARS_API_URL}/eligibility/coverage`;
const coverageSearchUrl = `${coverageUrl}/search`;

export abstract class CoverageService {
  public static async create (
    coverage: Coverage,
    tenant?: TenantType
  ): Promise<Coverage>  {
    let headers = {
      [Auth0IdentityConstants.PLATFORM_API_HEADER_KEY]:
        GEARS_API_SUBSCRIPTION_KEY,
      Accept: 'application/fhir+json',
      'Content-Type': 'application/fhir+json',
    };
    if (tenant) {
      headers = { ...headers, ...TenantHeaders[tenant] };
    }
    const apiResponse = await getDataFromUrlWithAuth0(
      coverageUrl,
      coverage,
      'POST',
      headers,
      Auth0IdentityConstants.DEFAULT_API_TIMEOUT
    );
    if (apiResponse.status !== 201) {
      throw new Error(
        `Unexpected coverage creation status ${apiResponse.status} and text ${
          apiResponse.statusText
        } and body ${await apiResponse.text()}, operation id ${apiResponse.headers.get('operation-id')}`
      );
    }
    return apiResponse.json();
  }

  public static async search (query: string) : Promise<Bundle<Coverage>> {
    const apiResponse = await getDataFromUrlWithAuth0(
      coverageSearchUrl,
      { query },
      'POST',
      {
        [Auth0IdentityConstants.PLATFORM_API_HEADER_KEY]:
          GEARS_API_SUBSCRIPTION_KEY,
        ['Content-Type']: 'application/fhir+json',
      }
    );
    if (apiResponse.status !== 200) {
      throw new Error(
        `Unexpected coverage search status ${apiResponse.status} and text ${apiResponse.statusText} and operation id ${apiResponse.headers.get('operation-id')} body ${await apiResponse.text()}`
      );
    }
    return apiResponse.json();
  }
}

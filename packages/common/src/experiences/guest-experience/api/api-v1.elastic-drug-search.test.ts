// Copyright 2022 Prescryptive Health, Inc.

import {
  IDrugSearchResult,
  IDrugVariant,
} from '../../../models/drug-search-response';
import { ErrorConstants } from '../../../theming/constants';
import { buildUrl, call, IApiConfig } from '../../../utils/api.helper';
import { GuestExperienceConfig } from '../guest-experience-config';
import { elasticDrugDataMock } from '../__mocks__/drug-search-response.mock';
import {
  elasticDrugSearch,
  IResponseDrug,
  mapVariants,
} from './api-v1.elastic-drug-search';

jest.mock('../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../utils/api.helper') as object),
  call: jest.fn(),
}));

const maxResultsMock = 8;

const callMock = call as jest.Mock;

const configMock: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    drugSearch:
      GuestExperienceConfig.apis.domainDataApi.paths.elasticDrugSearch,
  },
};
const subscriptionKey = 'mock-key';

describe('drugSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls API with correct URL - filtered by rxSubGroup', async () => {
    const rxSubGroupMock = 'rx-sub-group';
    const filterMock = 'a';
    const expectedUrl = buildUrl(configMock, 'elasticDrugSearch', {
      ':filter': encodeURIComponent(filterMock),
      ':maxResults': maxResultsMock.toString(),
      ':rxSubGroup': rxSubGroupMock,
    });

    callMock.mockImplementation(() => ({
      json: () => [],
      ok: true,
    }));

    await elasticDrugSearch(
      configMock,
      subscriptionKey,
      filterMock,
      maxResultsMock,
      rxSubGroupMock
    );
    expect(callMock).toHaveBeenCalledWith(
      expectedUrl,
      undefined,
      'GET',
      { ['Ocp-Apim-Subscription-Key']: subscriptionKey },
      undefined
    );
  });

  it('calls API with correct URL - not filtered by rxSubGroup', async () => {
    const rxSubGroupMock = 'rx-sub-group';
    const filterMock = 'a';
    const expectedUrl = buildUrl(configMock, 'elasticDrugSearchAll', {
      ':filter': encodeURIComponent(filterMock),
      ':maxResults': maxResultsMock.toString(),
      ':rxSubGroup': rxSubGroupMock,
    });

    callMock.mockImplementation(() => ({
      json: () => [],
      ok: true,
    }));

    await elasticDrugSearch(
      configMock,
      subscriptionKey,
      filterMock,
      maxResultsMock,
      rxSubGroupMock,
      undefined,
      true
    );
    expect(callMock).toHaveBeenCalledWith(
      expectedUrl,
      undefined,
      'GET',
      { ['Ocp-Apim-Subscription-Key']: subscriptionKey },
      undefined
    );
  });

  it('calls API with correct URL when search text has special characters', async () => {
    const filterWithSpecialChars = 'lip#$';
    const expectedUrl = buildUrl(configMock, 'elasticDrugSearch', {
      ':filter': encodeURIComponent(filterWithSpecialChars),
      ':maxResults': maxResultsMock.toString(),
    });

    callMock.mockImplementation(() => ({
      json: () => [],
      ok: true,
    }));

    await elasticDrugSearch(
      configMock,
      subscriptionKey,
      filterWithSpecialChars,
      maxResultsMock
    );
    expect(callMock).toHaveBeenCalledWith(
      expectedUrl,
      undefined,
      'GET',
      { ['Ocp-Apim-Subscription-Key']: subscriptionKey },
      undefined
    );
  });

  it('returns empty set if empty filter specified', async () => {
    const expectedResult: IDrugSearchResult[] = [];

    const result: IDrugSearchResult[] = await elasticDrugSearch(
      configMock,
      subscriptionKey,
      '',
      1
    );
    expect(result).toEqual(expectedResult);
  });

  it('handles 404 response', async () => {
    callMock.mockImplementation(() => ({
      json: () => ({}),
      ok: false,
      status: 404,
    }));
    const filterMock = 'a';

    try {
      await elasticDrugSearch(
        configMock,
        subscriptionKey,
        filterMock,
        maxResultsMock
      );
      fail('Expected exception but none thrown!');
    } catch (ex) {
      const expectedUrl = buildUrl(configMock, 'elasticDrugSearch', {
        ':filter': encodeURIComponent(filterMock),
        ':maxResults': maxResultsMock.toString(),
      });
      expect((ex as Error).message).toEqual(`URL '${expectedUrl}' not found`);
    }
  });

  it('handles other failure response', async () => {
    const statusText = 'Grapple grommets out of alignment';
    callMock.mockImplementation(() => ({
      json: () => ({}),
      ok: false,
      status: 500,
      statusText,
    }));

    try {
      await elasticDrugSearch(configMock, subscriptionKey, 'a', maxResultsMock);
      fail('Expected exception but none thrown!');
    } catch (ex) {
      const expectedMessage = ErrorConstants.errorDrugSearch(statusText);
      expect((ex as Error).message).toEqual(expectedMessage);
    }
  });

  it('returns top 2 results from expected response on success', async () => {
    const maxedElasticDrugDataMock = elasticDrugDataMock.slice(0, 2);
    callMock.mockImplementation(() => ({
      json: () => maxedElasticDrugDataMock,
      ok: true,
    }));
    const result: IDrugSearchResult[] = await elasticDrugSearch(
      configMock,
      subscriptionKey,
      'a',
      2
    );

    const expectedElasticDrugSearchResult: IDrugSearchResult[] =
      maxedElasticDrugDataMock.map((drug: IResponseDrug) => {
        const drugVariants: IDrugVariant[] = mapVariants(
          drug.variants,
          drug.representativeNdc,
          drug.displayName
        );
        const drugSearchResult: IDrugSearchResult = {
          name: drug.displayName,
          forms: drug.drugForms,
          drugVariants,
        };
        return drugSearchResult;
      });

    expect(result).toEqual(expectedElasticDrugSearchResult);
  });

  it('when mapped drug form is not found in drugFound array push the mapped drug form to drugFound form array', async () => {
    callMock.mockImplementation(() => ({
      json: () => elasticDrugDataMock,
      ok: true,
    }));
    const result: IDrugSearchResult[] = await elasticDrugSearch(
      configMock,
      subscriptionKey,
      'a',
      maxResultsMock
    );
    expect(result[1].forms).toEqual(['drug-form-mock-2']);

    const expectedElasticDrugSearchResult: IDrugSearchResult[] =
      elasticDrugDataMock.map((drug: IResponseDrug) => {
        const drugVariants: IDrugVariant[] = mapVariants(
          drug.variants,
          drug.representativeNdc,
          drug.displayName
        );
        const drugSearchResult: IDrugSearchResult = {
          name: drug.displayName,
          forms: drug.drugForms,
          drugVariants,
        };
        return drugSearchResult;
      });

    expect(result).toEqual(expectedElasticDrugSearchResult);
  });

  it('returns empty array if response json is undefined', async () => {
    callMock.mockImplementation(() => ({
      json: () => undefined,
      ok: true,
    }));
    const result: IDrugSearchResult[] = await elasticDrugSearch(
      configMock,
      subscriptionKey,
      'a',
      5
    );
    expect(result).toEqual([]);
  });
});

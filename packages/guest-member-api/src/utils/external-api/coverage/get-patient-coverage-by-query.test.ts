// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { IFhir } from '../../../models/fhir/fhir';
import { ICoverage } from '../../../models/fhir/patient-coverage/coverage';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { getPatientCoverageByQuery } from './get-patient-coverage-by-query';

jest.mock('../../get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

describe('getPatientCoverageByQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws endpoint error if api returns error', async () => {
    const mockError = 'error';
    const statusMock = 400;
    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: statusMock,
    });

    try {
      await getPatientCoverageByQuery(configurationMock, 'member-id');
      fail('Exception expected but none thrown!');
    } catch (ex) {
      const expectedError = new EndpointError(statusMock, mockError);
      expect(ex).toEqual(expectedError);
    }
  });

  it('makes expected api request and returns response if success', async () => {
    const coverageResponseMock: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      status: 'active',
    };

    const fhirMock: Partial<IFhir> = {
      entry: [
        {
          resource: coverageResponseMock,
        },
      ],
    };

    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: () => fhirMock,
      ok: true,
    });

    const queryMock = 'identifier=member-id';
    const actual = await getPatientCoverageByQuery(
      configurationMock,
      queryMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlWithAuth0Mock,
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}/eligibility/coverage/search`,
      {
        query: queryMock,
      },
      'POST',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
        'Content-Type': 'application/fhir+json',
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      { pause: 2000, remaining: 3 }
    );

    const expectedResult: Partial<ICoverage>[] = [coverageResponseMock];

    expect(actual).toEqual(expectedResult);
  });
});

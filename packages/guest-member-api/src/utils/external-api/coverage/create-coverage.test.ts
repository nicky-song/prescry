// Copyright 2022 Prescryptive Health, Inc.

import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { Response } from 'node-fetch';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { ICoverageErrorResponse } from '../../../models/fhir/patient-coverage/coverage';
import { gearsCoveragePath } from '../../../configuration';
import { createCoverage } from './create-coverage';
import { cashCoveragePrimaryMock } from '../../../mock-data/fhir-coverage.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('../../get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

describe('createCoverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes create coverage endpoint request', async () => {
    const responseMock: Partial<Response> = {
      ok: true,
    };
    getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

    await createCoverage(configurationMock, cashCoveragePrimaryMock);

    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlWithAuth0Mock,
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsCoveragePath}`,
      cashCoveragePrimaryMock,
      'POST',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
        'Content-Type': 'application/fhir+json',
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      undefined
    );
  });

  it('throws exception on failure - case if get error message', async () => {
    const errorMessage = 'error-message';
    const errorResponseMock: ICoverageErrorResponse = {
      error: errorMessage,
    };
    const statusMock = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const responseMock: Partial<Response> = {
      ok: false,
      status: statusMock,
      json: jest.fn().mockResolvedValue(errorResponseMock),
    };
    getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

    try {
      await createCoverage(configurationMock, cashCoveragePrimaryMock);
      fail('Expected exception but none thrown');
    } catch (error) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(error).toEqual(expectedError);
    }
  });

  it('throws exception on failure - case if get title message', async () => {
    const errorMessage = 'error-message';
    const errorResponseMock: ICoverageErrorResponse = {
      title: errorMessage,
    };
    const statusMock = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const responseMock: Partial<Response> = {
      ok: false,
      status: statusMock,
      json: jest.fn().mockResolvedValue(errorResponseMock),
    };
    getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

    try {
      await createCoverage(configurationMock, cashCoveragePrimaryMock);
      fail('Expected exception but none thrown');
    } catch (error) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(error).toEqual(expectedError);
    }
  });
});

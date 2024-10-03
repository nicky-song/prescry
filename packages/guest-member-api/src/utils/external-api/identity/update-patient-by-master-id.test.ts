// Copyright 2022 Prescryptive Health, Inc.

import { gearsPatientPath } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { mockPatient } from '../../../mock-data/fhir-patient.mock';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { updatePatientByMasterId } from './update-patient-by-master-id';

jest.mock('../../get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

describe('updatePatientByMasterId', () => {
  const masterIdMock = 'master-id';

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
      await updatePatientByMasterId(
        masterIdMock,
        mockPatient,
        configurationMock
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      const expectedError = new EndpointError(statusMock, mockError);
      expect(ex).toEqual(expectedError);
    }
  });

  it('makes expected api request and returns response if success', async () => {
    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      ok: true,
    });

    const actual = await updatePatientByMasterId(
      masterIdMock,
      mockPatient,
      configurationMock
    );

    expect(getDataFromUrlWithAuth0Mock).toHaveBeenLastCalledWith(
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsPatientPath}/${masterIdMock}`,
      mockPatient,
      'PUT',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      { pause: 2000, remaining: 3 }
    );

    expect(actual).toEqual(true);
  });
});

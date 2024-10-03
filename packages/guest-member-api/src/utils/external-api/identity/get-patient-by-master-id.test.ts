// Copyright 2022 Prescryptive Health, Inc.

import { gearsPatientPath } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { IPatient } from '../../../models/fhir/patient/patient';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { getPatientByMasterId } from './get-patient-by-master-id';

jest.mock('../../get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

describe('getPatientByMasterId', () => {
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
      await getPatientByMasterId('master-id', configurationMock);
      fail('Exception expected but none thrown!');
    } catch (ex) {
      const expectedError = new EndpointError(statusMock, mockError);
      expect(ex).toEqual(expectedError);
    }
  });

  it('makes expected api request and returns response if success', async () => {
    const patientResponseMock: IPatient = {
      name: [{ family: 'family-mock', given: ['given-mock'] }],
      birthDate: 'birthdate-mock',
    };

    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: () => patientResponseMock,
      ok: true,
    });

    const masterIdMock = 'master-id';
    const actual = await getPatientByMasterId(masterIdMock, configurationMock);

    expect(getDataFromUrlWithAuth0Mock).toHaveBeenLastCalledWith(
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsPatientPath}/${masterIdMock}?allTenants=true`,
      undefined,
      'GET',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      defaultRetryPolicy
    );

    expect(actual).toEqual(patientResponseMock);
  });
});

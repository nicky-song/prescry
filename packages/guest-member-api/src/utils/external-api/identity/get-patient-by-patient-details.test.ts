// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { gearsPatientPath } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { ErrorConstants } from '../../../constants/response-messages';
import { EndpointError } from '../../../errors/endpoint.error';
import { BadRequestError } from '../../../errors/request-errors/bad.request-error';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { IFhir } from '../../../models/fhir/fhir';
import { IPatient } from '../../../models/fhir/patient/patient';
import { IPatientErrorResponse } from '../../../models/identity/patient/patient-error-response';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import {
  getPatientByPatientDetails,
  IPatientDetails,
} from './get-patient-by-patient-details';

jest.mock('../../get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

describe('getPatientByPatientDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws endpoint error if request params are not passed correctly', async () => {
    const patientDetailsMock: IPatientDetails = {
      firstName: 'given-mock',
      familyName: 'family-mock',
    };

    try {
      await getPatientByPatientDetails(patientDetailsMock, configurationMock);
      expect.assertions(1);
      expect(getDataFromUrlWithAuth0Mock).not.toBeCalled();
    } catch (ex) {
      const expectedError = new BadRequestError(
        ErrorConstants.BAD_REQUEST_PARAMS
      );
      expect(ex).toEqual(expectedError);
    }
  });

  it.each([
    [HttpStatusCodes.BAD_REQUEST, 'error-mock'],
    [HttpStatusCodes.INTERNAL_SERVER_ERROR, 'internal-server-error'],
  ])(
    'throws endpoint error if api returns error (http status code %p)',
    async (httpStatusCodeMock: number, expectedErrorMessageMock: string) => {
      const errorResponseMock: IPatientErrorResponse = {
        error: 'error-mock',
      };

      const statusTextMock = 'internal-server-error';

      getDataFromUrlWithAuth0Mock.mockResolvedValue({
        json: () => errorResponseMock,
        ok: false,
        status: httpStatusCodeMock,
        statusText: statusTextMock,
      });

      const patientDetailsMock: IPatientDetails = {
        firstName: 'given-mock',
        familyName: 'family-mock',
        birthDate: 'birth-date-mock',
      };

      try {
        await getPatientByPatientDetails(patientDetailsMock, configurationMock);
        expect.assertions(1);
      } catch (ex) {
        const expectedError = new EndpointError(
          httpStatusCodeMock,
          expectedErrorMessageMock
        );
        expect(ex).toEqual(expectedError);
      }
    }
  );

  it('makes expected api request and returns response if success', async () => {
    const patientMock: IPatient = {
      resourceType: 'Patient',
      id: 'master-id-mock',
      name: [{ family: 'family-mock', given: ['given-mock'] }],
      birthDate: 'birth-date-mock',
    };

    const patientResponseMock: IPatient[] = [patientMock];

    const fhirMock: Partial<IFhir> = {
      entry: [
        {
          resource: patientMock,
        },
      ],
    };

    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: () => fhirMock,
      ok: true,
    });

    const patientDetailsMock: IPatientDetails = {
      firstName: 'given-mock',
      familyName: 'family-mock',
      birthDate: 'birth-date-mock',
    };

    const actual = await getPatientByPatientDetails(
      patientDetailsMock,
      configurationMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlWithAuth0Mock,
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsPatientPath}/query?allTenants=true`,
      patientDetailsMock,
      'POST',
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

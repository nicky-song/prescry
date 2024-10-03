// Copyright 2022 Prescryptive Health, Inc.

import { gearsAccountsPath } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { IPatientAccountErrorResponse } from '../../../models/platform/patient-account/patient-account';
import { configurationMock } from '../../../mock-data/configuration.mock';
import {
  patientAccountPrimaryMock,
  patientAccountPrimaryWithPatientMock,
} from '../../../mock-data/patient-account.mock';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { getPatientAccountsByReference } from './get-patient-accounts-by-reference';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';

jest.mock('../../get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

describe('getPatientAccountsByReference', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws endpoint error if api returns error', async () => {
    const errorMessage = 'error-message';
    const errorResponseMock: IPatientAccountErrorResponse = {
      error: errorMessage,
    };
    const statusMock = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const responseMock: Partial<Response> = {
      ok: false,
      status: statusMock,
      json: jest.fn().mockResolvedValue(errorResponseMock),
    };
    getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

    const phoneHash = 'phone-hash';
    try {
      await getPatientAccountsByReference(
        configurationMock,
        phoneHash,
        true,
        false
      );
      fail('Expected exception but none thrown!');
    } catch (ex) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(ex).toEqual(expectedError);
    }
  });

  it('throws endpoint error if api returns title', async () => {
    const errorMessage = 'error-message';
    const errorResponseMock: IPatientAccountErrorResponse = {
      title: errorMessage,
    };
    const statusMock = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const responseMock: Partial<Response> = {
      ok: false,
      status: statusMock,
      json: jest.fn().mockResolvedValue(errorResponseMock),
    };
    getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

    const phoneHash = 'phone-hash';
    try {
      await getPatientAccountsByReference(
        configurationMock,
        phoneHash,
        true,
        false
      );
      fail('Expected exception but none thrown!');
    } catch (ex) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(ex).toEqual(expectedError);
    }
  });

  it('makes expected api request and returns patientAccount with patient if success and includePatientDetails is passed as true', async () => {
    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: () => [patientAccountPrimaryWithPatientMock],
      ok: true,
    });

    const phoneHash = 'phone-hash';
    const includePatientDetails = true;

    const actual = await getPatientAccountsByReference(
      configurationMock,
      phoneHash,
      includePatientDetails,
      true
    );

    expect(getDataFromUrlWithAuth0Mock).toHaveBeenLastCalledWith(
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsAccountsPath}/?sourceReference=${phoneHash}&expand=patient`,
      undefined,
      'GET',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      { pause: 2000, remaining: 3 }
    );

    const expected = [patientAccountPrimaryWithPatientMock];
    expect(actual).toEqual(expected);
  });

  it('makes expected api request and returns only patientAccount if success and includePatientDetails is passed as false', async () => {
    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: () => [patientAccountPrimaryMock],
      ok: true,
    });

    const phoneHash = 'phone-hash';
    const includePatientDetails = false;

    const actual = await getPatientAccountsByReference(
      configurationMock,
      phoneHash,
      includePatientDetails,
      true
    );

    expect(getDataFromUrlWithAuth0Mock).toHaveBeenLastCalledWith(
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsAccountsPath}/?sourceReference=${phoneHash}`,
      undefined,
      'GET',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      { pause: 2000, remaining: 3 }
    );

    const expected = [patientAccountPrimaryMock];
    expect(actual).toEqual(expected);
  });
});

// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { gearsAccountsPath } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { IPatientAccountErrorResponse } from '../../../models/platform/patient-account/patient-account';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { patientAccountPrimaryWithPatientMock } from '../../../mock-data/patient-account.mock';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { getPatientAccountByAccountId } from './get-patient-account-by-account-id';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';

jest.mock('../../get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

describe('getPatientAccountByAccountId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws exception on failure - case if get error message', async () => {
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

    try {
      await getPatientAccountByAccountId(
        configurationMock,
        'account-id',
        false,
        false
      );
      fail('Expected exception but none thrown!');
    } catch (ex) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(ex).toEqual(expectedError);
    }
  });

  it('throws exception on failure - case if get message', async () => {
    const errorMessage = 'error-message';
    const errorResponseMock: IPatientAccountErrorResponse = {
      message: errorMessage,
    };
    const statusMock = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const responseMock: Partial<Response> = {
      ok: false,
      status: statusMock,
      json: jest.fn().mockResolvedValue(errorResponseMock),
    };
    getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

    try {
      await getPatientAccountByAccountId(
        configurationMock,
        'account-id',
        false,
        false
      );
      fail('Expected exception but none thrown!');
    } catch (ex) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(ex).toEqual(expectedError);
    }
  });

  it('makes expected api request and returns undefined if response status is "NOT FOUND"', async () => {
    const mockError = 'resource not found';
    const statusMock = 404;
    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: statusMock,
    });

    const accountIdMock = 'account-id';
    const includePatientDetails = true;

    const actual = await getPatientAccountByAccountId(
      configurationMock,
      accountIdMock,
      includePatientDetails,
      false
    );
    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlWithAuth0Mock,
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsAccountsPath}/${accountIdMock}?expand=patient`,
      undefined,
      'GET',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      undefined
    );

    expect(actual).toEqual(undefined);
  });

  it('makes expected api request and returns patientAccount if response.ok is true', async () => {
    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: () => patientAccountPrimaryWithPatientMock,
      ok: true,
    });

    const accountIdMock = 'account-id';
    const includePatientDetails = true;

    const actual = await getPatientAccountByAccountId(
      configurationMock,
      accountIdMock,
      includePatientDetails,
      true
    );
    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlWithAuth0Mock,
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsAccountsPath}/${accountIdMock}?expand=patient`,
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
    expect(actual).toEqual(patientAccountPrimaryWithPatientMock);
  });
});

// Copyright 2022 Prescryptive Health, Inc.

import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { Response } from 'node-fetch';
import { createPatientAccount } from './create-patient-account';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { ApiConstants } from '../../../constants/api-constants';
import {
  IPatientAccount,
  IPatientAccountErrorResponse,
} from '../../../models/platform/patient-account/patient-account';
import { EndpointError } from '../../../errors/endpoint.error';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { patientAccountPrimaryMock } from '../../../mock-data/patient-account.mock';
import { gearsAccountsPath } from '../../../configuration';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('../../get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

describe('createPatientAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes account create endpoint request', async () => {
    const patientAccountResponseMock: IPatientAccount = {
      ...patientAccountPrimaryMock,
      accountId: 'response-account-id',
    };
    const responseMock: Partial<Response> = {
      ok: true,
      json: jest.fn().mockResolvedValue(patientAccountResponseMock),
    };
    getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

    const result = await createPatientAccount(
      configurationMock,
      patientAccountPrimaryMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlWithAuth0Mock,
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsAccountsPath}`,
      patientAccountPrimaryMock,
      'POST',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      undefined
    );

    expect(result).toEqual(patientAccountResponseMock);
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
      await createPatientAccount(configurationMock, patientAccountPrimaryMock);
      fail('Expected exception but none thrown');
    } catch (error) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(error).toEqual(expectedError);
    }
  });

  it('throws exception on failure - case if get title message', async () => {
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

    try {
      await createPatientAccount(configurationMock, patientAccountPrimaryMock);
      fail('Expected exception but none thrown');
    } catch (error) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(error).toEqual(expectedError);
    }
  });
});

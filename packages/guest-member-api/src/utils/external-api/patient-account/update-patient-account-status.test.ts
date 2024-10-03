// Copyright 2022 Prescryptive Health, Inc.

import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { Response } from 'node-fetch';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { gearsAccountsPath } from '../../../configuration';
import {
  IPatientAccountStatus,
  IPatientAccountStatusErrorResponse,
} from '../../../models/platform/patient-account/properties/patient-account-status';
import { updatePatientAccountStatus } from './update-patient-account-status';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('../../get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

describe('updatePatientAccountStatus', () => {
  const accountStatusMock: IPatientAccountStatus = {
    state: 'VERIFIED',
    lastStateUpdate: '2022-10-03',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes account status update endpoint request', async () => {
    const accountIdMock = 'account-id';
    const responseMock: Partial<Response> = {
      ok: true,
      json: jest.fn().mockResolvedValue(undefined),
    };
    getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

    await updatePatientAccountStatus(
      configurationMock,
      accountIdMock,
      accountStatusMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlWithAuth0Mock,
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsAccountsPath}/${accountIdMock}/status`,
      accountStatusMock,
      'PATCH',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      undefined
    );
  });

  it('throws exception on failure - if get error message', async () => {
    const errorMessage = 'error-message';
    const errorMessageMock: IPatientAccountStatusErrorResponse = {
      error: errorMessage,
    };
    const statusMock = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const responseMock: Partial<Response> = {
      ok: false,
      status: statusMock,
      json: jest.fn().mockResolvedValue(errorMessageMock),
    };
    getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

    try {
      await updatePatientAccountStatus(
        configurationMock,
        'account-id',
        accountStatusMock
      );
      fail('Expected exception but none thrown');
    } catch (error) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(error).toEqual(expectedError);
    }
  });

  it('throws exception on failure - if get title message', async () => {
    const errorMessage = 'error-message';
    const errorMessageMock: IPatientAccountStatusErrorResponse = {
      title: errorMessage,
    };
    const statusMock = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const responseMock: Partial<Response> = {
      ok: false,
      status: statusMock,
      json: jest.fn().mockResolvedValue(errorMessageMock),
    };
    getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

    try {
      await updatePatientAccountStatus(
        configurationMock,
        'account-id',
        accountStatusMock
      );
      fail('Expected exception but none thrown');
    } catch (error) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(error).toEqual(expectedError);
    }
  });
});

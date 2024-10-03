// Copyright 2022 Prescryptive Health, Inc.

import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { Response } from 'node-fetch';
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
import { updatePatientAccount } from './update-patient-account';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { assertHasAccountId } from '../../../assertions/assert-has-account-id';

jest.mock('../../get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

jest.mock('../../../assertions/assert-has-account-id');
const assertHasAccountIdMock = assertHasAccountId as jest.Mock;

describe('updatePatientAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes account update endpoint request', async () => {
    const accountIdMock = 'account-id';
    const patientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryMock,
      accountId: accountIdMock,
    };
    const responseMock: Partial<Response> = {
      ok: true,
      json: jest.fn().mockResolvedValue(undefined),
    };
    getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

    await updatePatientAccount(configurationMock, patientAccountMock);

    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlWithAuth0Mock,
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsAccountsPath}/${accountIdMock}`,
      patientAccountMock,
      'PUT',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      defaultRetryPolicy
    );
  });

  it('asserts account id exists', async () => {
    const accountIdMock = 'account-id';
    const patientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryMock,
      accountId: accountIdMock,
    };
    const responseMock: Partial<Response> = {
      ok: true,
      json: jest.fn().mockResolvedValue(undefined),
    };
    getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

    await updatePatientAccount(configurationMock, patientAccountMock);

    expectToHaveBeenCalledOnceOnlyWith(assertHasAccountIdMock, accountIdMock);
  });

  it('throws exception on endpoint failure - if get error message', async () => {
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
      await updatePatientAccount(configurationMock, patientAccountPrimaryMock);
      fail('Expected exception but none thrown');
    } catch (error) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(error).toEqual(expectedError);
    }
  });
  it('throws exception on endpoint failure - if get title message', async () => {
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
      await updatePatientAccount(configurationMock, patientAccountPrimaryMock);
      fail('Expected exception but none thrown');
    } catch (error) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(error).toEqual(expectedError);
    }
  });
});

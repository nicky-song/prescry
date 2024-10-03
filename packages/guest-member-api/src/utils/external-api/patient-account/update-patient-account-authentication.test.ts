// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { assertHasAccountId } from '../../../assertions/assert-has-account-id';
import { gearsAccountsPath } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { configurationMock } from '../../../mock-data/configuration.mock';
import {
  IPatientAccount,
  IPatientAccountErrorResponse,
} from '../../../models/platform/patient-account/patient-account';
import { IPatientAccountAuthentication } from '../../../models/platform/patient-account/properties/patient-account-authentication';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { updatePatientAccountAuthentication } from './update-patient-account-authentication';

jest.mock('../../get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

jest.mock('../../../assertions/assert-has-account-id');
const assertHasAccountIdMock = assertHasAccountId as jest.Mock;

describe('updatePatientAccountAuthentication', () => {
  const authenticationMock: IPatientAccountAuthentication = {
    metadata: {
      PIN: [
        {
          key: 'account-key',
          value: 'pin-hash',
        },
      ],
    },
  };

  const accountIdMock = 'account-id-mock';
  const patientAccountMock = {
    accountId: accountIdMock,
    authentication: authenticationMock,
  } as IPatientAccount;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('asserts patient account id exists', async () => {
    const accountIdMock = 'account-id';
    const patientAccountWithoutIdMock: Partial<IPatientAccount> = {
      ...patientAccountMock,
      accountId: accountIdMock,
    };

    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: jest.fn(),
      ok: true,
    });

    await updatePatientAccountAuthentication(
      configurationMock,
      authenticationMock,
      patientAccountWithoutIdMock as IPatientAccount
    );

    expectToHaveBeenCalledOnceOnlyWith(assertHasAccountIdMock, accountIdMock);
  });

  it('throws endpoint error if api returns error message', async () => {
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
      await updatePatientAccountAuthentication(
        configurationMock,
        authenticationMock,
        patientAccountMock
      );
      fail('Expected exception but none thrown');
    } catch (error) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(error).toEqual(expectedError);
    }
  });

  it('throws endpoint error if api returns error message', async () => {
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
      await updatePatientAccountAuthentication(
        configurationMock,
        authenticationMock,
        patientAccountMock
      );
      fail('Expected exception but none thrown');
    } catch (error) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(error).toEqual(expectedError);
    }
  });

  it('makes expected api request and returns patientAccount with patient if success', async () => {
    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: () => patientAccountMock,
      ok: true,
    });

    const actual = await updatePatientAccountAuthentication(
      configurationMock,
      authenticationMock,
      patientAccountMock
    );

    expect(getDataFromUrlWithAuth0Mock).toHaveBeenLastCalledWith(
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsAccountsPath}/${accountIdMock}/authentication`,
      authenticationMock,
      'PATCH',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      defaultRetryPolicy
    );

    expect(actual).toEqual(patientAccountMock);
  });
});

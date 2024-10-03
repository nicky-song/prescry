// Copyright 2023 Prescryptive Health, Inc.

import { Response } from 'node-fetch';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { getDataFromUrlWithAuth0Mock } from '../../../utils/get-data-from-url-with-auth0.mock';
import { validateAndAddConsent } from './validate-and-add-consent';
import { IAddConsent } from '@phx/common/src/models/air/add-consent.response';
import { gearsValidateAndAddConsentPath } from '../../../configuration';
import { IValidateIdentityRequest } from '@phx/common/src/models/air/validate-identity.request';

jest.mock('../../../utils/get-data-from-url-with-auth0.mock');
const getDataFromUrlWithAuth0MockMock =
  getDataFromUrlWithAuth0Mock as jest.Mock;

describe('validateAndAddConsent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('validates and add consent for dependent rx', async () => {
    const smartContractAddressMock = 'smart-contract-address-mock';
    const addConsentRequestMock: IValidateIdentityRequest = {
      accountId: 'account-id-mock',
      smartContractAddress: smartContractAddressMock,
      firstName: 'first-name-mock',
      lastName: 'last-name-mock',
      dateOfBirth: 'date-of-birth-mock',
      consent: true,
    };

    const addConsentResponseMock: IAddConsent = {
      success: true,
      error: '',
    };
    const responseMock: Partial<Response> = {
      ok: true,
      json: jest.fn().mockResolvedValue(addConsentResponseMock),
    };
    getDataFromUrlWithAuth0MockMock.mockResolvedValue(responseMock);

    const result = await validateAndAddConsent(
      configurationMock,
      addConsentRequestMock
    );

    const expectedAddConsentRequest = {
      accountId: addConsentRequestMock.accountId,
      firstName: addConsentRequestMock.firstName,
      lastName: addConsentRequestMock.lastName,
      dateOfBirth: addConsentRequestMock.dateOfBirth,
      consent: addConsentRequestMock.consent,
    };

    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlWithAuth0MockMock,
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsValidateAndAddConsentPath(
        smartContractAddressMock
      )}`,
      expectedAddConsentRequest,
      'POST',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      undefined
    );

    expect(result).toEqual(addConsentResponseMock);
  });

  it('throws exception on failure - case if get error message', async () => {
    const errorMessage = '';
    const smartContractAddressMock = 'smart-contract-address-mock';
    const addConsentRequestMock: IValidateIdentityRequest = {
      accountId: 'account-id-mock',
      smartContractAddress: smartContractAddressMock,
      firstName: 'first-name-mock',
      lastName: 'last-name-mock',
      dateOfBirth: 'date-of-birth-mock',
      consent: true,
    };

    const addConsentResponseMock: IAddConsent = {
      success: true,
      error: errorMessage,
    };

    const statusMock = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const responseMock: Partial<Response> = {
      ok: false,
      status: statusMock,
      json: jest.fn().mockResolvedValue(addConsentResponseMock),
    };
    getDataFromUrlWithAuth0MockMock.mockResolvedValue(responseMock);

    try {
      await validateAndAddConsent(configurationMock, addConsentRequestMock);
      fail('Expected exception but none thrown');
    } catch (error) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(error).toEqual(expectedError);
    }
  });
});

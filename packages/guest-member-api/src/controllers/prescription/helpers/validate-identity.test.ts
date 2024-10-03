// Copyright 2023 Prescryptive Health, Inc.

import { Response } from 'node-fetch';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { getDataFromUrlWithAuth0Mock } from '../../../utils/get-data-from-url-with-auth0.mock';
import { validateIdentity } from './validate-identity';
import { IValidateIdentityRequest } from '@phx/common/src/models/air/validate-identity.request';
import { gearsValidateIdentityPath } from '../../../configuration';
import { IValidateIdentity } from '@phx/common/src/models/air/validate-identity.response';

jest.mock('../../../utils/get-data-from-url-with-auth0.mock');
const getDataFromUrlWithAuth0MockMock =
  getDataFromUrlWithAuth0Mock as jest.Mock;

describe('validateIdentity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes identity rx validation', async () => {
    const smartContractAddressMock = 'smart-contract-address-mock';
    const validateIdentityRequestMock = {
      firstName: 'first-name-mock',
      lastName: 'last-name-mock',
      dateOfBirth: 'date-of-birth-mock',
      smartContractAddress: smartContractAddressMock,
    } as IValidateIdentityRequest;

    const validateIdentityResponseMock: IValidateIdentity = {
      success: true,
      error: '',
    };
    const responseMock: Partial<Response> = {
      ok: true,
      json: jest.fn().mockResolvedValue(validateIdentityResponseMock),
    };
    getDataFromUrlWithAuth0MockMock.mockResolvedValue(responseMock);

    const result = await validateIdentity(
      configurationMock,
      validateIdentityRequestMock
    );

    const expectedValidateIdentityRequest = {
      firstName: validateIdentityRequestMock.firstName,
      lastName: validateIdentityRequestMock.lastName,
      dateOfBirth: validateIdentityRequestMock.dateOfBirth,
    };

    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlWithAuth0MockMock,
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsValidateIdentityPath(
        smartContractAddressMock
      )}`,
      expectedValidateIdentityRequest,
      'POST',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      undefined
    );

    expect(result).toEqual(validateIdentityResponseMock);
  });

  it('throws exception on failure - case if get error message', async () => {
    // TODO: Add proper error messages from response when actual endpoints gets ready to use
    const errorMessage = '';
    const smartContractAddressMock = 'smart-contract-address-mock';
    const validateIdentityRequestMock = {
      firstName: 'first-name-mock',
      lastName: 'last-name-mock',
      dateOfBirth: 'date-of-birth-mock',
      smartContractAddress: smartContractAddressMock,
    } as IValidateIdentityRequest;
    const validateIdentityResponseMock: IValidateIdentity = {
      success: true,
      error: errorMessage,
    };

    const statusMock = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const responseMock: Partial<Response> = {
      ok: false,
      status: statusMock,
      json: jest.fn().mockResolvedValue(validateIdentityResponseMock),
    };
    getDataFromUrlWithAuth0MockMock.mockResolvedValue(responseMock);

    try {
      await validateIdentity(configurationMock, validateIdentityRequestMock);
      fail('Expected exception but none thrown');
    } catch (error) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(error).toEqual(expectedError);
    }
  });
});

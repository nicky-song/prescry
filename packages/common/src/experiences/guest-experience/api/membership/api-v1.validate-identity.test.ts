// Copyright 2023 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../../errors/error-codes';
import { ErrorConstants } from '../../../../theming/constants';
import { call } from '../../../../utils/api.helper';
import { IRetryPolicy } from '../../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from '../api-v1-helper';
import { RequestHeaders } from '../api-request-headers';
import { GuestExperienceConfig } from '../../guest-experience-config';
import { ensureApiResponse } from '../ensure-api-response/ensure-api-response';
import { IApiResponse } from '../../../../models/api-response';
import { validateIdentity } from './api-v1.validate-identity';

jest.mock('../../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../../utils/api.helper') as object),
  call: jest.fn(),
}));
const mockCall = call as jest.Mock;

jest.mock('../ensure-api-response/ensure-api-response');
const ensureApiResponseMock = ensureApiResponse as jest.Mock;

jest.mock('../api-v1-helper', () => ({
  ...(jest.requireActual('../api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));
const mockHandleHttpErrors = handleHttpErrors as jest.Mock;

describe('validateIdentity', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    ensureApiResponseMock.mockReturnValue(true);
  });

  it('makes api request', async () => {
    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
    });

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';
    const authTokenMock = 'auth-token';
    const deviceTokenMock = 'device-token';
    const retryPolicyMock = {} as IRetryPolicy;

    await validateIdentity(
      apiConfigMock,
      smartContractAddressMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      authTokenMock,
      deviceTokenMock,
      retryPolicyMock
    );

    const { protocol, host, port, url, version } = apiConfigMock.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/prescription/verify-patient/${smartContractAddressMock}`;
    const expectedBody = {
      smartContractAddress: smartContractAddressMock,
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
    };
    const expectedHeaders = {
      Authorization: authTokenMock,
      'x-prescryptive-device-token': deviceTokenMock,
      [RequestHeaders.apiVersion]: version,
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'POST',
      expectedHeaders,
      retryPolicyMock
    );
  });

  it('throws error if response format invalid', async () => {
    const errorMock = new Error('Boom!');
    ensureApiResponseMock.mockImplementation(() => {
      throw errorMock;
    });

    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
      status: HttpStatusCodes.SUCCESS,
    });

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';
    const authTokenMock = 'auth-token';
    const deviceTokenMock = 'device-token';
    const retryPolicyMock = {} as IRetryPolicy;

    try {
      await validateIdentity(
        apiConfigMock,
        smartContractAddressMock,
        firstNameMock,
        lastNameMock,
        dateOfBirthMock,
        authTokenMock,
        deviceTokenMock,
        retryPolicyMock
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(errorMock);
    }
  });

  it('returns response', async () => {
    const responseMock: IApiResponse = {
      message: '',
      status: 'success',
    };

    mockCall.mockResolvedValue({
      json: () => responseMock,
      ok: true,
    });

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';
    const authTokenMock = 'auth-token';
    const deviceTokenMock = 'device-token';
    const retryPolicyMock = {} as IRetryPolicy;

    const response = await validateIdentity(
      apiConfigMock,
      smartContractAddressMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      authTokenMock,
      deviceTokenMock,
      retryPolicyMock
    );
    expect(response).toEqual(responseMock);
  });

  it('includes refresh token in response', async () => {
    const refreshToken = 'refresh-token';
    const headers = new Headers();
    headers.append(RequestHeaders.refreshAccountToken, refreshToken);

    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
      headers,
    });

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';
    const authTokenMock = 'auth-token';
    const deviceTokenMock = 'device-token';
    const retryPolicyMock = {} as IRetryPolicy;

    const response = await validateIdentity(
      apiConfigMock,
      smartContractAddressMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      authTokenMock,
      deviceTokenMock,
      retryPolicyMock
    );

    expect(response.refreshToken).toEqual(refreshToken);
  });

  it('throws error if response failed', async () => {
    const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const expectedError = Error('Failed');
    const errorCode = 1;

    mockCall.mockResolvedValue({
      json: () => ({
        code: errorCode,
      }),
      ok: false,
      status: statusCode,
    });

    mockHandleHttpErrors.mockReturnValue(expectedError);

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';
    const authTokenMock = 'auth-token';
    const deviceTokenMock = 'device-token';
    const retryPolicyMock = {} as IRetryPolicy;

    try {
      await validateIdentity(
        apiConfigMock,
        smartContractAddressMock,
        firstNameMock,
        lastNameMock,
        dateOfBirthMock,
        authTokenMock,
        deviceTokenMock,
        retryPolicyMock
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorSendingPrescription,
      APITypes.VERIFY_PATIENT_INFO,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});

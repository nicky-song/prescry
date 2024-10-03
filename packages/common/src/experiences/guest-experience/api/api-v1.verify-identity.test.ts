// Copyright 2021 Prescryptive Health, Inc.

import { ErrorBadRequest } from '../../../errors/error-bad-request';
import { IVerifyIdentityRequestBody } from '../../../models/api-request-body/verify-identity.request-body';
import { IIdentityVerificationResponse } from '../../../models/api-response/identity-verification.response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { verifyIdentity } from './api-v1.verify-identity';
import { ensureIdentityVerificationResponse } from './ensure-api-response/ensure-identity-verification-response';
import { withRefreshToken } from './with-refresh-token';

jest.mock('../../../utils/api.helper');
jest.mock('./ensure-api-response/ensure-identity-verification-response');
jest.mock('./api-v1-helper');
jest.mock('./with-refresh-token');

const buildUrlMock = buildUrl as jest.Mock;
const callMock = call as jest.Mock;
const buildCommonHeadersMock = buildCommonHeaders as jest.Mock;
const ensureIdentityVerificationResponseMock =
  ensureIdentityVerificationResponse as jest.Mock;
const withRefreshTokenMock = withRefreshToken as jest.Mock;
const handleHttpErrorsMock = handleHttpErrors as jest.Mock;

describe('verifyIdentity', () => {
  beforeEach(() => {
    buildUrlMock.mockReset();
    callMock.mockReset();
    buildCommonHeadersMock.mockReset();
    ensureIdentityVerificationResponseMock.mockReset();
    withRefreshTokenMock.mockReset();
    handleHttpErrorsMock.mockReset();
  });
  it('returns ok response if no errors', async () => {
    const configMock = {} as IApiConfig;
    const verifyIdentityRequestBodyMock = {} as IVerifyIdentityRequestBody;
    const deviceTokenMock = '';
    const authTokenMock = '';
    const retryPolicyMock = undefined;
    const urlMock = 'test-url';
    const jsonMockFunction = jest.fn(() => 'test');
    const responseMock = { ok: true, json: jsonMockFunction };

    buildUrlMock.mockReturnValue(urlMock);
    callMock.mockReturnValue(responseMock);
    buildCommonHeadersMock.mockReturnValue(undefined);
    ensureIdentityVerificationResponseMock.mockReturnValue(true);
    withRefreshTokenMock.mockResolvedValue({} as IIdentityVerificationResponse);

    const verifiedIdentity = await verifyIdentity(
      configMock,
      verifyIdentityRequestBodyMock,
      deviceTokenMock,
      authTokenMock,
      retryPolicyMock
    );
    expect(buildUrlMock).toBeCalledWith(configMock, 'verifyIdentity', {});
    expect(callMock).toBeCalledWith(
      urlMock,
      verifyIdentityRequestBodyMock,
      'POST',
      undefined,
      retryPolicyMock
    );
    expect(jsonMockFunction).toBeCalled();
    expect(ensureIdentityVerificationResponseMock).toBeCalledWith('test');
    expect(withRefreshTokenMock).toBeCalledWith('test', responseMock);
    expect(verifiedIdentity).toEqual({} as IIdentityVerificationResponse);
  });
  it('throws error if response fails', async () => {
    const configMock = {} as IApiConfig;
    const verifyIdentityRequestBodyMock = {} as IVerifyIdentityRequestBody;
    const deviceTokenMock = '';
    const authTokenMock = '';
    const retryPolicyMock = {} as IRetryPolicy;
    const urlMock = 'test-url';
    const jsonMockFunction = jest.fn(() => 'test');
    const responseMock = {
      ok: false,
      json: jsonMockFunction,
      status: 403,
      code: 403,
    };

    buildUrlMock.mockReturnValue(urlMock);
    callMock.mockReturnValue(responseMock);
    buildCommonHeadersMock.mockReturnValue(undefined);
    ensureIdentityVerificationResponseMock.mockReturnValue(false);
    withRefreshTokenMock.mockResolvedValue({} as IIdentityVerificationResponse);
    handleHttpErrorsMock.mockReturnValue(new ErrorBadRequest('Bad Request'));

    await expect(
      verifyIdentity(
        configMock,
        verifyIdentityRequestBodyMock,
        deviceTokenMock,
        authTokenMock,
        retryPolicyMock
      )
    ).rejects.toThrow('Bad Request');
    expect(buildUrlMock).toBeCalledWith(configMock, 'verifyIdentity', {});
    expect(callMock).toBeCalledWith(
      urlMock,
      verifyIdentityRequestBodyMock,
      'POST',
      undefined,
      retryPolicyMock
    );
    expect(jsonMockFunction).toBeCalled();
    expect(handleHttpErrorsMock).toBeCalledWith(
      403,
      ErrorConstants.errorForVerifyingIdentity,
      APITypes.VERIFY_IDENTITY,
      undefined,
      'test'
    );
  });
});

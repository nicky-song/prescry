// Copyright 2020 Prescryptive Health, Inc.

import { acceptConsent } from '../../../api/api-v1.accept-consent';
import { acceptConsentDispatch } from './accept-consent.dispatch';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';

jest.mock('../../../api/api-v1.accept-consent', () => ({
  acceptConsent: jest.fn().mockResolvedValue({}),
}));
const acceptConsentMock = acceptConsent as jest.Mock;

jest.mock('../../settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';

const defaultStateMock = {
  config: {
    apis: {},
  },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
  serviceType: { type: 'test-service-type' },
};
const getStateMock = jest.fn();

describe('acceptConsentDispatch', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getStateMock.mockReturnValue(defaultStateMock);
    tokenUpdateDispatchMock.mockReset();
  });

  it('calls acceptConsent API with expected arguments', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';
    const acceptConsentResponseMock = {
      message: 'all good',
      refreshToken: 'refresh-token',
      status: 'ok',
    };
    acceptConsentMock.mockResolvedValue(acceptConsentResponseMock);

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    await acceptConsentDispatch(dispatchMock, getStateMock);

    expect(acceptConsentMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      getEndpointRetryPolicy,
      authTokenMock,
      deviceTokenMock,
      'test-service-type'
    );
    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      acceptConsentResponseMock.refreshToken
    );
  });
});

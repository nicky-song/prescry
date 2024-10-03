// Copyright 2022 Prescryptive Health, Inc.

import { IApiConfig } from '../../../../../utils/api.helper';
import { getFavoritedPharmaciesDispatch } from './get-favorited-pharmacies.dispatch';
import { getFavoritedPharmacies } from '../../../api/api-v1.get-favorited-pharmacies';
import { IRetryPolicy } from '../../../../../utils/retry-policies/retry-policy.helper';
import { IPharmacy } from '../../../../../models/pharmacy';

jest.mock(
  '../../../../../utils/retry-policies/get-endpoint.retry-policy',
  () => ({
    getNextRetry: jest.fn(),
    pause: 1000,
    remaining: 3,
  })
);

jest.mock('../../../api/api-v1.get-favorited-pharmacies');
const getFavoritedPharmaciesMock = getFavoritedPharmacies as jest.Mock;

describe('getFavoritedPharmaciesDispatch', () => {
  const favoritedPharmaciesMock = [{} as IPharmacy];
  const responseMock = {
    data: { favoritedPharmacies: favoritedPharmaciesMock },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    getFavoritedPharmaciesMock.mockReturnValue(responseMock);
  });

  it('calls getFavoritedPharmacies as expected', async () => {
    const guestExperienceApiMock = {} as IApiConfig;
    const tokenMock = 'token-mock';
    const deviceTokenMock = 'device-token-mock';
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({
      config: { apis: { guestExperienceApi: guestExperienceApiMock } },
      settings: { token: tokenMock, deviceToken: deviceTokenMock },
    });
    const retryPolicyMock = {} as IRetryPolicy;

    await getFavoritedPharmaciesDispatch(
      dispatchMock,
      getStateMock,
      retryPolicyMock
    );

    expect(getFavoritedPharmaciesMock).toHaveBeenCalledTimes(1);
    expect(getFavoritedPharmaciesMock).toHaveBeenNthCalledWith(
      1,
      guestExperienceApiMock,
      tokenMock,
      retryPolicyMock,
      deviceTokenMock
    );
  });

  it('returns expected response', async () => {
    const guestExperienceApiMock = {} as IApiConfig;
    const tokenMock = 'token-mock';
    const deviceTokenMock = 'device-token-mock';
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({
      config: { apis: { guestExperienceApi: guestExperienceApiMock } },
      settings: { token: tokenMock, deviceToken: deviceTokenMock },
    });
    const retryPolicyMock = {} as IRetryPolicy;

    const response = await getFavoritedPharmaciesDispatch(
      dispatchMock,
      getStateMock,
      retryPolicyMock
    );

    expect(response).toEqual(responseMock);
  });
});

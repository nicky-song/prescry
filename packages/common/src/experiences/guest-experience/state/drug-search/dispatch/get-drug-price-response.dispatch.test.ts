// Copyright 2021 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getDrugPrice } from '../../../api/api-v1.get-drug-price';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { pharmacyDrugPrice1Mock } from '../../../__mocks__/pharmacy-drug-price.mock';
import { IGetDrugPriceAsyncActionArgs } from '../async-actions/get-drug-price.async-action';
import { getDrugPriceResponseDispatch } from './get-drug-price-response.dispatch';
import { setDrugPriceResponseDispatch } from './set-drug-price-response.dispatch';

jest.mock('../../../api/api-v1.get-drug-price');
const getDrugPriceMock = getDrugPrice as jest.Mock;

jest.mock('./set-drug-price-response.dispatch');
const setDrugPriceResponseDispatchMock =
  setDrugPriceResponseDispatch as jest.Mock;

jest.mock('../../../store/settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

const locationMock = { zipCode: '98005' } as ILocationCoordinates;

describe('getDrugPriceResponseDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getDrugPriceMock.mockReturnValue({
      data: {
        pharmacyPrices: [pharmacyDrugPrice1Mock],
      },
    });
  });

  const configMock = GuestExperienceConfig;
  const settingsMock = {};
  const reduxGetStateMock = jest.fn().mockReturnValue({
    config: configMock,
    settings: settingsMock,
  });

  it('makes API request with coordinates', async () => {
    const locationWithCoordinatesMock = {
      ...locationMock,
      latitude: 1,
      longitude: 0,
    };
    const argsMock: IGetDrugPriceAsyncActionArgs = {
      location: locationWithCoordinatesMock,
      sortBy: 'youpay',
      ndc: '123',
      supply: 5,
      quantity: 5,
      isUnauthExperience: true,
      distance: 25,
      drugSearchDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await getDrugPriceResponseDispatch(argsMock);

    expect(getDrugPriceMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      argsMock.location,
      argsMock.sortBy,
      argsMock.ndc,
      argsMock.supply,
      argsMock.quantity,
      true,
      argsMock.distance,
      undefined,
      undefined,
      getEndpointRetryPolicy
    );
  });

  it('makes API request', async () => {
    const argsMock: IGetDrugPriceAsyncActionArgs = {
      location: locationMock,
      sortBy: 'youpay',
      ndc: '123',
      supply: 5,
      quantity: 5,
      isUnauthExperience: true,
      distance: 25,
      drugSearchDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await getDrugPriceResponseDispatch(argsMock);

    expect(getDrugPriceMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      argsMock.location,
      argsMock.sortBy,
      argsMock.ndc,
      argsMock.supply,
      argsMock.quantity,
      true,
      argsMock.distance,
      undefined,
      undefined,
      getEndpointRetryPolicy
    );
  });

  it('dispatches set Drug Price response', async () => {
    const argsMock: IGetDrugPriceAsyncActionArgs = {
      location: locationMock,
      sortBy: 'youpay',
      ndc: '123',
      supply: 5,
      quantity: 5,
      isUnauthExperience: true,
      distance: 25,
      drugSearchDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await getDrugPriceResponseDispatch(argsMock);

    expect(setDrugPriceResponseDispatchMock).toHaveBeenCalledWith(
      argsMock.drugSearchDispatch,
      [pharmacyDrugPrice1Mock],
      undefined
    );
    expect(tokenUpdateDispatchMock).not.toBeCalled();
  });
  it('makes API request with isUnauthExperience false and update the account token', async () => {
    const refreshTokenMock = 'refresh-token';
    getDrugPriceMock.mockReturnValueOnce({
      data: {
        pharmacyPrices: [pharmacyDrugPrice1Mock],
      },
      refreshToken: refreshTokenMock,
    });
    const tokenMock = 'token';
    const deviceTokenMock = 'device-token';
    const settingsWithTokenMock = {
      deviceToken: deviceTokenMock,
      token: tokenMock,
    };
    const reduxGetStateWithTokenMock = jest.fn().mockReturnValue({
      config: configMock,
      settings: settingsWithTokenMock,
    });
    const reduxDispatchMock = jest.fn();

    const argsMock: IGetDrugPriceAsyncActionArgs = {
      location: locationMock,
      sortBy: 'youpay',
      ndc: '123',
      supply: 5,
      quantity: 5,
      isUnauthExperience: false,
      distance: 25,
      drugSearchDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateWithTokenMock,
      navigation: rootStackNavigationMock,
    };

    await getDrugPriceResponseDispatch(argsMock);

    expect(getDrugPriceMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      argsMock.location,
      argsMock.sortBy,
      argsMock.ndc,
      argsMock.supply,
      argsMock.quantity,
      false,
      argsMock.distance,
      tokenMock,
      deviceTokenMock,
      getEndpointRetryPolicy
    );
    expect(tokenUpdateDispatchMock).toBeCalledWith(
      reduxDispatchMock,
      refreshTokenMock
    );
  });
});

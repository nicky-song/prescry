// Copyright 2021 Prescryptive Health, Inc.

import { getPharmaciesByZipCode } from '../../../api/api-v1.get-pharmacies-by-zip-code';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { IGetPharmaciesByZipCodeAsyncActionArgs } from '../async-actions/get-pharmacies-by-zip-code.async-action';
import { getPharmaciesByZipCodeDispatch } from './get-pharmacies-by-zip-code.dispatch';
import { setPharmaciesByZipCodeDispatch } from './set-pharmacies-by-zip-code.dispatch';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../../api/api-v1.get-pharmacies-by-zip-code');
const getPharmaciesByZipCodeMock = getPharmaciesByZipCode as jest.Mock;

jest.mock('./set-pharmacies-by-zip-code.dispatch');
const setPharmaciesByZipCodeDispatchMock =
  setPharmaciesByZipCodeDispatch as jest.Mock;

jest.mock('../../../store/settings/dispatch/token-update.dispatch');
const accountTokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

describe('gePharmaciesByZipCodeDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getPharmaciesByZipCodeMock.mockReturnValue({
      data: [{}],
    });
    accountTokenUpdateDispatchMock.mockResolvedValue(true);
  });

  it('makes API request', async () => {
    const configMock = GuestExperienceConfig;
    const settingsMock = {};
    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: configMock, settings: settingsMock });
    const argsMock: IGetPharmaciesByZipCodeAsyncActionArgs = {
      zipCode: '98005',
      isUnauthExperience: true,
      drugSearchDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await getPharmaciesByZipCodeDispatch(argsMock);

    expect(getPharmaciesByZipCodeMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      argsMock.zipCode,
      true,
      undefined,
      undefined,
      undefined,
      getEndpointRetryPolicy
    );
    expect(accountTokenUpdateDispatchMock).not.toBeCalled();
  });

  it('makes API request with start location when defined', async () => {
    const configMock = GuestExperienceConfig;
    const settingsMock = {};
    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: configMock, settings: settingsMock });
    const argsMock: IGetPharmaciesByZipCodeAsyncActionArgs = {
      zipCode: '98005',
      start: '20',
      isUnauthExperience: true,
      drugSearchDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await getPharmaciesByZipCodeDispatch(argsMock);

    expect(getPharmaciesByZipCodeMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      argsMock.zipCode,
      true,
      argsMock.start,
      undefined,
      undefined,
      getEndpointRetryPolicy
    );
    expect(accountTokenUpdateDispatchMock).not.toBeCalled();
  });

  it('dispatches setPharmaciesByZipCodeDispatch response', async () => {
    const configMock = GuestExperienceConfig;
    const settingsMock = {};
    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: configMock, settings: settingsMock });
    const argsMock: IGetPharmaciesByZipCodeAsyncActionArgs = {
      zipCode: '98005',
      isUnauthExperience: true,
      drugSearchDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await getPharmaciesByZipCodeDispatch(argsMock);

    expect(setPharmaciesByZipCodeDispatchMock).toHaveBeenCalledWith(
      argsMock.drugSearchDispatch,
      [{}],
      false
    );
    expect(accountTokenUpdateDispatchMock).not.toBeCalled();
  });

  it('dispatches setPharmaciesByZipCodeDispatch response with true if start is non-zero', async () => {
    const configMock = GuestExperienceConfig;
    const settingsMock = {};
    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: configMock, settings: settingsMock });
    const argsMock: IGetPharmaciesByZipCodeAsyncActionArgs = {
      zipCode: '98005',
      start: '20',
      isUnauthExperience: true,
      drugSearchDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await getPharmaciesByZipCodeDispatch(argsMock);

    expect(setPharmaciesByZipCodeDispatchMock).toHaveBeenCalledWith(
      argsMock.drugSearchDispatch,
      [{}],
      true
    );
    expect(accountTokenUpdateDispatchMock).not.toBeCalled();
  });

  it('makes API request with isUnauthExperience false and update the account token', async () => {
    const refreshTokenMock = 'refresh-token';
    getPharmaciesByZipCodeMock.mockReturnValueOnce({
      data: [{}],
      refreshToken: refreshTokenMock,
    });
    const tokenMock = 'token';
    const deviceTokenMock = 'device-token';
    const configMock = GuestExperienceConfig;
    const settingsMock = {
      deviceToken: deviceTokenMock,
      token: tokenMock,
    };
    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: configMock, settings: settingsMock });
    const reduxDispatchMock = jest.fn();
    const argsMock: IGetPharmaciesByZipCodeAsyncActionArgs = {
      zipCode: '98005',
      isUnauthExperience: false,
      drugSearchDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await getPharmaciesByZipCodeDispatch(argsMock);

    expect(getPharmaciesByZipCodeMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      argsMock.zipCode,
      false,
      undefined,
      tokenMock,
      deviceTokenMock,
      getEndpointRetryPolicy
    );
    expect(accountTokenUpdateDispatchMock).toBeCalledWith(
      reduxDispatchMock,
      refreshTokenMock
    );
  });
});

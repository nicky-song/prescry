// Copyright 2021 Prescryptive Health, Inc.

import { IMedicineCabinetResponse } from '../../../../../models/api-response/medicine-cabinet.response';
import { getMedicineCabinet } from '../../../api/api-v1.get-medicine-cabinet';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { ISettings } from '../../../guest-experience-settings';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { medicineCabinetStateMock } from '../../../__mocks__/medicine-cabinet-state.mock';
import { IGetMedicineCabinetAsyncActionArgs } from '../async-actions/get-medicine-cabinet.async-action';
import { getMedicineCabinetDispatch } from './get-medicine-cabinet.dispatch';
import { setMedicineCabinetPrescriptionsDispatch } from './set-medicine-cabinet-prescriptions.dispatch';
import { setMoreMedicineCabinetPrescriptionsDispatch } from './set-more-medicine-cabinet-prescriptions.dispatch';

jest.mock('../../../api/api-v1.get-medicine-cabinet');
const getMedicineCabinetMock = getMedicineCabinet as jest.Mock;

jest.mock('../../../store/settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('./set-medicine-cabinet-prescriptions.dispatch');
const setMedicineCabinetPrescriptionsDispatchMock =
  setMedicineCabinetPrescriptionsDispatch as jest.Mock;
jest.mock('./set-more-medicine-cabinet-prescriptions.dispatch');
const setMoreMedicineCabinetPrescriptionsDispatchMock =
  setMoreMedicineCabinetPrescriptionsDispatch as jest.Mock;

describe('getMedicineCabinetDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getMedicineCabinetMock.mockResolvedValue({
      data: medicineCabinetStateMock.prescriptions,
    });
    tokenUpdateDispatchMock.mockResolvedValue(true);
  });

  it('makes API request', async () => {
    const tokenMock = 'token';
    const deviceTokenMock = 'device-token';
    const settingsMock: Partial<ISettings> = {
      token: tokenMock,
      deviceToken: deviceTokenMock,
    };

    const configMock = GuestExperienceConfig;

    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: configMock,
      settings: settingsMock,
      features: { usetestcabinet: false },
    });

    const argsMock: IGetMedicineCabinetAsyncActionArgs = {
      page: 1,
      medicineCabinetDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      reduxDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getMedicineCabinetDispatch(argsMock);

    expect(getMedicineCabinetMock).toHaveBeenCalledWith(
      1,
      configMock.apis.guestExperienceApi,
      tokenMock,
      deviceTokenMock,
      undefined
    );
  });

  it('updates account token', async () => {
    const refreshTokenMock = 'refresh-token';
    getMedicineCabinetMock.mockResolvedValue({
      refreshToken: refreshTokenMock,
      data: medicineCabinetStateMock.prescriptions,
    });

    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
      features: {},
    });

    const argsMock: IGetMedicineCabinetAsyncActionArgs = {
      page: 1,
      medicineCabinetDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await getMedicineCabinetDispatch(argsMock);

    expect(tokenUpdateDispatchMock).toHaveBeenCalled();
  });

  it('dispatches set medicine cabinet', async () => {
    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
      features: {},
    });

    const responseMock: IMedicineCabinetResponse = {
      data: medicineCabinetStateMock.prescriptions,
      message: 'success',
      status: 'ok',
    };

    getMedicineCabinetMock.mockResolvedValue({ data: responseMock });

    const argsMock: IGetMedicineCabinetAsyncActionArgs = {
      page: 1,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      medicineCabinetDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getMedicineCabinetDispatch(argsMock);

    expect(setMedicineCabinetPrescriptionsDispatchMock).toHaveBeenCalled();
  });

  it('dispatches set medicine cabinet mock (usetestcabinet flag is set)', async () => {
    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
      features: { usetestcabinet: true },
    });

    const responseMock: IMedicineCabinetResponse = {
      data: medicineCabinetStateMock.prescriptions,
      message: 'success',
      status: 'ok',
    };

    getMedicineCabinetMock.mockResolvedValue({ data: responseMock });

    const argsMock: IGetMedicineCabinetAsyncActionArgs = {
      page: 1,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      medicineCabinetDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getMedicineCabinetDispatch(argsMock);

    expect(setMedicineCabinetPrescriptionsDispatchMock).toHaveBeenCalled();
  });
  it('dispatches set more medicine cabinet', async () => {
    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
      features: {},
    });

    const responseMock: IMedicineCabinetResponse = {
      data: medicineCabinetStateMock.prescriptions,
      message: 'success',
      status: 'ok',
    };

    getMedicineCabinetMock.mockResolvedValue({ data: responseMock });

    const argsMock: IGetMedicineCabinetAsyncActionArgs = {
      page: 2,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      medicineCabinetDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getMedicineCabinetDispatch(argsMock);

    expect(setMoreMedicineCabinetPrescriptionsDispatchMock).toHaveBeenCalled();
  });

  it('dispatches set more medicine cabinet mock(usetestcabinet flag is set)', async () => {
    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
      features: { usetestcabinet: true },
    });

    const responseMock: IMedicineCabinetResponse = {
      data: medicineCabinetStateMock.prescriptions,
      message: 'success',
      status: 'ok',
    };

    getMedicineCabinetMock.mockResolvedValue({ data: responseMock });

    const argsMock: IGetMedicineCabinetAsyncActionArgs = {
      page: 2,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      medicineCabinetDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getMedicineCabinetDispatch(argsMock);

    expect(setMoreMedicineCabinetPrescriptionsDispatchMock).toHaveBeenCalled();
  });
});

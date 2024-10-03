// Copyright 2022 Prescryptive Health, Inc.

import { IAccumulators } from '../../../../../models/accumulators';
import { IAccumulatorResponse } from '../../../../../models/api-response/accumulators.response';
import { getAccumulators } from '../../../api/api-v1.get-accumulators';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { ISettings } from '../../../guest-experience-settings';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { medicineCabinetStateMock } from '../../../__mocks__/medicine-cabinet-state.mock';
import { IGetAccumulatorAsyncActionArgs } from '../async-actions/get-accumulators.async-action';
import { getAccumulatorsDispatch } from './get-accumulators.dispatch';
import { setAccumulatorsDispatch } from './set-accumulators.dispatch';

jest.mock('../../../api/api-v1.get-accumulators');
const getAccumulatorsMock = getAccumulators as jest.Mock;

jest.mock('../../../store/settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('./set-accumulators.dispatch');
const setAccumulatorsMock = setAccumulatorsDispatch as jest.Mock;

describe('getAccumulatorsDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getAccumulatorsMock.mockResolvedValue({
      data: medicineCabinetStateMock.accumulators,
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
    });

    const argsMock: IGetAccumulatorAsyncActionArgs = {
      medicineCabinetDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      reduxDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getAccumulatorsDispatch(argsMock);

    expect(getAccumulatorsMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      tokenMock,
      deviceTokenMock
    );
  });

  it('updates account token', async () => {
    const refreshTokenMock = 'refresh-token';
    getAccumulatorsMock.mockResolvedValue({
      refreshToken: refreshTokenMock,
      data: medicineCabinetStateMock.accumulators,
    });

    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
    });

    const argsMock: IGetAccumulatorAsyncActionArgs = {
      medicineCabinetDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await getAccumulatorsDispatch(argsMock);

    expect(tokenUpdateDispatchMock).toHaveBeenCalled();
  });

  it('dispatches set accumulators', async () => {
    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
    });

    const responseMock: IAccumulatorResponse = {
      data: medicineCabinetStateMock.accumulators as IAccumulators,
      message: 'success',
      status: 'ok',
    };

    getAccumulatorsMock.mockResolvedValue({ data: responseMock });

    const argsMock: IGetAccumulatorAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      medicineCabinetDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getAccumulatorsDispatch(argsMock);

    expect(setAccumulatorsMock).toHaveBeenCalled();
  });
});

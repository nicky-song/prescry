// Copyright 2022 Prescryptive Health, Inc.

import { IClaimHistoryResponse } from '../../../../../models/api-response/claim-history.response';
import { getClaimHistory } from '../../../api/api-v1.get-claim-history';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { ISettings } from '../../../guest-experience-settings';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import {
  claimHistoryMock,
  medicineCabinetStateMock,
} from '../../../__mocks__/medicine-cabinet-state.mock';
import { IGetClaimHistoryAsyncActionArgs } from '../async-actions/get-claim-history.async-action';
import { getClaimHistoryDispatch } from './get-claim-history.dispatch';
import { setClaimHistoryDispatch } from './set-claim-history.dispatch';

jest.mock('../../../api/api-v1.get-claim-history');
const getClaimHistoryMock = getClaimHistory as jest.Mock;

jest.mock('../../../store/settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('./set-claim-history.dispatch');
const setClaimHistoryMock = setClaimHistoryDispatch as jest.Mock;

describe('getClaimHistoryDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getClaimHistoryMock.mockResolvedValue({
      data: claimHistoryMock,
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

    const argsMock: IGetClaimHistoryAsyncActionArgs = {
      medicineCabinetDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      reduxDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getClaimHistoryDispatch(argsMock);
    expect(getClaimHistoryMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      tokenMock,
      deviceTokenMock
    );
  });

  it('updates account token', async () => {
    const refreshTokenMock = 'refresh-token';
    getClaimHistoryMock.mockResolvedValue({
      refreshToken: refreshTokenMock,
      data: medicineCabinetStateMock.claimHistory,
    });

    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
    });

    const argsMock: IGetClaimHistoryAsyncActionArgs = {
      medicineCabinetDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await getClaimHistoryDispatch(argsMock);

    expect(tokenUpdateDispatchMock).toHaveBeenCalled();
  });

  it('dispatches set claim history', async () => {
    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
    });

    const responseMock: IClaimHistoryResponse = {
      data: medicineCabinetStateMock.claimHistory,
      message: 'success',
      status: 'ok',
    };

    getClaimHistoryMock.mockResolvedValue({ data: responseMock });

    const argsMock: IGetClaimHistoryAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      medicineCabinetDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getClaimHistoryDispatch(argsMock);

    expect(setClaimHistoryMock).toHaveBeenCalled();
  });
});

// Copyright 2022 Prescryptive Health, Inc.

import { IGetClaimAlertAsyncActionArgs } from '../async-actions/get-claim-alert.async-action';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { getClaimAlertDispatch } from './get-claim-alert.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { setClaimAlertDispatch } from './set-claim-alert.dispatch';
import { getClaimAlert } from '../../../api/api-v1.get-claim-alert';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { claimAlertMock } from '../../../__mocks__/claim-alert.mock';
import { ISettings } from '../../../guest-experience-settings';

const claimAlertAlernativeResponseMock = {
  message: '',
  status: 'ok',
  refreshToken: 'refresh-token',
  data: claimAlertMock,
};
jest.mock('../../../store/settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('./set-claim-alert.dispatch');
const setClaimAlertDispatchMock = setClaimAlertDispatch as jest.Mock;

jest.mock('../../../api/api-v1.get-claim-alert');
const getClaimAlertMock = getClaimAlert as jest.Mock;

const identifierMock = 'identifier';

describe('getClaimAlertDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    const argsMock: IGetClaimAlertAsyncActionArgs = {
      identifier: identifierMock,
      claimAlertDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      reduxDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    getClaimAlertMock.mockReturnValue(claimAlertAlernativeResponseMock);
    await getClaimAlertDispatch(argsMock);
    expect(getClaimAlertMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      identifierMock,
      tokenMock,
      deviceTokenMock
    );
  });

  it('calls accountTokenUpdateDispatch with expected args', async () => {
    const refreshTokenMock = 'refresh-token';
    getClaimAlertMock.mockResolvedValue({
      refreshToken: refreshTokenMock,
      data: claimAlertAlernativeResponseMock,
    });

    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
    });

    const argsMock: IGetClaimAlertAsyncActionArgs = {
      identifier: identifierMock,
      claimAlertDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await getClaimAlertDispatch(argsMock);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledTimes(1);
    expect(tokenUpdateDispatchMock).toHaveBeenNthCalledWith(
      1,
      argsMock.reduxDispatch,
      refreshTokenMock
    );
  });

  it('calls setClaimAlertDispatch with response.data', async () => {
    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
    });

    getClaimAlertMock.mockResolvedValue(claimAlertAlernativeResponseMock);

    const argsMock: IGetClaimAlertAsyncActionArgs = {
      identifier: identifierMock,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      claimAlertDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getClaimAlertDispatch(argsMock);
    expect(setClaimAlertDispatchMock).toHaveBeenCalledTimes(1);
    expect(setClaimAlertDispatchMock).toHaveBeenNthCalledWith(
      1,
      argsMock.claimAlertDispatch,
      expect.any(Object),
      expect.any(Array),
      expect.any(Object),
      expect.any(String),
      expect.any(Object)
    );
  });
});

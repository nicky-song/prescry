// Copyright 2020 Prescryptive Health, Inc.

import { tokenUpdateDispatch } from './token-update.dispatch';
import {
  GuestExperienceSettings,
  ISettings,
} from '../../../guest-experience-settings';
import { updateSettingsAction } from '../settings-reducer.actions';

jest.mock('../../../guest-experience-settings', () => ({
  GuestExperienceSettings: {
    current: jest.fn(),
    update: jest.fn(),
  },
}));
const currentMock = GuestExperienceSettings.current as jest.Mock;
const updateMock = GuestExperienceSettings.update as jest.Mock;

const accountTokenMock = 'account-token';
const deviceTokenMock = 'device-token';

describe('tokenUpdateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentMock.mockReturnValue({});
  });

  it('does not call GuestExperienceSettings.current if no account and device token', async () => {
    await tokenUpdateDispatch(jest.fn(), undefined, undefined);
    expect(currentMock).not.toHaveBeenCalled();
  });
  it('does not call GuestExperienceSettings.update if no account and device token', async () => {
    await tokenUpdateDispatch(jest.fn(), undefined, undefined);
    expect(updateMock).not.toHaveBeenCalled();
    const dispatchMock = jest.fn();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('calls GuestExperienceSettings.update with expected arguments', async () => {
    const currentSettings: ISettings = {
      isDeviceRestricted: true,
      lastZipCode: '12345',
    };
    currentMock.mockReturnValue(currentSettings);

    await tokenUpdateDispatch(jest.fn(), accountTokenMock, deviceTokenMock);

    const updatedSettings: ISettings = {
      ...currentSettings,
      token: accountTokenMock,
      deviceToken: deviceTokenMock,
    };
    expect(updateMock).toHaveBeenCalledWith(updatedSettings);
  });

  it('calls GuestExperienceSettings.update if device token is passed', async () => {
    await tokenUpdateDispatch(jest.fn(), undefined, deviceTokenMock);
    expect(GuestExperienceSettings.update).toHaveBeenCalled();
  });

  it('dispatches expected updateSettingsAction', async () => {
    const currentSettings: ISettings = {
      isDeviceRestricted: true,
      lastZipCode: '12345',
    };
    currentMock.mockReturnValue(currentSettings);

    const dispatchMock = jest.fn();
    await tokenUpdateDispatch(dispatchMock, accountTokenMock);

    const updatedSettings: ISettings = {
      ...currentSettings,
      token: accountTokenMock,
    };

    const expectedAction = updateSettingsAction(updatedSettings);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});

// Copyright 2020 Prescryptive Health, Inc.

import {
  GuestExperienceSettings,
  ISettings,
} from '../../../guest-experience-settings';
import { updateSettingsAction } from '../settings-reducer.actions';
import { accountTokenClearDispatch } from './account-token-clear.dispatch';

jest.mock('../../../guest-experience-settings', () => ({
  GuestExperienceSettings: {
    current: jest.fn(),
    update: jest.fn(),
  },
}));
const currentMock = GuestExperienceSettings.current as jest.Mock;
const updateMock = GuestExperienceSettings.update as jest.Mock;

describe('accountTokenClearDispatch', () => {
  beforeEach(() => {
    currentMock.mockReset();
    currentMock.mockReturnValue({});

    updateMock.mockReset();
  });

  it('calls GuestExperienceSettings.current', async () => {
    await accountTokenClearDispatch(jest.fn());

    expect(GuestExperienceSettings.current).toHaveBeenCalled();
  });

  it('calls GuestExperienceSettings.update with expected arguments', async () => {
    const currentSettings: ISettings = {
      isDeviceRestricted: true,
      lastZipCode: '12345',
    };
    currentMock.mockReturnValue(currentSettings);

    await accountTokenClearDispatch(jest.fn());

    const updatedSettings: ISettings = {
      ...currentSettings,
      token: '',
    };
    expect(GuestExperienceSettings.update).toHaveBeenCalledWith(
      updatedSettings
    );
  });

  it('dispatches expected updateSettingsAction', async () => {
    const currentSettings: ISettings = {
      isDeviceRestricted: true,
      lastZipCode: '12345',
    };
    currentMock.mockReturnValue(currentSettings);

    const dispatchMock = jest.fn();
    await accountTokenClearDispatch(dispatchMock);

    const updatedSettings: ISettings = {
      ...currentSettings,
      token: '',
    };

    const expectedAction = updateSettingsAction(updatedSettings);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});

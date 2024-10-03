// Copyright 2018 Prescryptive Health, Inc.

import {
  GuestExperienceSettings,
  InMemoryState,
  ISettings,
} from '../../guest-experience-settings';
import { Dispatch } from 'react';

export enum SettingsActionKeys {
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
}

export interface IUpdateSettingsAction {
  type: SettingsActionKeys.UPDATE_SETTINGS;
  payload: ISettings;
}

export type SettingsActionTypes = IUpdateSettingsAction;

export const updateSettingsAction = (
  settings: ISettings
): IUpdateSettingsAction => {
  return {
    payload: settings,
    type: SettingsActionKeys.UPDATE_SETTINGS,
  };
};

export const updateDeviceTokenSettingsAction = (deviceToken: string) => {
  return async (dispatch: Dispatch<IUpdateSettingsAction>) => {
    const currentSettings = await GuestExperienceSettings.current();
    const updatedSettings: ISettings = {
      ...currentSettings,
      deviceToken,
    };
    await GuestExperienceSettings.update(updatedSettings);
    await dispatch(updateSettingsAction(updatedSettings));
  };
};

export const resetSettingsAction = () => {
  return async (dispatch: Dispatch<IUpdateSettingsAction>) => {
    const resetSettings = InMemoryState.settings;
    const currentSettings = await GuestExperienceSettings.current();

    if (currentSettings.userLocation) {
      resetSettings.userLocation = currentSettings.userLocation;
    }
    await GuestExperienceSettings.update(resetSettings);
    await dispatch(updateSettingsAction(resetSettings));
  };
};

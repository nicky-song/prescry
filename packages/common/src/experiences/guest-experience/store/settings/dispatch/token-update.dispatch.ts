// Copyright 2020 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import {
  IUpdateSettingsAction,
  updateSettingsAction,
} from '../settings-reducer.actions';
import {
  GuestExperienceSettings,
  ISettings,
} from '../../../guest-experience-settings';

export const tokenUpdateDispatch = async (
  dispatch: Dispatch<IUpdateSettingsAction>,
  accountToken?: string,
  deviceToken?: string
) => {
  if (!accountToken && !deviceToken) {
    return;
  }

  const currentSettings = await GuestExperienceSettings.current();
  const updatedSettings: ISettings = {
    ...currentSettings,
  };
  if (accountToken) {
    updatedSettings.token = accountToken;
  }
  if (deviceToken) {
    updatedSettings.deviceToken = deviceToken;
  }
  await GuestExperienceSettings.update(updatedSettings);
  await dispatch(updateSettingsAction(updatedSettings));
};

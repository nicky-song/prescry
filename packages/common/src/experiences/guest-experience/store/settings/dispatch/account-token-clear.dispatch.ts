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

export const accountTokenClearDispatch = async (
  dispatch: Dispatch<IUpdateSettingsAction>
) => {
  const currentSettings = await GuestExperienceSettings.current();
  const updatedSettings: ISettings = {
    ...currentSettings,
    token: '',
  };
  await GuestExperienceSettings.update(updatedSettings);
  await dispatch(updateSettingsAction(updatedSettings));
};

// Copyright 2018 Prescryptive Health, Inc.

import {
  GuestExperienceSettings,
  ISettings,
} from '../../guest-experience-settings';
import {
  SettingsActionKeys,
  SettingsActionTypes,
} from './settings-reducer.actions';
export const settingsReducer = (
  state: ISettings | null = null,
  action: SettingsActionTypes
): ISettings => {
  state = state || GuestExperienceSettings.initialState;
  switch (action.type) {
    case SettingsActionKeys.UPDATE_SETTINGS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

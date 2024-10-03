// Copyright 2018 Prescryptive Health, Inc.

import {
  GuestExperienceSettings,
  ISettings,
} from '../../guest-experience-settings';
import { settingsReducer } from './settings-reducer';
import {
  IUpdateSettingsAction,
  SettingsActionKeys,
  SettingsActionTypes,
} from './settings-reducer.actions';

const initialState = {
  isDeviceRestricted: false,
  lastZipCode: 'test last zip',
  token: 'test token',
} as ISettings;

describe('SettingsReducer', () => {
  it('should update settings when action type is UPDATE_SETTINGS', () => {
    const payload: ISettings = {
      isDeviceRestricted: false,
      lastZipCode: 'updated test zip',
      token: 'token',
    };
    const action: IUpdateSettingsAction = {
      payload,
      type: SettingsActionKeys.UPDATE_SETTINGS,
    };
    const result = settingsReducer(initialState, action);
    expect(result).toEqual(payload);
    expect(result).not.toEqual(initialState);
  });

  it('should return default settings from GuestExperienceSettings when state is not defined', () => {
    const action = {
      payload: undefined,
      type: '',
    } as unknown as SettingsActionTypes;
    const result = settingsReducer(undefined, action);
    expect(result).toEqual(GuestExperienceSettings.initialState);
  });
});

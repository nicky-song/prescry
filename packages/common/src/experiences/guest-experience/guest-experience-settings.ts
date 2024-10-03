// Copyright 2018 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../../models/location-coordinates';

export interface ISettings {
  deviceToken?: string;
  lastZipCode: string;
  token?: string;
  isDeviceRestricted: boolean;
  dataRefreshIntervalMilliseconds?: number;
  automationToken?: string;
  userLocation?: ILocationCoordinates;
}

export const InMemoryState: {
  settings: ISettings;
} = {
  settings: {
    isDeviceRestricted: false,
    lastZipCode: 'unknown',
    dataRefreshIntervalMilliseconds: 5000,
  },
};

export interface ISettingsState {
  initialState: ISettings;
  current: () => ISettings;
  update: (settings: ISettings) => void;
  updateItem: (key: keyof ISettings, value: unknown) => void;
}

export const GuestExperienceSettings: ISettingsState = {
  current: () => InMemoryState.settings,
  initialState: InMemoryState.settings,
  update: (settings: ISettings) => {
    InMemoryState.settings = settings;
  },
  updateItem: (key: keyof ISettings, value: unknown) => {
    const current = GuestExperienceSettings.current();
    const updateSettings: ISettings = {
      ...current,
      [key]: value,
    };
    GuestExperienceSettings.update(updateSettings);
  },
};

// Copyright 2022 Prescryptive Health, Inc.

import {
  GuestExperienceSettings,
  InMemoryState,
  ISettings,
} from '@phx/common/src/experiences/guest-experience/guest-experience-settings';
import { settingsStorage } from './settings-storage';

export const getLocalStorage = (): ISettings => {
  const appSettings = settingsStorage.getItem('appSettings');
  if (appSettings) {
    return JSON.parse(appSettings);
  }
  return {
    ...InMemoryState.settings,
  };
};

export const setLocalStorage = (settings: ISettings) =>
  settingsStorage.setItem('appSettings', JSON.stringify(settings));

export const storageAvailable = () => {
  try {
    const storageTest = 'storageTestValue';
    settingsStorage.setItem(storageTest, storageTest);
    settingsStorage.removeItem(storageTest);
    return true;
  } catch (e) {
    return (
      (e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        settingsStorage?.length) ||
      false
    );
  }
};

export const isDeviceRestricted = () =>
  !/iPhone|iPad|Android/i.test(navigator.userAgent);

export const initializeLocalStorage = () => {
  if (storageAvailable()) {
    const originalState = InMemoryState.settings;
    const storedState = getLocalStorage();
    const initialState = {
      ...originalState,
      ...storedState,
      isDeviceRestricted: isDeviceRestricted(),
    };
    GuestExperienceSettings.initialState = initialState;
    GuestExperienceSettings.current = getLocalStorage;
    GuestExperienceSettings.update = setLocalStorage;
  }
};

export const isDeepLinkScenario = (location: Location) => {
  const resource = (location?.pathname || '')
    .replace(/\//g, '')
    .trim()
    .toLowerCase();
  return !!resource;
};

// Copyright 2022 Prescryptive Health, Inc.

import {
  ISettings,
  GuestExperienceSettings,
  InMemoryState,
} from '@phx/common/src/experiences/guest-experience/guest-experience-settings';
import {
  getLocalStorage,
  isDeviceRestricted,
  setLocalStorage,
  initializeLocalStorage,
  isDeepLinkScenario,
  storageAvailable,
} from './settings-config';
import { settingsStorage } from './settings-storage';

jest.mock('./settings-storage', () => {
  const localStore: { [key: string]: string } = {};
  const localStorageMock = {
    getItem: jest.fn().mockImplementation((key: string) => localStore[key]),
    setItem: jest
      .fn()
      .mockImplementation((key: string, newSettings: string) => {
        localStore[key] = newSettings;
      }),
    removeItem: jest
      .fn()
      .mockImplementationOnce((key: string) => delete localStore[key]),
  };
  return {
    settingsStorage: localStorageMock,
  };
});

Object.defineProperty(navigator, 'userAgent', {
  get() {
    return 'IPhone';
  },
});

const origCurrent = (GuestExperienceSettings.current = jest.fn());
const origUpdate = (GuestExperienceSettings.update = jest.fn());

const getItemMock = settingsStorage.getItem as jest.Mock;

describe('settingsConfig', () => {
  const defaultSettings: ISettings = {
    isDeviceRestricted: false,
    lastZipCode: 'unknown zip',
    token: 'unknown token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    GuestExperienceSettings.current = origCurrent;
    GuestExperienceSettings.update = origUpdate;
  });

  describe('initializeLocalStorage', () => {
    it('loads original state and assigns handlers on first run', () => {
      // clear initial state
      settingsStorage.setItem('appSettings', undefined as unknown as string);
      const wrongState = {}; // ensure this value is changed
      const wrongFunc = jest.fn();
      GuestExperienceSettings.initialState = wrongState as ISettings;
      GuestExperienceSettings.current = wrongFunc;
      GuestExperienceSettings.update = wrongFunc;

      initializeLocalStorage();

      expect(GuestExperienceSettings.current).not.toBe(wrongFunc);
      expect(GuestExperienceSettings.update).not.toBe(wrongFunc);
      expect(GuestExperienceSettings.initialState).not.toBe(wrongState);
      expect(GuestExperienceSettings.initialState).toMatchObject({
        ...InMemoryState.settings,
      });
      expect(getItemMock).toHaveBeenCalledTimes(1);
      expect(settingsStorage.setItem).toHaveBeenNthCalledWith(
        2,
        'storageTestValue',
        'storageTestValue'
      );
    });

    it('on second run, load settings from local storage and merges any new items', () => {
      // prepare initial state
      const settings = {
        lastZipCode: '12345',
      } as ISettings;
      settingsStorage.setItem('appSettings', JSON.stringify(settings));

      initializeLocalStorage();

      const expected = {
        ...InMemoryState.settings,
        ...settings,
      };
      expect(GuestExperienceSettings.initialState).toMatchObject(expected);
    });
  });

  describe('settings-config', () => {
    it('should get and set localStorage', () => {
      setLocalStorage(defaultSettings);
      const result = getLocalStorage();
      expect(result).toMatchObject(defaultSettings);
      expect(settingsStorage.getItem).toHaveBeenCalledWith('appSettings');
      expect(settingsStorage.setItem).toHaveBeenCalledWith(
        'appSettings',
        JSON.stringify(defaultSettings)
      );
    });

    it('should get and set localStorage', () => {
      setLocalStorage(defaultSettings);
      const result = getLocalStorage();
      expect(result).toMatchObject(defaultSettings);
      expect(settingsStorage.getItem).toHaveBeenCalledWith('appSettings');
      expect(settingsStorage.setItem).toHaveBeenCalledWith(
        'appSettings',
        JSON.stringify(defaultSettings)
      );
    });
  });

  describe('isDeviceRestricted', () => {
    it('should return true if it is a mobile device', () => {
      expect(isDeviceRestricted()).toBeFalsy();
    });
  });

  describe('isDeepLinkScenario', () => {
    it.each([
      [{ pathname: 'results' } as Location, true],
      [{ pathname: 'appointment/123456' } as Location, true],
      [{ pathname: 'invite/12345678' } as Location, true],
      [{} as Location, false],
      [{ pathname: '' } as Location, false],
    ])(
      'accepts correct inputs as deep link scenarios',
      (location: Location, result) => {
        expect(isDeepLinkScenario(location)).toEqual(result);
      }
    );
  });

  describe('storageAvailable', () => {
    it('will set item and remove to make sure storage available', () => {
      const status = storageAvailable();
      expect(settingsStorage.setItem).toBeCalledWith(
        'storageTestValue',
        'storageTestValue'
      );
      expect(status).toEqual(true);
    });

    it('returns false when settingsStorage.length is undefined', () => {
      const error = new Error('error');
      settingsStorage.setItem = jest.fn().mockImplementationOnce(() => {
        throw error;
      });
      expect(storageAvailable()).toEqual(false);
    });
  });
});

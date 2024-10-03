// Copyright 2022 Prescryptive Health, Inc.

import { getCurrentLanguage } from './get-current-device-language.helper';
import { Platform, NativeModules } from 'react-native';

describe('getCurrentLanguage', () => {
  it('should return current device language for web platform', () => {
    const navigatorLanguageMock = jest.spyOn(
      window.navigator,
      'language',
      'get'
    );
    Platform.OS = 'web';
    navigatorLanguageMock.mockReturnValue('en-US');
    const expected = 'English';
    const result = getCurrentLanguage();
    expect(result).toEqual(expected);
  });

  it('should return current device language for ios platform < iOS 13', () => {
    NativeModules.SettingsManager = {
      settings: {
        AppleLocale: 'en-US',
        AppleLanguages: ['en-US'],
      },
    };
    Platform.OS = 'ios';
    const expected = 'English';
    const result = getCurrentLanguage();
    expect(result).toEqual(expected);
  });

  it('should return current device language for ios platform iOS 13', () => {
    NativeModules.SettingsManager = {
      settings: {
        AppleLocale: undefined,
        AppleLanguages: ['en-US'],
      },
    };
    Platform.OS = 'ios';
    const expected = 'English';
    const result = getCurrentLanguage();
    expect(result).toEqual(expected);
  });

  it('should return current device language for android platform', () => {
    NativeModules.I18nManager = {
      localeIdentifier: 'en-US',
    };
    Platform.OS = 'android';
    const expected = 'English';
    const result = getCurrentLanguage();
    expect(result).toEqual(expected);
  });
});

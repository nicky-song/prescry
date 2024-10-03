// Copyright 2022 Prescryptive Health, Inc.

import { Platform, NativeModules } from 'react-native';
import { Language } from '../../models/language';
import { getContentLanguage } from './get-content-language.helper';

export const getCurrentLanguage = (): Language => {
  const deviceLanguage: Language = getContentLanguage(
    Platform.OS === 'web'
      ? navigator.language
      : Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier
  );
  return deviceLanguage;
};

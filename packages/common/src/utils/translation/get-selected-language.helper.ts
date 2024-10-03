// Copyright 2022 Prescryptive Health, Inc.

import {
  Language,
  LanguageSelection,
  defaultLanguage,
} from '../../models/language';

export const getSelectedLanguage = (
  currentLanguage: Language,
  languageSelection?: LanguageSelection
): Language => {
  if (languageSelection === 'current') {
    return currentLanguage;
  }

  return !languageSelection || languageSelection === 'default'
    ? defaultLanguage
    : languageSelection;
};

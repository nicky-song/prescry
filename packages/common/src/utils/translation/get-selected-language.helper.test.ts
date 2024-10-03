// Copyright 2022 Prescryptive Health, Inc.

import {
  defaultLanguage,
  Language,
  LanguageSelection,
} from '../../models/language';
import { getSelectedLanguage } from './get-selected-language.helper';

describe('getSelectedLanguage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [undefined, 'Spanish', defaultLanguage],
    ['default', 'Spanish', defaultLanguage],
    ['current', 'Spanish', 'Spanish'],
    ['English', 'Spanish', 'English'],
    ['Spanish', 'Spanish', 'Spanish'],
  ])(
    'gets selected language (language: %p, currentLanguage: %p)',
    (
      languageMock: undefined | string,
      currentLanguageMock: string,
      expectedLanguage: string
    ) => {
      expect(
        getSelectedLanguage(
          currentLanguageMock as Language,
          languageMock as LanguageSelection
        )
      ).toEqual(expectedLanguage);
    }
  );
});

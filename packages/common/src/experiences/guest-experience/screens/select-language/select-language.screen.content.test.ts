// Copyright 2022 Prescryptive Health, Inc.

import { selectLanguageOptions } from './select-language.screen.content';

describe('selectLanguageOptions', () => {
  it('should have expected content defined', () => {
    const expectedContent = [
      ['English', 'English'],
      ['Spanish', 'Español'],
      ['Vietnamese', 'tiếng Việt'],
    ];

    expect(selectLanguageOptions).toEqual(expectedContent);
  });
});

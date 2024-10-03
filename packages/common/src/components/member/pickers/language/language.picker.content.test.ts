// Copyright 2022 Prescryptive Health, Inc.

import { languagePickerContent } from './language.picker.content';

describe('languagePickerContent', () => {
  it('should have expected content defined', () => {
    const expectedContent = {
      defaultOptions: new Map<string, string>([
        ['English', 'English'],
        ['Spanish', 'Spanish'],
      ]),
      spanishOptions: new Map<string, string>([
        ['English', 'Ingles'],
        ['Spanish', 'Español'],
      ]),
    };
    expect(languagePickerContent).toEqual(expectedContent);
  });
});

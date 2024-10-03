// Copyright 2022 Prescryptive Health, Inc.

import { getQueryLanguage } from './get-query-language.helper';

describe('getQueryLanguage', () => {
  it.each([
    ['?lang=', 'en', 'English'],
    ['?lang=', 'en-us', 'English'],
    ['?lang=', 'es', 'Spanish'],
    ['?lang=', 'es-es', 'Spanish'],
    ['?lang=', 'zz', 'English'],
    ['?lang=', '', 'English'],
    ['?test=', '', undefined],
    [undefined, undefined, undefined],
  ])(
    'it should return appropriate results (query string: %p, language code: %p, result: %p)',
    (
      queryString?: string,
      localeString?: string,
      expectedLanguage?: string
    ) => {
      const result = getQueryLanguage(queryString?.concat(localeString ?? ''));
      expect(result).toEqual(expectedLanguage);
    }
  );
});

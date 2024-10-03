// Copyright 2022 Prescryptive Health, Inc.

import { getLanguageQueryParam } from './get-language-query-param.helper';

describe('getLanguageQueryParam', () => {
  it.each([
    ['?lang=', 'en', 'lang=en'],
    ['?f=usefeature:1&lang=', 'en', 'lang=en'],
    ['?lang=', 'en-us', 'lang=en-us'],
    ['?lang=', 'es', 'lang=es'],
    ['?lang=', 'es-es', 'lang=es-es'],
    ['?lang=', 'zz', 'lang=zz'],
    ['?lang=', '', 'lang='],
    ['?test=', '', undefined],
    [undefined, undefined, undefined],
  ])(
    'it should return appropriate results (query string: %p, language code: %p, result: %p)',
    (
      queryString?: string,
      localeString?: string,
      expectedLanguageQueryParam?: string
    ) => {
      const result = getLanguageQueryParam(
        queryString?.concat(localeString ?? '')
      );
      expect(result).toEqual(expectedLanguageQueryParam);
    }
  );
});

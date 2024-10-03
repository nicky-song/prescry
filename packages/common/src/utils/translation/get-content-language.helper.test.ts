//  Copyright 2022 Prescryptive Health, Inc.

import { defaultLanguage } from '../../models/language';
import { getContentLanguage } from './get-content-language.helper';

const expectedLanguages = [
  // English
  ['en', 'English'],
  ['en-au', 'English'],
  ['en-bz', 'English'],
  ['en-ca', 'English'],
  ['en-cb', 'English'],
  ['en-gb', 'English'],
  ['en-ie', 'English'],
  ['en-jm', 'English'],
  ['en-nz', 'English'],
  ['en-ph', 'English'],
  ['en-tt', 'English'],
  ['en-us', 'English'],
  ['en-za', 'English'],
  ['en-zw', 'English'],
  // Arabic
  ['ar', defaultLanguage],
  ['ar-ae', defaultLanguage],
  ['ar-bh', defaultLanguage],
  ['ar-dz', defaultLanguage],
  ['ar-eg', defaultLanguage],
  ['ar-iq', defaultLanguage],
  ['ar-jo', defaultLanguage],
  ['ar-kw', defaultLanguage],
  ['ar-lb', defaultLanguage],
  ['ar-ly', defaultLanguage],
  ['ar-ma', defaultLanguage],
  ['ar-om', defaultLanguage],
  ['ar-qa', defaultLanguage],
  ['ar-sa', defaultLanguage],
  ['ar-sy', defaultLanguage],
  ['ar-tn', defaultLanguage],
  ['ar-ye', defaultLanguage],
  // Bosnian
  ['bs-ba', defaultLanguage],
  // Burmese
  ['bur', defaultLanguage],
  ['mya', defaultLanguage],
  ['my', defaultLanguage],
  // Cambodian
  ['km', defaultLanguage],
  ['khm', defaultLanguage],
  // Cantonese
  ['yue', defaultLanguage],
  // Chinese
  ['zh', defaultLanguage],
  ['zh-cn', defaultLanguage],
  ['zh-hk', defaultLanguage],
  ['zh-mo', defaultLanguage],
  ['zh-sg', defaultLanguage],
  ['zh-tw', defaultLanguage],
  // Chuukese
  ['chk', defaultLanguage],
  // Farsi
  ['fa', defaultLanguage],
  ['fa-ir', defaultLanguage],
  // French
  ['fr', defaultLanguage],
  ['fr-be', defaultLanguage],
  ['fr-ca', defaultLanguage],
  ['fr-ch', defaultLanguage],
  ['fr-fr', defaultLanguage],
  ['fr-lu', defaultLanguage],
  ['fr-mc', defaultLanguage],
  // German
  ['de', defaultLanguage],
  ['de-at', defaultLanguage],
  ['de-ch', defaultLanguage],
  ['de-de', defaultLanguage],
  ['de-li', defaultLanguage],
  ['de-lu', defaultLanguage],
  // Japanese
  ['ja', defaultLanguage],
  ['ja-jp', defaultLanguage],
  // Korean
  ['ko', defaultLanguage],
  ['ko-kr', defaultLanguage],
  // Laotian
  ['lo', defaultLanguage],
  ['lao', defaultLanguage],
  // Mandarin
  ['cmn', defaultLanguage],
  // Marshallese
  ['mh', defaultLanguage],
  ['mah', defaultLanguage],
  // Oromo
  ['om', defaultLanguage],
  ['orm', defaultLanguage],
  // Pohnpeian
  ['pon', defaultLanguage],
  // Romanian
  ['ro', defaultLanguage],
  ['ro-ro', defaultLanguage],
  ['rum', defaultLanguage],
  // Russian
  ['ru', defaultLanguage],
  ['ru-ru', defaultLanguage],
  // Somali
  ['so', defaultLanguage],
  ['so-so', defaultLanguage],
  // Spanish
  ['es', 'Spanish'],
  ['es-ar', 'Spanish'],
  ['es-bo', 'Spanish'],
  ['es-bz', 'Spanish'],
  ['es-br', 'Spanish'],
  ['es-cl', 'Spanish'],
  ['es-co', 'Spanish'],
  ['es-cr', 'Spanish'],
  ['es-do', 'Spanish'],
  ['es-ec', 'Spanish'],
  ['es-es', 'Spanish'],
  ['es-gt', 'Spanish'],
  ['es-hn', 'Spanish'],
  ['es-mx', 'Spanish'],
  ['es-ni', 'Spanish'],
  ['es-pa', 'Spanish'],
  ['es-pe', 'Spanish'],
  ['es-ph', 'Spanish'],
  ['es-pr', 'Spanish'],
  ['es-py', 'Spanish'],
  ['es-sv', 'Spanish'],
  ['es-uy', 'Spanish'],
  ['es-ve', 'Spanish'],
  ['es-419', 'Spanish'],
  ['es-ic', 'Spanish'],
  ['es-us', 'Spanish'],
  ['es-gq', 'Spanish'],
  ['es-ea', 'Spanish'],
  // Swahili
  ['sw', defaultLanguage],
  ['sw-ke', defaultLanguage],
  ['sw-tz', defaultLanguage],
  ['sw-ug', defaultLanguage],
  ['sw-cd', defaultLanguage],
  // Thai
  ['th', defaultLanguage],
  ['th-th', defaultLanguage],
  // Ukrainian
  ['uk', defaultLanguage],
  ['uk-ua', defaultLanguage],
  // Vietnamese
  ['vi', 'Vietnamese'],
  ['vi-vn', 'Vietnamese'],
];

describe('mapDeviceContentLanguage', () => {
  it.each(expectedLanguages)(
    'should return expected string for %p',
    (deviceLanguage: string, expected: string) => {
      const result = getContentLanguage(deviceLanguage);
      expect(result).toEqual(expected);
    }
  );
});

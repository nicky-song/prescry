// Copyright 2022 Prescryptive Health, Inc.

import { defaultLanguage, LanguageCode } from '../../../../models/language';
import { getQueryLanguage } from '../../../../utils/translation/get-query-language.helper';

export const updateURLWithFeatureFlagsAndLanguage = (
  pathname?: string,
  lang?: LanguageCode,
  forceLang?: boolean,
) => {
  const params = new URLSearchParams(location.search);
  const isDefaultLanguage =
    getQueryLanguage(lang ? `?lang=${lang}` : location.search) ===
    defaultLanguage;
  const f = params.get('f');
  
  const currentLang = lang ?? params.get('lang');
  const currentLangParams = currentLang ? `lang=${currentLang}` : undefined;

  const query =
    f && currentLangParams && (!isDefaultLanguage || forceLang)
      ? `f=${f}&${currentLangParams}`
      : f
      ? `f=${f}`
      : currentLangParams && (!isDefaultLanguage || forceLang)
      ? currentLangParams
      : '';

  const url = `${window.location.origin}${pathname ?? ''}${
    query ? `?${query}` : ''
  }`;
  window.history.replaceState &&
    window.history.replaceState(null, document.title, url);
};

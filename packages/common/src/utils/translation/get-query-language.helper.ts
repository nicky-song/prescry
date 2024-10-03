// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../models/language';
import { getContentLanguage } from './get-content-language.helper';

export const getQueryLanguage = (
  searchParam?: string
): Language | undefined => {

  if (!searchParam) {
    return undefined;
  }

  const languageSearchCase = 'lang=';
  const resource = searchParam.search(languageSearchCase);

  if (resource > -1) {
    const langIndex = resource + languageSearchCase.length;

    const languageParam = searchParam
      .slice(langIndex)
      .split('&')[0];
    const queryLanguage = getContentLanguage(languageParam);
    
    return queryLanguage;
  }

  return undefined;
};

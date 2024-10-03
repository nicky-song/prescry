// Copyright 2022 Prescryptive Health, Inc.

import { getLanguageQueryParam } from '../../../../utils/translation/get-language-query-param.helper';

export const handleNavigateToHome = (featureUrl?: string) => {
  const languageQueryParam = getLanguageQueryParam(location.search);

  const url = `${
    featureUrl ? featureUrl : languageQueryParam ? '?' + languageQueryParam : ''
  }${featureUrl && languageQueryParam ? '&' + languageQueryParam : ''}`;

  if (window.history.replaceState) {
    window.history.replaceState(null, '', `${window.location.origin}${url}`);
  }
};

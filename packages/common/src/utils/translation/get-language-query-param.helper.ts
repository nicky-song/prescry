// Copyright 2022 Prescryptive Health, Inc.

export const getLanguageQueryParam = (
  searchParam?: string
): string | undefined => {
  
  if (!searchParam) {
    return undefined;
  }

  const languageSearchCase = 'lang=';
  const resource = searchParam.search(languageSearchCase);

  if (resource > -1) {
    const languageParam = searchParam
      .slice(resource + languageSearchCase.length)
      .split('&')[0];
    const languageQueryParam = `${languageSearchCase}${languageParam}`;

    return languageQueryParam;
  }

  return undefined;
};

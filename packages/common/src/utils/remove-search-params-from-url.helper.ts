// Copyright 2022 Prescryptive Health, Inc.

export const removeSearchParamsFromUrl = (searchParams: string[]) => {
  const urlParams = location.search;
  const urlParamsSearch = new URLSearchParams(urlParams);
  searchParams.forEach((value) => urlParamsSearch.delete(value));
  const updatedURLSearhParams = urlParamsSearch.toString();
  const includeQuestionMark = updatedURLSearhParams !== '';
  window.history.replaceState(
    {},
    document.title,
    `${location.pathname}${
      includeQuestionMark ? '?' : ''
    }${updatedURLSearhParams}`
  );
};

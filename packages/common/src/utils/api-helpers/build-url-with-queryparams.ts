// Copyright 2018 Prescryptive Health, Inc.

export function buildUrlWithQueryParams(
  url: string,
  queryParams: { [key: string]: string }
) {
  const updateQueryStringParameter = (
    uri: string,
    key: string,
    value: string
  ) => {
    const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + '=' + value + '$2');
    } else {
      return uri + separator + key + '=' + value;
    }
  };
  Object.keys(queryParams).forEach((param) => {
    url = updateQueryStringParameter(url, param, queryParams[param]);
  });
  return url;
}

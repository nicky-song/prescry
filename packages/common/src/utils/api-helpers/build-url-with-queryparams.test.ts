// Copyright 2018 Prescryptive Health, Inc.

import { buildUrlWithQueryParams } from './build-url-with-queryparams';
describe('buildUrlWithQueryParams', () => {
  it('should return build url when there are no params', () => {
    const url = 'www.myrx.io';
    const queryParams = { servicetype: 'pcr' };

    expect(buildUrlWithQueryParams(url, queryParams)).toEqual(
      'www.myrx.io?servicetype=pcr'
    );
  });
  it('should return build url when there is a query parameter', () => {
    const url = 'www.myrx.io?abc=xyz';
    const queryParams = { servicetype: 'pcr' };

    expect(buildUrlWithQueryParams(url, queryParams)).toEqual(
      'www.myrx.io?abc=xyz&servicetype=pcr'
    );
  });
});

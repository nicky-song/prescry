// Copyright 2021 Prescryptive Health, Inc.

import { ISearchBoxContent, searchBoxContent } from './search-box.content';

describe('searchBoxContent', () => {
  it('has expected content', () => {
    const content = searchBoxContent;
    const expectedContent: ISearchBoxContent = {
      placeholder: 'Enter zip code',
      searchresults: 'Search results',
      errorNearbyPharmacyNotFound: 'No pharmacies found',
    };

    expect(content).toEqual(expectedContent);
  });
});

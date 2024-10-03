// Copyright 2021 Prescryptive Health, Inc.

import {
  drugSearchHomeScreenContent,
  IDrugSearchHomeScreenContent,
} from './drug-search-home.screen.content';

describe('drugSearchHomeScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IDrugSearchHomeScreenContent = {
      noResultsMessage: "Sorry, we didn't find a matching drug",
      searchTextPlaceholder: 'Search for drugs',
      searchTextAccessibilityLabel: 'Search for drugs',
      goBackButtonLabel: 'Go back to previous screen',
    };

    expect(drugSearchHomeScreenContent).toEqual(expectedContent);
  });
});

// Copyright 2022 Prescryptive Health, Inc.

import {
  configureFiltersScreenContent,
  IConfigureFiltersScreenContent,
} from './configure-filters.screen.content';

describe('configureMedicationScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IConfigureFiltersScreenContent = {
      filterByLabel: 'Filter by',
      sortByLabel: 'Sort by',
      applyLabel: 'Apply',
      distanceRange: expect.any(Function),
    };

    expect(configureFiltersScreenContent).toEqual(expectedContent);
  });
});

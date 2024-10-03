// Copyright 2022 Prescryptive Health, Inc.

import {
  filterButtonContent,
  IFilterButtonContent,
} from './filter.button.content';

describe('filterButtonContent', () => {
  it('has expected content', () => {
    const expectedFilterButtonContent: IFilterButtonContent = {
      filterLabel: 'Filter',
    };

    expect(filterButtonContent).toEqual(expectedFilterButtonContent);
  });
});

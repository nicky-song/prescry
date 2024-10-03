// Copyright 2020 Prescryptive Health, Inc.

import {
  IPastProceduresListScreenContent,
  pastProceduresListScreenContent,
} from './past-procedures-list.screen.content';

describe('pastProceduresListScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IPastProceduresListScreenContent = {
      title: 'Past procedures',
    };

    expect(pastProceduresListScreenContent).toEqual(expectedContent);
  });
});

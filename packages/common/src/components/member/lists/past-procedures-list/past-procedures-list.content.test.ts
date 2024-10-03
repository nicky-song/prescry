// Copyright 2020 Prescryptive Health, Inc.

import {
  IPastProceduresListContent,
  pastProceduresListContent,
} from './past-procedures-list.content';

describe('PastProceduresListContent', () => {
  it('has expected content', () => {
    const expectedContent: IPastProceduresListContent = {
      latestHeading: 'Latest',
      pastHeading: 'Past',
      pastProcedureDateLabel: 'Date',
      serviceNameLabel: 'Service',
    };

    expect(pastProceduresListContent).toEqual(expectedContent);
  });
});

// Copyright 2021 Prescryptive Health, Inc.

import {
  defaultPastProceduresState,
  IPastProceduresListState,
} from './past-procedures.state';

describe('PastProceduresState', () => {
  it('has expected default state', () => {
    const expectedState: IPastProceduresListState = {
      pastProceduresList: [],
    };

    expect(defaultPastProceduresState).toEqual(expectedState);
  });
});

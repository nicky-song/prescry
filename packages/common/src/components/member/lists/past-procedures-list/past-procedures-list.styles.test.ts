// Copyright 2020 Prescryptive Health, Inc.

import {
  IPastProceduresListStyles,
  pastProceduresListStyle,
} from './past-procedures-list.styles';

describe('pastProceduresListScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPastProceduresListStyles = {
      itemTextStyle: {
        alignItems: 'center',
        marginBottom: 30,
      },
    };

    expect(pastProceduresListStyle).toEqual(expectedStyles);
  });
});

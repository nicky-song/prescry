// Copyright 2022 Prescryptive Health, Inc.

import {
  IDrugDetailsTextStyles,
  drugDetailsTextStyles,
} from './drug-details.text.styles';

describe('drugDetailsTextStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IDrugDetailsTextStyles = {
      viewStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
    };

    expect(drugDetailsTextStyles).toEqual(expectedStyles);
  });
});

// Copyright 2022 Prescryptive Health, Inc.

import { IChevronCardStyles, chevronCardStyles } from './chevron.card.styles';

describe('chevronCardStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IChevronCardStyles = {
      chevronCardViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    };

    expect(chevronCardStyles).toEqual(expectedStyles);
  });
});

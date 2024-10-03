// Copyright 2021 Prescryptive Health, Inc.

import {
  pinKeypadContainerStyles,
  IPinKeypadContainerStyles,
  getMargin,
} from './pin-keypad-container.styles';

describe('pinKeypadContainerStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPinKeypadContainerStyles = {
      pinKeypadRowStyle: {
        flexDirection: 'row',
      },
      pinKeypadRowItemStyle: {
        flex: 1,
        margin: getMargin(),
      },
    };

    expect(pinKeypadContainerStyles).toEqual(expectedStyles);
  });
});

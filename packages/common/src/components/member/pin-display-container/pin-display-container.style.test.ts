// Copyright 2021 Prescryptive Health, Inc.

import {
  pinDisplayContainerStyle,
  IPinDisplayContainerStyle,
} from './pin-display-container.style';

describe('pinDisplayContainerStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: IPinDisplayContainerStyle = {
      containerViewStyle: { maxHeight: 36, flexDirection: 'row' },
      pinContainerViewStyle: {
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 36,
        width: 36,
      },
    };

    expect(pinDisplayContainerStyle).toEqual(expectedStyles);
  });
});

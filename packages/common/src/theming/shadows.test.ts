// Copyright 2022 Prescryptive Health, Inc.

import { GrayScaleColor } from './colors';
import { IShadowsStyle, shadows } from './shadows';

describe('shadows', () => {
  it('has expected card shadow', () => {
    const expectedStyles: IShadowsStyle = {
      cardShadowStyle: {
        shadowOffset: { width: 2, height: 2 },
        shadowColor: GrayScaleColor.black,
        shadowRadius: 12,
        shadowOpacity: 0.1,
      },
    };

    expect(shadows).toEqual(expectedStyles);
  });
});

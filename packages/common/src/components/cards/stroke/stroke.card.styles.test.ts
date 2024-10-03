// Copyright 2021 Prescryptive Health, Inc.

import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import { IStrokeCardStyles, strokeCardStyles } from './stroke.card.styles';

describe('strokeCardStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IStrokeCardStyles = {
      viewStyle: {
        borderRadius: BorderRadius.normal,
        borderWidth: 1,
        borderColor: GrayScaleColor.borderLines,
        paddingTop: Spacing.base,
        paddingBottom: Spacing.base,
        paddingLeft: Spacing.base,
        paddingRight: Spacing.base,
      },
    };

    expect(strokeCardStyles).toEqual(expectedStyles);
  });
});

// Copyright 2022 Prescryptive Health, Inc.

import { PrimaryColor } from '../../../../theming/colors';
import { getFontFace, FontWeight } from '../../../../theming/fonts';
import { IconSize } from '../../../../theming/icons';
import { Spacing } from '../../../../theming/spacing';
import {
  IAccumulatorsCardStyles,
  accumulatorsCardStyles,
} from './accumulators.card.styles';

describe('accumulatorsCardStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IAccumulatorsCardStyles = {
      categoryContainerViewStyle: {
        flexDirection: 'row',
        alignContent: 'center',
      },
      categoryIconTextStyle: {
        marginRight: Spacing.half,
        fontSize: IconSize.regular,
        color: PrimaryColor.plum,
      },
      categoryLabelTextStyle: {
        color: PrimaryColor.plum,
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      separatorViewStyle: {
        marginTop: Spacing.times1pt5,
      },
      progressBarViewStyle: {
        marginTop: Spacing.times1pt5,
      },
    };

    expect(accumulatorsCardStyles).toEqual(expectedStyles);
  });
});

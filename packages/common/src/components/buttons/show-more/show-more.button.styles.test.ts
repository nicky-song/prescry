// Copyright 2022 Prescryptive Health, Inc.

import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  IShowMoreButtonStyles,
  showMoreButtonStyles,
} from './show-more.button.styles';

describe('showMoreButtonStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IShowMoreButtonStyles = {
      viewStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
      textStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        marginRight: Spacing.threeQuarters,
      },
    };

    expect(showMoreButtonStyles).toEqual(expectedStyles);
  });
});

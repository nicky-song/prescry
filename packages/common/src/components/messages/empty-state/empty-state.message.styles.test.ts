// Copyright 2022 Prescryptive Health, Inc.

import { PrimaryColor } from '../../../theming/colors';
import {
  getFontDimensions,
  FontSize,
  getFontFace,
  FontWeight,
} from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  IEmptyStateMessageStyles,
  emptyStateMessageStyles,
} from './empty-state.message.styles';

describe('emptyStateMessageStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IEmptyStateMessageStyles = {
      containerViewStyle: {
        paddingTop: Spacing.times4,
      },
      imageStyle: {
        height: 96,
        marginBottom: Spacing.times1pt5,
      },
      messageTextStyle: {
        color: PrimaryColor.plum,
        ...getFontDimensions(FontSize.large),
        textAlign: 'center',
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      bottomRegularTextStyle: {
        paddingBottom: Spacing.times2,
      },
      bottomWideTextStyle: {
        paddingBottom: Spacing.times4,
      },
    };

    expect(emptyStateMessageStyles).toEqual(expectedStyles);
  });
});

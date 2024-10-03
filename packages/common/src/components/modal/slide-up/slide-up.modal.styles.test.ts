// Copyright 2022 Prescryptive Health, Inc.

import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { Spacing } from '../../../theming/spacing';
import {
  ISlideUpModalStyles,
  slideUpModalStyles,
} from './slide-up.modal.styles';

describe('slideUpModalStyles', () => {
  it('has expected styles', () => {
    const iconButtonPadding = Spacing.base;

    const expectedStyles: ISlideUpModalStyles = {
      modalViewStyle: {
        justifyContent: 'flex-end',
        margin: 0,
        paddingTop: 102,
      },
      contentViewStyle: {
        paddingTop: Spacing.times2,
        paddingBottom: Spacing.times2,
        paddingLeft: Spacing.times1pt5,
        paddingRight: Spacing.times1pt5,
        borderTopLeftRadius: BorderRadius.times1pt5,
        borderTopRightRadius: BorderRadius.times1pt5,
        backgroundColor: GrayScaleColor.white,
        flexGrow: 0,
      },
      headingViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: -iconButtonPadding,
        marginBottom: Spacing.times2 - iconButtonPadding,
      },
      iconTextStyle: {
        fontSize: IconSize.regular,
        color: GrayScaleColor.secondaryGray,
        marginRight: -iconButtonPadding,
      },
    };

    expect(slideUpModalStyles).toEqual(expectedStyles);
  });
});

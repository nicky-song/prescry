// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { BorderRadius } from '../../../../theming/borders';
import { GrayScaleColor, PrimaryColor } from '../../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import { isDesktopDevice } from '../../../../utils/responsive-screen.helper';
import {
  IMarketingCardStyle,
  marketingCardStyles,
} from './marketing.card.styles';

describe('marketingCardStyles', () => {
  it('should have correct styles', () => {
    const marketingCardViewStyle: ViewStyle = {
      backgroundColor: GrayScaleColor.white,
      shadowOffset: { width: 0, height: 2 },
      shadowColor: GrayScaleColor.borderLines,
      shadowRadius: 2,
      borderRadius: BorderRadius.times1pt5,
      flexDirection: 'row',
      flexWrap: 'wrap',
      minHeight: 100,
      height: 'auto',
      paddingLeft: Spacing.times1pt5,
      paddingRight: Spacing.times1pt5,
      paddingTop: isDesktopDevice() ? Spacing.times2 : Spacing.base,
      paddingBottom: Spacing.times2,
    };

    const iconImageStyle: ImageStyle = {
      height: 64,
      width: 64,
      maxWidth: 64,
      marginTop: Spacing.base,
      marginBottom: Spacing.times2,
      marginRight: Spacing.times1pt5,
    };

    const marketingCardContentViewStyle: ViewStyle = {
      flex: 1,
      minWidth: '80%',
    };

    const marketingCardTitleTextStyle: TextStyle = {
      color: PrimaryColor.prescryptivePurple,
      ...getFontFace({ family: 'Poppins', weight: FontWeight.semiBold }),
      ...getFontDimensions(FontSize.xLarge),
    };

    const marketingCardDescriptionTextStyle: TextStyle = {
      marginTop: Spacing.threeQuarters,
    };

    const expectedStyles: IMarketingCardStyle = {
      marketingCardViewStyle,
      iconImageStyle,
      marketingCardTitleTextStyle,
      marketingCardDescriptionTextStyle,
      marketingCardContentViewStyle,
    };

    expect(marketingCardStyles).toEqual(expectedStyles);
  });
});

// Copyright 2023 Prescryptive Health, Inc.

import { IRxIdCardStyles, rxIdCardStyles } from './rx-id-card.styles';
import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { BorderRadius } from '../../../theming/borders';
import { shadows } from '../../../theming/shadows';
import { Spacing } from '../../../theming/spacing';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';

describe('rxIdCardStyles', () => {
  const maxWidth = 366;
  const minWidth = 272;
  const maxHeight = 240;
  const minHeight = 178;
  const widthRatio = 1 / 3;
  const heightRatio = 20 / 366;
  const cardMargin = 48;

  const imageWidth = (width: number) => {
    if (width <= maxWidth + cardMargin && width >= minWidth + cardMargin) {
      return {
        width: (width - cardMargin) * widthRatio,
        height: (width - cardMargin) * heightRatio,
      };
    } else if (width > maxWidth + cardMargin) {
      return { width: widthRatio * maxWidth, height: 20 };
    } else {
      return { width: widthRatio * minWidth, height: 16 };
    }
  };

  const commonRowViewStyle: ViewStyle = {
    display: 'flex',
    flexDirection: 'row',
  };
  const backgroundGradient = {
    background: `linear-gradient(0deg, rgba(98, 64, 163, 0.5), rgba(98, 64, 163, 0.5)), ${PrimaryColor.darkPurple}`,
  };
  const headingTextStyle: TextStyle = {
    fontSize: FontSize.h1,
    lineHeight: 24,
    ...getFontFace({ weight: FontWeight.semiBold }),
  };

  it('has expected styles', () => {
    const widthMock = 333;

    const expectedStyles: IRxIdCardStyles = {
      containerViewStyle: {
        borderRadius: BorderRadius.times1pt5,
        ...shadows.cardShadowStyle,
        maxWidth,
        maxHeight,
        minHeight,
        minWidth,
      },
      containerPbmViewStyle: {
        backgroundColor: GrayScaleColor.white,
      },
      containerSmartPriceViewStyle: {
        backgroundColor: PrimaryColor.darkPurple,
        ...backgroundGradient,
      },
      headerViewStyle: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
      },
      logoContainerViewStyle: {
        backgroundColor: PrimaryColor.prescryptivePurple,
        borderTopLeftRadius: BorderRadius.times1pt5,
        borderBottomRightRadius: Spacing.times1pt5,
        flex: 1,
      },
      logoImageStyle: {
        marginLeft: Spacing.base,
        marginTop: Spacing.base,
        marginBottom: Spacing.base,
        minHeight: 16,
        minWidth: 93,
        maxHeight: 20,
        maxWidth: 126,
        width: imageWidth(widthMock).width,
        height: imageWidth(widthMock).height,
      },
      providerImageContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      providerImageStyle: {
        marginTop: -2,
        marginRight: Spacing.base,
        minHeight: 16,
        maxHeight: 24,
        minWidth: 81,
        maxWidth: 105,
      },
      contentContainerViewStyle: {
        marginTop: Spacing.times1pt5,
        marginLeft: Spacing.base,
        ...commonRowViewStyle,
        flex: 1,
      },
      headerTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        flexGrow: 1,
        textAlign: 'right',
        marginRight: Spacing.base,
        flexWrap: 'nowrap',
        ...getFontDimensions(FontSize.body),
      },
      headerPbmTextStyle: {
        color: PrimaryColor.prescryptivePurple,
      },
      headerSmartPriceTextStyle: {
        color: GrayScaleColor.white,
      },
      rowViewStyle: { ...commonRowViewStyle },
      pbmBackgroundImageStyle: {
        width: 107,
        height: 100,
        alignSelf: 'flex-end',
        position: 'absolute',
        marginRight: Spacing.half,
        bottom: 0,
      },
      smartPriceBackgroundImageStyle: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignSelf: 'flex-end',
        marginRight: Spacing.half,
      },
      bodyContainerViewStyle: {
        justifyContent: 'space-between',
        flex: 1,
        marginLeft: Spacing.base,
        marginTop: Spacing.times1pt5,
        marginBottom: Spacing.base,
        marginRight: Spacing.base,
      },
      pbmNameTextStyle: {
        color: PrimaryColor.darkPurple,
        ...headingTextStyle,
      },
      smartPriceNameTextStyle: {
        color: GrayScaleColor.white,
        ...headingTextStyle,
      },
      idViewStyle: {
        flexDirection: 'row',
        marginTop: Spacing.base,
      },
      pbmIdLabelTextStyle: {
        fontSize: FontSize.h3,
        lineHeight: FontSize.h3,
        color: GrayScaleColor.secondaryGray,
      },
      smartPriceIdLabelTextStyle: {
        fontSize: FontSize.h3,
        lineHeight: FontSize.h3,
        color: PrimaryColor.lightPurple,
      },
      pbmIdTextStyle: {
        fontSize: FontSize.h3,
        lineHeight: FontSize.h3,
      },
      smartPriceIdTextStyle: {
        color: GrayScaleColor.white,
        lineHeight: FontSize.h3,
      },
      idTextViewStyle: {
        marginLeft: Spacing.quarter,
      },
      rxViewStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
      rxViewStyleWithLabel: {
        marginTop: Spacing.base,
      },
      cobrandingPbmTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        lineHeight: FontSize.body,
        color: PrimaryColor.prescryptivePurple,
        marginTop: Spacing.times1pt25,
      },
      cobrandingSmartPriceTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        lineHeight: FontSize.body,
        color: GrayScaleColor.white,
        textAlign: 'right',
        marginTop: Spacing.times1pt25,
      },
      bottomSpacingViewStyle: {
        marginTop: Spacing.times1pt25,
      },
      memberIdTextStyle: {
        ...getFontDimensions(FontSize.small),
        color: PrimaryColor.lightPurple,
      },
      unauthMessageTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        color: GrayScaleColor.white,
      },
    };

    expect(rxIdCardStyles(widthMock)).toEqual(expectedStyles);
  });
});

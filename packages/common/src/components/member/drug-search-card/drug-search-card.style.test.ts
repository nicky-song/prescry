// Copyright 2021 Prescryptive Health, Inc.

import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { PurpleScale } from '../../../theming/theme';
import {
  IDrugSearchCardStyles,
  drugSearchCardStyles,
  drugSearchCardDesktopStyles,
} from './drug-search-card.style';

describe('drugSearchCardStyles', () => {
  it('has expected styles', () => {
    const backgroundGradient = {
      backgroundImage: `linear-gradient(130deg, ${PurpleScale.darkest}, ${PurpleScale.darker})`,
    };

    const expectedDesktopStyles: IDrugSearchCardStyles = {
      titleTextStyle: {
        color: GrayScaleColor.white,
        fontSize: FontSize.h2,
        ...getFontFace({ family: 'Poppins', weight: FontWeight.semiBold }),
        marginTop: Spacing.quarter,
      },
      subtitleTextStyle: {
        fontSize: FontSize.xLarge,
        color: PurpleScale.lighter,
        paddingTop: Spacing.times2,
        marginBottom: Spacing.times4,
      },
      cardContainerViewStyle: {
        flex: 1,
        paddingLeft: Spacing.times2,
        paddingRight: Spacing.times2,
        paddingTop: Spacing.times2,
        borderRadius: BorderRadius.times1pt5,
        minHeight: 280,
        ...backgroundGradient,
      },
      searchButtonContainerViewStyle: {
        marginBottom: Spacing.times2,
        maxWidth: '50%',
      },
    };

    const expectedMobileStyles: IDrugSearchCardStyles = {
      titleTextStyle: {
        ...getFontFace({ family: 'Poppins', weight: FontWeight.semiBold }),
        fontSize: FontSize.xLarge,
        color: GrayScaleColor.white,
        marginBottom: 35,
      },
      subtitleTextStyle: {
        ...getFontFace({ family: 'Poppins', weight: FontWeight.semiBold }),
        fontSize: FontSize.large,
        color: PurpleScale.lighter,
        marginBottom: Spacing.times2,
      },
      cardContainerViewStyle: {
        flex: 1,
        paddingLeft: Spacing.times1pt25,
        paddingRight: Spacing.times1pt25,
        paddingTop: Spacing.times2,
        borderRadius: BorderRadius.times1pt5,
        minHeight: 300,
        ...backgroundGradient,
      },
      searchButtonContainerViewStyle: {
        marginBottom: -Spacing.base,
      },
    };

    expect(drugSearchCardDesktopStyles).toEqual(expectedDesktopStyles);
    expect(drugSearchCardStyles).toEqual(expectedMobileStyles);
  });
});

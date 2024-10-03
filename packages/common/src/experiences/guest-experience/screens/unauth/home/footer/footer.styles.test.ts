// Copyright 2021 Prescryptive Health, Inc.

import { PrimaryColor } from '../../../../../../theming/colors';
import { FontSize, getFontDimensions } from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';
import {
  IFooterStyles,
  getFooterStyles,
  footerBackgroundGradient,
} from './footer.styles';

describe('getFooterStyles', () => {
  it('has expected desktop styles', () => {
    const expectedDesktopStyles: IFooterStyles = {
      footerViewStyle: {
        minWidth: '100%',
        paddingTop: Spacing.times1pt5,
        paddingBottom: Spacing.times1pt5,
        paddingLeft: Spacing.times8,
        paddingRight: Spacing.times8,
        flexDirection: 'row',
        height: 80,
        justifyContent: 'space-between',
        alignItems: 'center',
        ...footerBackgroundGradient,
      },
      prescryptiveLogoImageStyle: {
        height: 48,
        width: 128,
        flexGrow: 0,
      },
      linkTextStyle: {
        color: PrimaryColor.lightPurple,
        marginLeft: Spacing.times3,
        ...getFontDimensions(FontSize.small),
        maxWidth: 'fit-content',
        flex: 1,
      },
      languagePickerAndLinksContainerViewStyle: {
        flexDirection: 'row',
        flexGrow: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      languagePickerTextStyle: {
        flexGrow: 0,
      },
      prescryptiveLogoContainerViewStyle: {},
      languagePickerContainerViewStyle: {
        marginLeft: Spacing.times3,
        flexDirection: 'row',
        maxWidth: 'fit-content',
        flex: 1,
      },
      termsAndConditionsLinkTextStyle: {},
    };

    expect(getFooterStyles(true)).toEqual(expectedDesktopStyles);
  });

  it('has expected mobile styles', () => {
    const expectedMobileStyles: IFooterStyles = {
      footerViewStyle: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingLeft: Spacing.base,
        paddingRight: Spacing.base,
        paddingTop: Spacing.times1pt5,
        paddingBottom: Spacing.times1pt5,
        ...footerBackgroundGradient,
      },
      prescryptiveLogoImageStyle: {
        height: 48,
        width: 128,
        marginBottom: Spacing.times1pt5,
      },
      linkTextStyle: {
        color: PrimaryColor.lightPurple,
        width: '100%',
        textAlign: 'left',
        paddingLeft: Spacing.half,
        ...getFontDimensions(FontSize.small),
      },
      languagePickerAndLinksContainerViewStyle: {},
      languagePickerTextStyle: {},
      prescryptiveLogoContainerViewStyle: {
        alignSelf: 'center',
      },
      languagePickerContainerViewStyle: {
        marginBottom: Spacing.threeQuarters,
      },
      termsAndConditionsLinkTextStyle: { marginTop: Spacing.threeQuarters },
    };

    expect(getFooterStyles(false)).toEqual(expectedMobileStyles);
  });
});

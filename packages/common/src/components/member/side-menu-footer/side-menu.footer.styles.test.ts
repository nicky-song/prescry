// Copyright 2021 Prescryptive Health, Inc.

import { FontSize, getFontDimensions } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  ISideMenuFooterStyles,
  sideMenuFooterStyles,
} from './side-menu.footer.styles';

describe('sideMenuFooterStyles', () => {
  it('has expected styles', () => {
    const expectedStyle: ISideMenuFooterStyles = {
      termsConditionsAndPrivacyLinksStyles: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
      copyrightTextStyle: {
        marginTop: Spacing.threeQuarters,
        ...getFontDimensions(FontSize.small),
      },
      rightsReservedTextStyle: {
        marginTop: Spacing.half,
        ...getFontDimensions(FontSize.small),
      },
      sideMenuFooterContainerViewStyle: {
        bottom: 0,
        width: '100%',
        paddingLeft: Spacing.times1pt5,
        paddingRight: Spacing.times1pt5,
        paddingBottom: Spacing.times2,
        flexDirection: 'column',
        position: 'absolute',
        alignItems: 'flex-start',
      },
    };

    expect(sideMenuFooterStyles).toEqual(expectedStyle);
  });
});

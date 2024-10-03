// Copyright 2022 Prescryptive Health, Inc.

import { FontWeight, getFontFace } from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';
import {
  reactNavigationDrawerItemLabelLeftMargin,
} from '../../react-navigation-drawer.styles';
import {
  ILanguageSideMenuDrawerItemStyles,
  languageSideMenuDrawerItemStyles,
} from './language.side-menu.drawer-item.styles';

describe('languageSideMenuDrawerItemStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ILanguageSideMenuDrawerItemStyles = {
      itemLabelViewStyle: {
        flexDirection: 'row',
      },
      labelTextStyle: {
        marginLeft: Spacing.times1pt5 - reactNavigationDrawerItemLabelLeftMargin,
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      labelDotTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
    };

    expect(languageSideMenuDrawerItemStyles).toEqual(expectedStyles);
  });
});

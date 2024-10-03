// Copyright 2022 Prescryptive Health, Inc.

import { FontWeight, getFontFace } from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';
import {
  reactNavigationDrawerItemLabelLeftMargin,
  reactNavigationDrawerItemVerticalPadding,
} from '../../react-navigation-drawer.styles';
import {
  ISideMenuDrawerItemStyles,
  sideMenuDrawerItemStyles,
} from './side-menu.drawer-item.styles';

describe('sideMenuDrawerItemStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ISideMenuDrawerItemStyles = {
      iconViewStyle: {
        width: 24,
        alignItems: 'center',
        justifyContent: 'center',
      },
      itemViewStyle: {
        marginHorizontal: -8,
        marginVertical: 0,
      },
      labelTextStyle: {
        marginLeft:
          Spacing.times1pt5 - reactNavigationDrawerItemLabelLeftMargin,
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      lineSeparatorViewStyle: {
        marginTop: Spacing.times1pt5 - reactNavigationDrawerItemVerticalPadding,
        marginBottom:
          Spacing.times1pt5 - reactNavigationDrawerItemVerticalPadding,
      },
    };

    expect(sideMenuDrawerItemStyles).toEqual(expectedStyles);
  });
});

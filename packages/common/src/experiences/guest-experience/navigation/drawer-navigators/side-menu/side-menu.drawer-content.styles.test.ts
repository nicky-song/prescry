// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../../../theming/spacing';
import {
  reactNavigationDrawerItemVerticalPadding,
  reactNavigationDrawerHeaderBottomMargin,
} from '../react-navigation-drawer.styles';
import {
  ISideMenuDrawerContentStyles,
  sideMenuDrawerContentStyles,
} from './side-menu.drawer-content.styles';

describe('sideMenuDrawerContentStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ISideMenuDrawerContentStyles = {
      scrollViewStyle: {
        padding: Spacing.times1pt5,
        paddingTop:
          Spacing.times1pt5 - reactNavigationDrawerItemVerticalPadding,
        marginTop: -reactNavigationDrawerHeaderBottomMargin,
      },
    };

    expect(sideMenuDrawerContentStyles).toEqual(expectedStyles);
  });
});

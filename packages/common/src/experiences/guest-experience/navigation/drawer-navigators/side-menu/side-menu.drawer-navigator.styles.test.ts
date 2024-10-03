// Copyright 2022 Prescryptive Health, Inc.

import {
  ISideMenuDrawerNavigatorStyles,
  sideMenuDrawerNavigatorStyles,
} from './side-menu.drawer-navigator.styles';

describe('sideMenuDrawerNavigatorStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ISideMenuDrawerNavigatorStyles = {
      drawerOpenViewStyle: { width: '100%' },
      drawerClosedViewStyle: { width: 0 },
    };

    expect(sideMenuDrawerNavigatorStyles).toEqual(expectedStyles);
  });
});

// Copyright 2022 Prescryptive Health, Inc.

import { SideMenuDrawerNavigationProp } from '../side-menu.drawer-navigator';

export const sideMenuDrawerNavigationMock: SideMenuDrawerNavigationProp = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
  isFocused: jest.fn(),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  jumpTo: jest.fn(),
  closeDrawer: jest.fn(),
  openDrawer: jest.fn(),
  toggleDrawer: jest.fn(),
};

// Copyright 2021 Prescryptive Health, Inc.

import { RootStackNavigationProp } from '../root.stack-navigator';

export const rootStackNavigationMock: RootStackNavigationProp = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
  isFocused: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  push: jest.fn(),
  removeListener: jest.fn(),
  replace: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  jumpTo: jest.fn(),
  closeDrawer: jest.fn(),
  openDrawer: jest.fn(),
  toggleDrawer: jest.fn(),
};

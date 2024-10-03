// Copyright 2022 Prescryptive Health, Inc.

import { AccountAndFamilyStackNavigationProp } from '../account-and-family.stack-navigator';

export const accountAndFamilyStackGetStateMock = jest.fn();
export const accountAndFamilyStackNavigationMock: AccountAndFamilyStackNavigationProp =
  {
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    addListener: jest.fn(),
    canGoBack: jest.fn(),
    getParent: jest.fn(),
    getState: accountAndFamilyStackGetStateMock,
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

// Copyright 2021 Prescryptive Health, Inc.

import { sideMenuDrawerNavigationMock } from '../../../drawer-navigators/side-menu/__mocks__/side-menu.drawer-navigation.mock';
import { PastProceduresStackNavigationProp } from '../past-procedures.stack-navigator';

export const pastProceduresStackGetStateMock = jest.fn();
export const pastProceduresStackNavigationMock: PastProceduresStackNavigationProp =
  {
    ...sideMenuDrawerNavigationMock,
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    addListener: jest.fn(),
    canGoBack: jest.fn(),
    getParent: jest.fn(),
    getState: pastProceduresStackGetStateMock,
    isFocused: jest.fn(),
    pop: jest.fn(),
    popToTop: jest.fn(),
    push: jest.fn(),
    removeListener: jest.fn(),
    replace: jest.fn(),
    reset: jest.fn(),
    setOptions: jest.fn(),
    setParams: jest.fn(),
  };

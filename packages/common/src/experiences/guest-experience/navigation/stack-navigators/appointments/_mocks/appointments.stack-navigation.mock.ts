// Copyright 2022 Prescryptive Health, Inc.

import { AppointmentsStackNavigationProp } from '../appointments.stack-navigator';

export const appointmentsStackGetStateMock = jest.fn();
export const appointmentsStackNavigationMock: AppointmentsStackNavigationProp =
  {
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    addListener: jest.fn(),
    canGoBack: jest.fn(),
    getParent: jest.fn(),
    getState: appointmentsStackGetStateMock,
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

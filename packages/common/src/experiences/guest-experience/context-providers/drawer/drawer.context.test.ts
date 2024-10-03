// Copyright 2022 Prescryptive Health, Inc.

import { createContext } from 'react';
import { defaultDrawerState } from '../../state/drawer/drawer.state';
import { IDrawerContext, DrawerContext } from './drawer.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  createContext: jest.fn().mockReturnValue({}),
}));
const createContextMock = createContext as jest.Mock;

describe('DrawerContext', () => {
  it('creates context', () => {
    expect(DrawerContext).toBeDefined();

    const expectedContext: IDrawerContext = {
      drawerState: defaultDrawerState,
      drawerDispatch: expect.any(Function),
    };
    expect(createContextMock).toHaveBeenCalledWith(expectedContext);
  });
});

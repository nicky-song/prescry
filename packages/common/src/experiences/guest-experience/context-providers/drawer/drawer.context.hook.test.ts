// Copyright 2022 Prescryptive Health, Inc.

import { useContext } from 'react';
import { defaultDrawerState } from '../../state/drawer/drawer.state';
import { IDrawerContext } from './drawer.context';
import { useDrawerContext } from './drawer.context.hook';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('useDrawerContext', () => {
  it('returns expected context', () => {
    const contextMock: IDrawerContext = {
      drawerState: defaultDrawerState,
      drawerDispatch: expect.any(Function),
    };
    useContextMock.mockReturnValue(contextMock);

    const context: IDrawerContext = useDrawerContext();
    expect(context).toEqual(contextMock);
  });
});

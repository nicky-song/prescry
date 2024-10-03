// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import { IReduxContext, ReduxContext } from './redux.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  createContext: jest.fn().mockReturnValue({}),
}));
const createContextMock = createContext as jest.Mock;

describe('ReduxContext', () => {
  it('creates context', () => {
    expect(ReduxContext).toBeDefined();

    const expectedContext: IReduxContext = {
      getState: expect.any(Function),
      dispatch: expect.any(Function),
    };
    expect(createContextMock).toHaveBeenCalledWith(expectedContext);
  });
});

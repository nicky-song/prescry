// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { useReduxContext } from './use-redux-context.hook';
import { IReduxContext } from './redux.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('useReduxContext', () => {
  it('returns expected context', () => {
    const contextMock: IReduxContext = {
      getState: jest.fn(),
      dispatch: jest.fn(),
    };
    useContextMock.mockReturnValue(contextMock);

    const context: IReduxContext = useReduxContext();
    expect(context).toEqual(contextMock);
  });
});

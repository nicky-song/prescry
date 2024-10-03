// Copyright 2022 Prescryptive Health, Inc.

import { useContext } from 'react';
import { defaultLoadingState } from '../../store/loading/loading.state';
import { ILoadingContext } from './loading.context';
import { useLoadingContext } from './use-loading-context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('useLoadingContext', () => {
  it('returns expected context', () => {
    const contextMock: ILoadingContext = {
      loadingState: defaultLoadingState,
    };
    useContextMock.mockReturnValue(contextMock);

    const context: ILoadingContext = useLoadingContext();
    expect(context).toEqual(contextMock);
  });
});

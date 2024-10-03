// Copyright 2022 Prescryptive Health, Inc.

import { createContext } from 'react';
import { defaultLoadingState } from '../../store/loading/loading.state';
import { LoadingContext, ILoadingContext } from './loading.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  createContext: jest.fn().mockReturnValue({}),
}));
const createContextMock = createContext as jest.Mock;

describe('LoadingContext', () => {
  it('creates context', () => {
    expect(LoadingContext).toBeDefined();

    const expectedContext: ILoadingContext = {
      loadingState: defaultLoadingState,
    };
    expect(createContextMock).toHaveBeenCalledWith(expectedContext);
  });
});

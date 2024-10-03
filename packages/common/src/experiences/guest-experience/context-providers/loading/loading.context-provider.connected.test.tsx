// Copyright 2022 Prescryptive Health, Inc.

import { RootState } from '../../store/root-reducer';
import { ILoadingContextProviderProps } from './loading.context-provider';
import { mapStateToProps } from './loading.context-provider.connected';

describe('LoadingContextProviderConnected', () => {
  it('maps state', () => {
    const mappedProps: Partial<ILoadingContextProviderProps> = mapStateToProps({
      loading: {
        count: 0,
      },
    } as RootState);

    const expectedProps: Partial<ILoadingContextProviderProps> = {
      loadingState: { count: 0 },
    };
    expect(mappedProps).toEqual(expectedProps);
  });
});

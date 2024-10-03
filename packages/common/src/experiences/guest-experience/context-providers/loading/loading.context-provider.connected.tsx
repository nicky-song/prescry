// Copyright 2022 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { ILoadingState } from '../../state/loading/loading.state';
import { RootState } from '../../store/root-reducer';
import { LoadingContextProvider } from './loading.context-provider';
import { ILoadingContextProviderProps } from './loading.context-provider';

export const mapStateToProps = (
  state: RootState
): Partial<ILoadingContextProviderProps> => {
  const { loading }: { loading: ILoadingState } = state;

  return {
    loadingState: loading,
  };
};

export const LoadingContextProviderConnected = connect(
  mapStateToProps,
  undefined
)(LoadingContextProvider);

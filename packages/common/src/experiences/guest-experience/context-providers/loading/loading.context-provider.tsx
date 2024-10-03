// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import {
  defaultLoadingState,
  ILoadingState,
} from '../../state/loading/loading.state';
import { LoadingContext } from './loading.context';

export interface ILoadingContextProviderProps {
  loadingState?: ILoadingState;
  children?: ReactNode;
}
export const LoadingContextProvider = ({
  children,
  loadingState = defaultLoadingState,
}: ILoadingContextProviderProps): ReactElement => {
  return (
    <LoadingContext.Provider
      value={{
        loadingState,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

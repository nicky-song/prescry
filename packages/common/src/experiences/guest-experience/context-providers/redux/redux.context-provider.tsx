// Copyright 2021 Prescryptive Health, Inc.

import React, { Dispatch, FunctionComponent } from 'react';
import { ReduxContext } from './redux.context';
import { RootState } from '../../store/root-reducer';

export interface IReduxContextProviderProps {
  getState: () => RootState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: Dispatch<any>;
}

export const ReduxContextProvider: FunctionComponent<
  IReduxContextProviderProps
> = ({ children, getState, dispatch }) => {
  return (
    <ReduxContext.Provider
      value={{
        getState,
        dispatch,
      }}
    >
      {children}
    </ReduxContext.Provider>
  );
};

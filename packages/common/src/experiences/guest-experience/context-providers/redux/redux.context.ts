// Copyright 2021 Prescryptive Health, Inc.

import { createContext, Dispatch } from 'react';
import { RootState } from '../../store/root-reducer';

export type ReduxDispatch = Dispatch<unknown>;
export type ReduxGetState = () => RootState;

export interface IReduxContext {
  readonly getState: ReduxGetState;
  readonly dispatch: ReduxDispatch;
}

export const ReduxContext = createContext<IReduxContext>({
  getState: () => ({} as RootState),
  dispatch: () => {
    return;
  },
});

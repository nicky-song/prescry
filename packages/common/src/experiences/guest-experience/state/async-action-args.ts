// Copyright 2021 Prescryptive Health, Inc.

import {
  ReduxDispatch,
  ReduxGetState,
} from '../context-providers/redux/redux.context';

export interface IAsyncActionArgs {
  reduxDispatch: ReduxDispatch;
  reduxGetState: ReduxGetState;
}

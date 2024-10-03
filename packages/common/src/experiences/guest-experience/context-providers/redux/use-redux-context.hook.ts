// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { IReduxContext, ReduxContext } from './redux.context';

export const useReduxContext = (): IReduxContext => useContext(ReduxContext);

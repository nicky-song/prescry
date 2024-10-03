// Copyright 2022 Prescryptive Health, Inc.

import React, { FunctionComponent, useReducer } from 'react';
import { DrawerContext } from './drawer.context';
import { defaultDrawerState } from '../../state/drawer/drawer.state';
import {
  DrawerReducer,
  drawerReducer,
} from '../../state/drawer/drawer.reducer';

export const DrawerContextProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer<DrawerReducer>(
    drawerReducer,
    defaultDrawerState
  );
  return (
    <DrawerContext.Provider
      value={{
        drawerState: state,
        drawerDispatch: dispatch,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

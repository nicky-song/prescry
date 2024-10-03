// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent, useReducer } from 'react';
import { PastProceduresContext } from './past-procedures.context';
import {
  pastProceduresReducer,
  PastProceduresReducer,
} from '../../state/past-procedures/past-procedures.reducer';
import { defaultPastProceduresState } from '../../state/past-procedures/past-procedures.state';

export const PastProceduresContextProvider: FunctionComponent = ({
  children,
}) => {
  const [state, dispatch] = useReducer<PastProceduresReducer>(
    pastProceduresReducer,
    defaultPastProceduresState
  );
  return (
    <PastProceduresContext.Provider
      value={{
        pastProceduresState: state,
        pastProceduresDispatch: dispatch,
      }}
    >
      {children}
    </PastProceduresContext.Provider>
  );
};

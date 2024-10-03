// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent, useReducer } from 'react';
import {
  drugSearchReducer,
  DrugSearchReducer,
} from '../../state/drug-search/drug-search.reducer';
import { defaultDrugSearchState } from '../../state/drug-search/drug-search.state';
import { DrugSearchContext } from './drug-search.context';

export const DrugSearchContextProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer<DrugSearchReducer>(
    drugSearchReducer,
    defaultDrugSearchState
  );
  return (
    <DrugSearchContext.Provider
      value={{
        drugSearchState: state,
        drugSearchDispatch: dispatch,
      }}
    >
      {children}
    </DrugSearchContext.Provider>
  );
};

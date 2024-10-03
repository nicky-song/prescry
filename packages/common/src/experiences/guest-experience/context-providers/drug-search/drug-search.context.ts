// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import { DrugSearchDispatch } from '../../state/drug-search/dispatch/drug-search.dispatch';
import {
  defaultDrugSearchState,
  IDrugSearchState,
} from '../../state/drug-search/drug-search.state';

export interface IDrugSearchContext {
  readonly drugSearchState: IDrugSearchState;
  readonly drugSearchDispatch: DrugSearchDispatch;
}

export const DrugSearchContext = createContext<IDrugSearchContext>({
  drugSearchState: defaultDrugSearchState,
  drugSearchDispatch: () => {
    return;
  },
});

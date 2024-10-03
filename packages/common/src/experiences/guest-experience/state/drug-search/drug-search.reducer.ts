// Copyright 2021 Prescryptive Health, Inc.

import { Reducer } from 'react';
import { DrugSearchAction } from './actions/drug-search.action';
import { IDrugSearchState } from './drug-search.state';

export type DrugSearchReducer = Reducer<IDrugSearchState, DrugSearchAction>;

export const drugSearchReducer: DrugSearchReducer = (
  state: IDrugSearchState,
  action: DrugSearchAction
): IDrugSearchState => {
  switch (action.type) {
    case 'ADD_TO_SOURCE_PHARMACIES': {
      const newSourcePharmacies = action.payload.sourcePharmacies;
      const drugSearchState: IDrugSearchState = { ...state };
      drugSearchState.sourcePharmacies = newSourcePharmacies
        ? state.sourcePharmacies.concat(newSourcePharmacies)
        : state.sourcePharmacies;
      return drugSearchState;
    }
    case 'SET_DRUG_SEARCH_RESULTS': {
      const payloadTimeStamp = action.payload.timeStamp;
      if (
        state.selectedDrug ||
        (payloadTimeStamp && payloadTimeStamp < state.timeStamp)
      ) {
        return {
          ...state,
        };
      }
      return { ...state, ...action.payload };
    }
    default:
      return { ...state, ...action.payload };
  }
};

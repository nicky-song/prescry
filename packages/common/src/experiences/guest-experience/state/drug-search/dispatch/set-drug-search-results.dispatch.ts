// Copyright 2021 Prescryptive Health, Inc.

import { DrugSearchDispatch } from './drug-search.dispatch';
import { setDrugSearchResultsAction } from '../actions/set-drug-search-results.action';
import { IDrugSearchResult } from '../../../../../models/drug-search-response';

export const setDrugSearchResultsDispatch = (
  dispatch: DrugSearchDispatch,
  drugSearchResult: IDrugSearchResult[],
  currentTimeStamp: number
): void => {
  dispatch(setDrugSearchResultsAction(drugSearchResult, currentTimeStamp));
};

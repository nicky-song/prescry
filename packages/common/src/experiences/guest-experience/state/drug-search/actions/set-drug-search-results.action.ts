// Copyright 2021 Prescryptive Health, Inc.

import { IDrugSearchResult } from '../../../../../models/drug-search-response';
import { IDrugSearchAction } from './drug-search.action';

export type ISetDrugSearchResultsAction = IDrugSearchAction<
  'SET_DRUG_SEARCH_RESULTS'
>;

export const setDrugSearchResultsAction = (
  drugSearchResults: IDrugSearchResult[],
  currentTimeStamp: number
): ISetDrugSearchResultsAction => ({
  type: 'SET_DRUG_SEARCH_RESULTS',
  payload: {
    drugSearchResults,
    pharmacies: [],
    bestPricePharmacy: undefined,
    errorMessage: undefined,
    selectedDrug: undefined,
    selectedConfiguration: undefined,
    timeStamp: currentTimeStamp,
  },
});

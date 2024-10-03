// Copyright 2021 Prescryptive Health, Inc.

import { IDrugConfiguration } from '../../../../../models/drug-configuration';
import { IDrugSearchResult } from '../../../../../models/drug-search-response';
import { IDrugSearchAction } from './drug-search.action';

export type ISetSelectedDrugAction = IDrugSearchAction<'SET_SELECTED_DRUG'>;

export const setSelectedDrugAction = (
  selectedDrug?: IDrugSearchResult,
  defaultConfiguration?: IDrugConfiguration
): ISetSelectedDrugAction => ({
  type: 'SET_SELECTED_DRUG',
  payload: {
    selectedDrug,
    selectedConfiguration: defaultConfiguration,
    pharmacies: [],
    bestPricePharmacy: undefined,
    errorMessage: undefined,
  },
});

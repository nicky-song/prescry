// Copyright 2021 Prescryptive Health, Inc.

import { DrugSearchDispatch } from './drug-search.dispatch';
import { IDrugConfiguration } from '../../../../../models/drug-configuration';
import { IDrugSearchResult } from '../../../../../models/drug-search-response';
import { setSelectedDrugAction } from '../actions/set-selected-drug.action';

export const setSelectedDrugDispatch = (
  dispatch: DrugSearchDispatch,
  selectedDrug?: IDrugSearchResult,
  defaultConfiguration?: IDrugConfiguration
): void => {
  dispatch(setSelectedDrugAction(selectedDrug, defaultConfiguration));
};

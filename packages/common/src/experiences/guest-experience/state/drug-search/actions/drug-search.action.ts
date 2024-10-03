// Copyright 2021 Prescryptive Health, Inc.

import { IDrugSearchState } from '../drug-search.state';

type ActionKeys =
  | 'SET_DRUG_SEARCH_RESULTS'
  | 'SET_DRUG_PRICE_RESULTS'
  | 'DRUG_PRICE_LOCATION_SET'
  | 'SET_SELECTED_CONFIGURATION'
  | 'SET_SELECTED_DRUG'
  | 'SET_SELECTED_PHARMACY'
  | 'SET_PHARMACIES'
  | 'SET_CREATE_ACCOUNT_ERROR'
  | 'SET_SELECTED_SOURCE_PHARMACY'
  | 'ADD_TO_SOURCE_PHARMACIES'
  | 'SET_INVALID_ZIP_ERROR_MESSAGE'
  | 'SET_NO_PHARMACY_ERROR'
  | 'SET_IS_GETTING_PHARMACIES'
  | 'SET_LOCATION_DENIED_ERROR_MESSAGE';

export interface IDrugSearchAction<T extends ActionKeys> {
  readonly type: T;
  readonly payload: Partial<IDrugSearchState>;
}

export type DrugSearchAction = IDrugSearchAction<ActionKeys>;

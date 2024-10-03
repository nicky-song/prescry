// Copyright 2021 Prescryptive Health, Inc.

import { IDrugConfiguration } from '../../../../../models/drug-configuration';
import { IDrugSearchAction } from './drug-search.action';

export type ISetSelectedConfigurationAction = IDrugSearchAction<
  'SET_SELECTED_CONFIGURATION'
>;

export const setSelectedConfigurationAction = (
  selectedConfiguration: IDrugConfiguration
): ISetSelectedConfigurationAction => ({
  type: 'SET_SELECTED_CONFIGURATION',
  payload: { selectedConfiguration },
});

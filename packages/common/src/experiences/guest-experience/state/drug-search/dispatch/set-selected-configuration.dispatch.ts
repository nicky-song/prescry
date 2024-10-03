// Copyright 2021 Prescryptive Health, Inc.

import { DrugSearchDispatch } from './drug-search.dispatch';
import { setSelectedConfigurationAction } from '../actions/set-selected-configuration.action';
import { IDrugConfiguration } from '../../../../../models/drug-configuration';

export const setSelectedConfigurationDispatch = (
  dispatch: DrugSearchDispatch,
  selectedConfiguration: IDrugConfiguration
): void => {
  dispatch(setSelectedConfigurationAction(selectedConfiguration));
};

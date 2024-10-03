// Copyright 2021 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import { IDrugInformationItem } from '../../../../models/api-response/drug-information-response';
import { IGetDrugInformationResponseAction } from './actions/get-drug-information-response.action';

export interface IDrugInformationState {
  readonly drug?: IDrugInformationItem;
}

export const defaultDrugInformationState: IDrugInformationState = {};

export const drugInformationReducer: Reducer<
  IDrugInformationState,
  IGetDrugInformationResponseAction
> = (
  state: IDrugInformationState = defaultDrugInformationState,
  action: IGetDrugInformationResponseAction
) => {
  switch (action.type) {
    case 'DRUG_INFORMATION_RESPONSE':
      return {
        ...state,
        drug: action.payload,
      };
  }

  return state;
};

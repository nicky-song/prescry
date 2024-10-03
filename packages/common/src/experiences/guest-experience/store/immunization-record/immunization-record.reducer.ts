// Copyright 2020 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import { IImmunizationRecord } from '../../../../models/api-response/immunization-record-response';
import { IGetImmunizationRecordResponseAction } from './actions/get-immunization-record-response.action';

export interface IImmunizationRecordState {
  readonly immunizationRecord?: IImmunizationRecord[];
}

export const defaultImmunizationRecordState: IImmunizationRecordState = {
  immunizationRecord: [],
};

export const immunizationRecordReducer: Reducer<
  IImmunizationRecordState,
  IGetImmunizationRecordResponseAction
> = (
  state: IImmunizationRecordState = defaultImmunizationRecordState,
  action: IGetImmunizationRecordResponseAction
): IImmunizationRecordState => {
  switch (action.type) {
    case 'IMMUNIZATION_RECORD_RESPONSE':
      return {
        ...state,
        immunizationRecord: action.payload,
      };
  }

  return state;
};

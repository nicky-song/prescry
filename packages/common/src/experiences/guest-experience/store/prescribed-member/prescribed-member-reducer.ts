// Copyright 2018 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import {
  PrescribedMemberActionKeys,
  PrescribedMemberActionTypes,
} from './prescribed-member-reducer.actions';

export interface IPrescribedMemberState {
  firstName?: string;
  dateOfBirth?: string;
  lastName?: string;
  isPrimary?: boolean;
  identifier?: string;
}

export const DefaultPrescribedMemberState: IPrescribedMemberState = {
  firstName: undefined,
  identifier: undefined,
  isPrimary: false,
  lastName: undefined,
};

export const prescribedMemberReducer: Reducer<
  IPrescribedMemberState,
  PrescribedMemberActionTypes
> = (
  state: IPrescribedMemberState = DefaultPrescribedMemberState,
  action: PrescribedMemberActionTypes
) => {
  switch (action.type) {
    case PrescribedMemberActionKeys.SET_PRESCRIBED_MEMBER_DETAILS:
      return {
        ...state,
        ...action.payload,
      };
  }
  return state;
};

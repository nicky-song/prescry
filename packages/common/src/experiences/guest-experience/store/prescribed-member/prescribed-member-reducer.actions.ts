// Copyright 2018 Prescryptive Health, Inc.

import { IPrescribedMemberState } from './prescribed-member-reducer';

export enum PrescribedMemberActionKeys {
  SET_PRESCRIBED_MEMBER_DETAILS = 'SET_PRESCRIBED_MEMBER_DETAILS',
}

export interface ISetPrescribedMemberDetailsAction {
  type: PrescribedMemberActionKeys.SET_PRESCRIBED_MEMBER_DETAILS;
  payload: IPrescribedMemberState;
}

export type PrescribedMemberActionTypes = ISetPrescribedMemberDetailsAction;

export const setPrescribedMemberDetailsAction = (
  memberDetails: IPrescribedMemberState
): ISetPrescribedMemberDetailsAction => {
  return {
    payload: memberDetails,
    type: PrescribedMemberActionKeys.SET_PRESCRIBED_MEMBER_DETAILS,
  };
};

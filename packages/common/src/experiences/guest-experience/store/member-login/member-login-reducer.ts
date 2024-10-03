// Copyright 2018 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import {
  MemberLoginActionTypes,
  MemberLoginStateActionKeys,
} from './member-login-reducer.actions';

export interface IMemberLoginState {
  firstName?: string;
  lastName?: string;
  primaryMemberRxId?: string;
  dateOfBirth?: string;
  isTermAccepted?: boolean;
  errorMessage?: string;
  emailAddress?: string;
  claimAlertId?: string;
  prescriptionId?: string;
  isBlockchain?: boolean;
}
export const DefaultMemberLoginState: IMemberLoginState = {};
export const memberLoginReducer: Reducer<
  IMemberLoginState,
  MemberLoginActionTypes
> = (
  state: IMemberLoginState = DefaultMemberLoginState,
  action: MemberLoginActionTypes
) => {
  switch (action.type) {
    case MemberLoginStateActionKeys.SET_MEMBER_LOGIN_INFO:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

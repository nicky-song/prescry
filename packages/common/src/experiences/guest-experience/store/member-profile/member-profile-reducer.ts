// Copyright 2021 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import { ISetMemberProfileAction } from './actions/set-member-profile.action';
import { MemberProfileActionKeysEnum } from './actions/member-profile.action';
import {
  ILimitedAccount,
  IProfile,
} from '../../../../models/member-profile/member-profile-info';
import { ISetMemberInfoRequestIdAction } from '../telemetry/telemetry-reducer.actions';

export interface IMemberProfileState {
  readonly account: ILimitedAccount;
  readonly profileList: IProfile[];
}

export const defaultMemberProfileState: IMemberProfileState = {
  account: { phoneNumber: '', favoritedPharmacies: [] },
  profileList: [],
};

export type IMemberProfileActionTypes =
  | ISetMemberProfileAction
  | ISetMemberInfoRequestIdAction;
export type MemberProfileReducer = Reducer<
  IMemberProfileState,
  IMemberProfileActionTypes
>;

export const memberProfileReducer: MemberProfileReducer = (
  state: IMemberProfileState = defaultMemberProfileState,
  action: IMemberProfileActionTypes
) => {
  switch (action.type) {
    case MemberProfileActionKeysEnum.SET_MEMBER_PROFILE:
      return { ...state, ...action.payload };
  }
  return state;
};

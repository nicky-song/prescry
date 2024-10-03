// Copyright 2018 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import {
  IDispatchContactInfoActionsType,
  MemberListInfoActionKeys,
} from './member-list-info-reducer.actions';
import { IMemberContactInfo } from '../../../../models/member-info/member-contact-info';

export interface IMemberListInfoState {
  loggedInMember: IMemberContactInfo;
  childMembers: IMemberContactInfo[];
  adultMembers: IMemberContactInfo[];
  isMember: boolean;
}
export const DefaultContactInfoState: IMemberListInfoState = {
  adultMembers: [],
  childMembers: [],
  loggedInMember: { rxGroupType: 'CASH' },
  isMember: false,
};
export interface ISelectedMemberContactInfo {
  readonly selectedMember: IMemberContactInfo;
}
export const memberListInfoReducer: Reducer<
  IMemberListInfoState,
  IDispatchContactInfoActionsType
> = (
  state: IMemberListInfoState = DefaultContactInfoState,
  action: IDispatchContactInfoActionsType
) => {
  switch (action.type) {
    case MemberListInfoActionKeys.SET_MEMBER_LIST_INFO:
      return { ...state, ...action.payload };
  }
  return state;
};

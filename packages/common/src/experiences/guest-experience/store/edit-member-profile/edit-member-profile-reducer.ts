// Copyright 2018 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import {
  EditMemberProfileActionKeys,
  EditMemberProfileActionTypes,
} from './edit-member-profile-reducer.actions';
import {
  IDependentProfile,
  IPrimaryProfile,
} from '../../../../models/member-profile/member-profile-info';

export interface IEditMemberProfileState {
  isAdult?: boolean;
  memberInfo: IPrimaryProfile | IDependentProfile;
  secondaryUser?: IDependentProfile;
}

export const DefaultEditMemberProfileState: IEditMemberProfileState = {
  isAdult: false,
  memberInfo: {} as IPrimaryProfile,
  secondaryUser: undefined,
};

export const editMemberProfileReducer: Reducer<
  IEditMemberProfileState,
  EditMemberProfileActionTypes
> = (
  state: IEditMemberProfileState = DefaultEditMemberProfileState,
  action: EditMemberProfileActionTypes
) => {
  switch (action.type) {
    case EditMemberProfileActionKeys.SET_SELECTED_MEMBER:
      return { ...state, ...action.payload };
    case EditMemberProfileActionKeys.UPDATE_SELECTED_MEMBER_INFO:
      return { ...state, ...action.payload };
    case EditMemberProfileActionKeys.SET_EDIT_MEMBER_PROFILE_ERROR:
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
      };
  }
  return state;
};

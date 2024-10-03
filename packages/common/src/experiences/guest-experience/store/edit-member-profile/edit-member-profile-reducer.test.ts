// Copyright 2018 Prescryptive Health, Inc.

import { IPrimaryProfile } from '../../../../models/member-profile/member-profile-info';
import {
  DefaultEditMemberProfileState,
  editMemberProfileReducer,
  IEditMemberProfileState,
} from './edit-member-profile-reducer';
import {
  EditMemberProfileActionKeys,
  EditMemberProfileActionTypes,
  ISetSelectedMemberAction,
  IUpdateSelectedMemberInfoAction,
} from './edit-member-profile-reducer.actions';

const initialState: IEditMemberProfileState = {
  memberInfo: {} as IPrimaryProfile,
};

describe('editMemberProfileReducer', () => {
  it('should SET_SELECTED_MEMBER', () => {
    const action: ISetSelectedMemberAction = {
      payload: {
        memberInfo: {
          email: 'new_email',
          phoneNumber: 'new_mobile',
          rxGroupType: 'SIE',
          rxSubGroup: 'HMA01',
          firstName: 'fake_firstName',
          lastName: 'fake_lastName',
          identifier: 'fake-identifier',
          dateOfBirth: '2000-01-01',
          primaryMemberRxId: 'fake_primaryMemberRxId',
        },
      },
      type: EditMemberProfileActionKeys.SET_SELECTED_MEMBER,
    };
    const state = editMemberProfileReducer(
      initialState,
      action
    ) as IEditMemberProfileState;
    expect(state.memberInfo.email).toBe(action.payload.memberInfo.email);
    expect(state.memberInfo.phoneNumber).toBe(
      action.payload.memberInfo.phoneNumber
    );
  });

  it('should UPDATE_SELECTED_MEMBER_INFO', () => {
    const action: IUpdateSelectedMemberInfoAction = {
      payload: {
        memberInfo: {
          email: 'fake_email',
          firstName: 'fake_firstName',
          lastName: 'fake_lastName',
          identifier: 'fake-identifier',
          phoneNumber: 'fake_phoneNumber',
          primaryMemberRxId: 'fake_primaryMemberRxId',
          rxGroupType: 'SIE',
          rxSubGroup: 'HMA01',
          dateOfBirth: '2000-01-01',
        },
      },
      type: EditMemberProfileActionKeys.UPDATE_SELECTED_MEMBER_INFO,
    };
    const state = editMemberProfileReducer(
      initialState,
      action
    ) as IEditMemberProfileState;
    expect(state.memberInfo.email).toBe(action.payload.memberInfo.email);
    expect(state.memberInfo.phoneNumber).toBe(
      action.payload.memberInfo.phoneNumber
    );
  });

  it('should return DefaultEditMemberProfileState when state is not defined', () => {
    const action = {
      payload: undefined,
      type: undefined,
    } as unknown as EditMemberProfileActionTypes;
    const state = editMemberProfileReducer(
      undefined,
      action
    ) as IEditMemberProfileState;
    expect(state).toEqual(DefaultEditMemberProfileState);
  });
});

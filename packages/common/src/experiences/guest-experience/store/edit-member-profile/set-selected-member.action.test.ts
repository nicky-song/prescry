// Copyright 2018 Prescryptive Health, Inc.

import { IEditMemberProfileState } from './edit-member-profile-reducer';
import {
  EditMemberProfileActionKeys,
  setSelectedMemberAction,
} from './edit-member-profile-reducer.actions';

describe('setSelectedMemberAction', () => {
  it('should issue SET_SELECTED_MEMBER action', () => {
    const fakeSelectedMember: IEditMemberProfileState = {
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
    };
    expect(setSelectedMemberAction(fakeSelectedMember)).toEqual({
      payload: fakeSelectedMember,
      type: EditMemberProfileActionKeys.SET_SELECTED_MEMBER,
    });
  });
});

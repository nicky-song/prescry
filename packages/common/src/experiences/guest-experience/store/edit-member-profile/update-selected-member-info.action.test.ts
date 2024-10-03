// Copyright 2018 Prescryptive Health, Inc.

import { IEditMemberProfileState } from './edit-member-profile-reducer';
import {
  EditMemberProfileActionKeys,
  updateSelectedMemberInfoAction,
} from './edit-member-profile-reducer.actions';

describe('updateSelectedMemberInfoAction', () => {
  it('should issue UPDATE_SELECTED_MEMBER_INFO action', () => {
    const fakeMember: IEditMemberProfileState = {
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
    expect(updateSelectedMemberInfoAction(fakeMember)).toEqual({
      payload: fakeMember,
      type: EditMemberProfileActionKeys.UPDATE_SELECTED_MEMBER_INFO,
    });
  });
});

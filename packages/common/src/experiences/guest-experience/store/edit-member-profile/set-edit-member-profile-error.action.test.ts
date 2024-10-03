// Copyright 2018 Prescryptive Health, Inc.

import {
  EditMemberProfileActionKeys,
  setEditMemberProfileErrorAction,
} from './edit-member-profile-reducer.actions';

describe('setEditMemberProfileErrorAction', () => {
  it('should issue SET_EDIT_MEMBER_PROFILE_ERROR action', () => {
    expect(setEditMemberProfileErrorAction('fake_error_message')).toEqual({
      payload: {
        errorMessage: 'fake_error_message',
      },
      type: EditMemberProfileActionKeys.SET_EDIT_MEMBER_PROFILE_ERROR,
    });
  });
});

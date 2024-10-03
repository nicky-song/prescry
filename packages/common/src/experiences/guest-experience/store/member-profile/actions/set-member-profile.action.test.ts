// Copyright 2021 Prescryptive Health, Inc.

import { ILimitedAccount } from '../../../../../models/member-profile/member-profile-info';
import { profileListMock } from '../../../__mocks__/profile-list.mock';

import {
  ISetMemberProfileActionPayload,
  setMemberProfileAction,
} from './set-member-profile.action';

describe('setMemberProfileAction', () => {
  it('returns action', () => {
    const accountMock: ILimitedAccount = {
      firstName: 'fake-first',
      lastName: 'fake-last',
      dateOfBirth: '01-01-2000',
      phoneNumber: 'fake-phone',
      recoveryEmail: 'test@test.com',
      favoritedPharmacies: [],
    };

    const data: ISetMemberProfileActionPayload = {
      account: accountMock,
      profileList: profileListMock,
    };

    const action = setMemberProfileAction(data);
    expect(action.type).toEqual('SET_MEMBER_PROFILE');
    expect(action.payload).toEqual(data);
  });
});

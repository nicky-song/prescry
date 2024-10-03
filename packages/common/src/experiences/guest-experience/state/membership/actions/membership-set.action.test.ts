// Copyright 2021 Prescryptive Health, Inc.

import { IMemberInfoResponseData } from '../../../../../models/api-response/member-info-response';
import { ILimitedAccount } from '../../../../../models/member-profile/member-profile-info';
import { profileListMock } from '../../../__mocks__/profile-list.mock';
import { IMembershipState } from '../membership.state';
import { membershipSetAction } from './membership-set.action';

const accountMock: ILimitedAccount = {
  firstName: 'fake-first',
  lastName: 'fake-last',
  dateOfBirth: '01-01-2000',
  phoneNumber: 'fake-phone',
  recoveryEmail: 'test@test.com',
  favoritedPharmacies: [],
};

const mockMembership: IMemberInfoResponseData = {
  account: accountMock,
  profileList: profileListMock,
};

describe('membershipSetAction', () => {
  it('returns action', () => {
    const action = membershipSetAction(mockMembership);
    expect(action.type).toEqual('SET_MEMBERSHIP');

    const expectedPayload: Partial<IMembershipState> = {
      account: accountMock,
      profileList: profileListMock,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});

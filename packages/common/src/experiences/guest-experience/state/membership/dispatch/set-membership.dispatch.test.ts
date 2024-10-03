// Copyright 2021 Prescryptive Health, Inc.

import { IMemberInfoResponseData } from '../../../../../models/api-response/member-info-response';
import { ILimitedAccount } from '../../../../../models/member-profile/member-profile-info';
import { profileListMock } from '../../../__mocks__/profile-list.mock';
import { membershipSetAction } from '../actions/membership-set.action';
import { setMembershipDispatch } from './set-membership.dispatch';

const accountMock: ILimitedAccount = {
  firstName: 'fake-first',
  lastName: 'fake-last',
  dateOfBirth: '01-01-2000',
  phoneNumber: 'fake-phone',
  recoveryEmail: 'test@test.com',
  favoritedPharmacies: [],
};

const responseMock: IMemberInfoResponseData = {
  account: accountMock,
  profileList: profileListMock,
};

describe('setMembershipDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setMembershipDispatch(dispatchMock, responseMock);

    const expectedAction = membershipSetAction(responseMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});

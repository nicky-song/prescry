// Copyright 2021 Prescryptive Health, Inc.

import { IMemberInfoResponse } from '../../../../../models/api-response/member-info-response';
import { ILimitedAccount } from '../../../../../models/member-profile/member-profile-info';
import { expectToHaveBeenCalledOnceOnlyWith } from '../../../../../testing/test.helper';
import { profileListMock } from '../../../__mocks__/profile-list.mock';
import { setMemberProfileDispatch } from './set-member-profile.dispatch';
import { storeMemberProfileApiResponseDispatch } from './store-member-profile-api-response.dispatch';

jest.mock('./set-member-profile.dispatch', () => ({
  setMemberProfileDispatch: jest.fn(),
}));
const setMemberProfileDispatchMock = setMemberProfileDispatch as jest.Mock;

describe('storeMemberProfileApiResponseDispatch', () => {
  beforeEach(() => {
    setMemberProfileDispatchMock.mockReset();
  });

  it('dispatches to set profile info', async () => {
    const accountMock: ILimitedAccount = {
      firstName: 'fake-first',
      lastName: 'fake-last',
      dateOfBirth: '01-01-2000',
      phoneNumber: 'fake-phone',
      recoveryEmail: 'test@test.com',
      favoritedPharmacies: [],
    };

    const response: IMemberInfoResponse = {
      data: {
        account: accountMock,
        profileList: profileListMock,
      },
      message: 'success',
      status: 'ok',
    };

    const dispatch = jest.fn();
    await storeMemberProfileApiResponseDispatch(dispatch, response);

    expectToHaveBeenCalledOnceOnlyWith(
      setMemberProfileDispatchMock,
      dispatch,
      response.data
    );
  });
});

// Copyright 2021 Prescryptive Health, Inc.

import { IMemberInfoResponse } from '../../../../models/api-response/member-info-response';
import { ILimitedAccount } from '../../../../models/member-profile/member-profile-info';
import { profileListMock } from '../../__mocks__/profile-list.mock';
import { ensureGetMemberProfileResponse } from './ensure-get-member-profile-response';

const mockURL = 'url';

describe('ensureGetMemberProfileResponse()', () => {
  it('should return responseJson if response data is valid', () => {
    const accountMock: ILimitedAccount = {
      firstName: 'fake-first',
      lastName: 'fake-last',
      dateOfBirth: '01-01-2000',
      phoneNumber: 'fake-phone',
      recoveryEmail: 'test@test.com',
      favoritedPharmacies: [],
    };

    const mockResponseJson: IMemberInfoResponse = {
      data: {
        account: accountMock,
        profileList: profileListMock,
      },
      message: '',
      status: 'success',
    };

    const result = ensureGetMemberProfileResponse(mockResponseJson, mockURL);
    expect(result).toEqual(mockResponseJson);
  });
});

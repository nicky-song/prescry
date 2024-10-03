// Copyright 2018 Prescryptive Health, Inc.

import {
  IDependentProfile,
  IPrimaryProfile,
} from '../../../../../models/member-profile/member-profile-info';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { setSelectedMemberAction } from '../edit-member-profile-reducer.actions';
import { editMemberProfileScreenDispatch } from './edit-member-profile-screen.dispatch';

jest.mock('../edit-member-profile-reducer.actions', () => ({
  setSelectedMemberAction: jest.fn(),
}));

describe('editMemberProfileScreenDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set selected member and navigate to edit screen', () => {
    const memberInfo: IPrimaryProfile = {
      rxGroupType: 'SIE',
      rxSubGroup: 'HMA01',
      firstName: 'firstName',
      identifier: '6000b2fa965fa7b37c00a7b2',
      isLimited: false,
      isPhoneNumberVerified: true,
      isPrimary: true,
      lastName: 'lastName',
      phoneNumber: '1234567890',
      primaryMemberFamilyId: 'T12345',
      primaryMemberPersonCode: '01',
      primaryMemberRxId: 'T1234501',
      dateOfBirth: '2000-01-01',
      age: 30,
    };
    const secondaryUser: IDependentProfile = {
      rxGroupType: 'SIE',
      rxSubGroup: 'HMA01',
      firstName: 'firstChildName',
      identifier: '6000b2fa965fa7b37c00h46d',
      isLimited: false,
      isPrimary: false,
      lastName: 'lastChildName',
    };
    const isAdult = true;

    const dispatchMock = jest.fn();
    editMemberProfileScreenDispatch(
      dispatchMock,
      rootStackNavigationMock,
      memberInfo,
      isAdult,
      secondaryUser
    );

    const expectedAction = setSelectedMemberAction({
      isAdult,
      memberInfo,
      secondaryUser,
    });
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'EditMemberProfile'
    );
  });
});

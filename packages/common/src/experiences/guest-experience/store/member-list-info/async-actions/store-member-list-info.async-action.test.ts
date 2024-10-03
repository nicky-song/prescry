// Copyright 2018 Prescryptive Health, Inc.

import {
  ILimitedAccount,
  IPrimaryProfile,
  IDependentProfile,
} from '../../../../../models/member-profile/member-profile-info';
import { IEditMemberProfileState } from '../../edit-member-profile/edit-member-profile-reducer';
import { IMemberProfileState } from '../../member-profile/member-profile-reducer';
import { RootState } from '../../root-reducer';
import { updateCurrentMembersInfoDispatch } from '../dispatch/update-current-members-info.dispatch';
import { updateSecondaryMembersInfoDispatch } from '../dispatch/update-secondary-members-info.dispatch';

import { storeMemberListInfoAsyncAction } from './store-member-list-info.async-action';

jest.mock('../dispatch/update-current-members-info.dispatch');

jest.mock('../dispatch/update-secondary-members-info.dispatch');

const updateCurrentMembersInfoDispatchMock =
  updateCurrentMembersInfoDispatch as jest.Mock;
const updateSecondaryMembersInfoDispatchMock =
  updateSecondaryMembersInfoDispatch as jest.Mock;

describe('storeMemberListInfoAsyncAction', () => {
  const accountMock: ILimitedAccount = {
    firstName: 'fake-first',
    lastName: 'fake-last',
    dateOfBirth: '01-01-2000',
    phoneNumber: 'fake-phone',
    recoveryEmail: 'test@test.com',
    favoritedPharmacies: [],
  };
  const profileListMock = [
    {
      rxGroupType: 'CASH',
      primary: {
        email: '',
        firstName: 'ME',
        identifier: 'mock-id-cash-primary',
        isLimited: false,
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: 'TEST',
        phoneNumber: '',
        primaryMemberFamilyId: 'CA7F7K',
        primaryMemberPersonCode: '03',
        primaryMemberRxId: 'CA7F7K03',
        age: 4,
      } as IPrimaryProfile,
      childMembers: [
        {
          email: '',
          firstName: 'TEST',
          identifier: 'mock-id-cash-child',
          isLimited: false,
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: 'TEST',
          phoneNumber: '',
          primaryMemberFamilyId: 'CA7F7K',
          primaryMemberPersonCode: '03',
          primaryMemberRxId: 'CA7F7K03',
          rxSubGroup: 'CASH01',
          age: 4,
        } as IDependentProfile,
        {
          email: '',
          firstName: 'ADULT',
          identifier: '60013af2965fa7b37c00a7b4',
          isLimited: false,
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: '>18',
          phoneNumber: '',
          primaryMemberFamilyId: 'CA7F7K',
          primaryMemberPersonCode: '05',
          primaryMemberRxId: 'CA7F7K05',
          rxSubGroup: 'CASH01',
          age: 20,
        } as IDependentProfile,
        {
          email: '',
          firstName: 'ADULT',
          identifier: '60130fb83068eb8cecfb055d',
          isLimited: false,
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: '>13<18',
          phoneNumber: '',
          primaryMemberFamilyId: 'CA7F7K',
          primaryMemberPersonCode: '03',
          primaryMemberRxId: 'CA7F7K03',
          rxSubGroup: 'CASH01',
          age: 13,
        } as IDependentProfile,
        {
          email: '',
          firstName: 'CHILD',
          identifier: '60131183057357ba4a28b4dd',
          isLimited: false,
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: '>3',
          phoneNumber: '',
          primaryMemberFamilyId: 'CA7F7K',
          primaryMemberPersonCode: '03',
          primaryMemberRxId: 'CA7F7K03',
          rxSubGroup: 'CASH01',
          age: 4,
        } as IDependentProfile,
      ],
    },
    {
      rxGroupType: 'SIE',
      primary: {
        email: '',
        firstName: 'ME',
        identifier: 'mock-id-sie-primary',
        isLimited: false,
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: 'TEST',
        phoneNumber: '',
        primaryMemberFamilyId: 'CA7F7K',
        primaryMemberPersonCode: '03',
        primaryMemberRxId: 'CA7F7K03',
        age: 24,
        dateOfBirth: '01/01/2000',
      } as IPrimaryProfile,
      childMembers: [
        {
          email: '',
          firstName: 'CHILD',
          identifier: 'mock-id-sie-child',
          isLimited: false,
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: '>3',
          phoneNumber: '',
          primaryMemberFamilyId: 'CA7F7K',
          primaryMemberPersonCode: '03',
          primaryMemberRxId: 'CA7F7K03',
          rxSubGroup: 'CASH01',
          age: 4,
        } as IDependentProfile,
      ],
      adultMembers: [
        {
          email: '',
          firstName: 'TEST',
          identifier: 'mock-id-sie-adult',
          isLimited: false,
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: 'TEST',
          phoneNumber: '',
          primaryMemberFamilyId: 'CA7F7K',
          primaryMemberPersonCode: '03',
          primaryMemberRxId: 'CA7F7K03',
          rxSubGroup: 'CASH01',
          age: 20,
        } as IDependentProfile,
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches updates for primary member profile ', async () => {
    const dispatch = jest.fn();
    const state: RootState = {
      editMemberProfile: {
        secondaryUser: {
          identifier: 'mock-id-sie-adult',
        },
        memberInfo: { identifier: 'mock-id-sie-primary' },
      } as IEditMemberProfileState,
      memberProfile: {
        account: accountMock,
        profileList: profileListMock,
      } as IMemberProfileState,
    } as RootState;
    const getState = jest.fn().mockReturnValue(state);

    const action = storeMemberListInfoAsyncAction();
    await action(dispatch, getState);

    expect(updateCurrentMembersInfoDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState
    );
    expect(updateSecondaryMembersInfoDispatchMock).not.toHaveBeenCalled();
  });

  it('dispatches update for secondary user, ', () => {
    const dispatch = jest.fn();
    const state: RootState = {
      editMemberProfile: {
        secondaryUser: {
          identifier: 'mock-id-sie-adult',
        },
        memberInfo: { identifier: 'mock-id-sie-child' },
      } as IEditMemberProfileState,
      memberProfile: {
        account: accountMock,
        profileList: profileListMock,
      } as IMemberProfileState,
    } as RootState;
    const getState = jest.fn().mockReturnValue(state);

    const action = storeMemberListInfoAsyncAction();
    action(dispatch, getState);

    expect(updateCurrentMembersInfoDispatchMock).not.toHaveBeenCalled();
    expect(updateSecondaryMembersInfoDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState
    );
  });
});

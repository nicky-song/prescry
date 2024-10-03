// Copyright 2021 Prescryptive Health, Inc.

import {
  IDependentProfile,
  ILimitedAccount,
  IPrimaryProfile,
  IProfile,
} from '../../../../models/member-profile/member-profile-info';
import {
  ISetMemberProfileActionPayload,
  setMemberProfileAction,
} from './actions/set-member-profile.action';
import {
  defaultMemberProfileState,
  IMemberProfileActionTypes,
  IMemberProfileState,
  memberProfileReducer,
} from './member-profile-reducer';

const accountMock: ILimitedAccount = {
  firstName: 'fake-first',
  lastName: 'fake-last',
  dateOfBirth: '01-01-2000',
  phoneNumber: 'fake-phone',
  recoveryEmail: 'test@test.com',
  favoritedPharmacies: ['ncpdp-mock'],
  isFavoritedPharmaciesFeatureKnown: true,
  languageCode: 'es',
};

const profileListMock: IProfile[] = [
  {
    rxGroupType: 'CASH',
    primary: {
      email: '',
      firstName: 'ME',
      identifier: '6000b2fa965fa7b37c00a7b2',
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
        identifier: '6000b2fa965fa7b37c00a7b3',
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
      identifier: '6000b2fa965fa7b37c00a7b2',
      isLimited: false,
      isPhoneNumberVerified: false,
      isPrimary: false,
      lastName: 'TEST',
      phoneNumber: '',
      primaryMemberFamilyId: 'CA7F7K',
      primaryMemberPersonCode: '03',
      primaryMemberRxId: 'CA7F7K03',
      age: 4,
      dateOfBirth: '01/01/2000',
    } as IPrimaryProfile,
    adultMembers: [
      {
        email: '',
        firstName: 'TEST',
        identifier: '6000b2fa965fa7b37c00a7b3',
        isLimited: false,
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: 'TEST',
        phoneNumber: '',
        primaryMemberFamilyId: 'CA7F7K',
        primaryMemberPersonCode: '03',
        primaryMemberRxId: 'CA7F7K03',
        rxSubGroup: 'HMA01',
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
        rxSubGroup: 'HMA01',
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
        rxSubGroup: 'HMA01',
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
        rxSubGroup: 'HMA01',
        age: 4,
      } as IDependentProfile,
    ],
  },
];

describe('memberProfileReducer', () => {
  const defaultState: IMemberProfileState = {
    account: {
      phoneNumber: '',
      favoritedPharmacies: [],
    },
    profileList: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns default state when state is not defined', () => {
    const action = {
      payload: undefined,
      type: '',
    } as unknown as IMemberProfileActionTypes;

    expect(memberProfileReducer(undefined, action)).toEqual(
      defaultMemberProfileState
    );
  });

  it('updates state for setMemberProfileAction', () => {
    const data: ISetMemberProfileActionPayload = {
      account: accountMock,
      profileList: profileListMock,
    };

    const action = setMemberProfileAction(data);
    const expectedState: IMemberProfileState = {
      account: accountMock,
      profileList: profileListMock,
    };

    const updatedState = memberProfileReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });
});

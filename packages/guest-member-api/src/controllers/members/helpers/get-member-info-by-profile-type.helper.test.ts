// Copyright 2021 Prescryptive Health, Inc.

import {
  IDependentProfile,
  IPrimaryProfile,
} from '@phx/common/src/models/member-profile/member-profile-info';
import { IPerson } from '@phx/common/src/models/person';
import { getMemberInfoBasedOnProfileType } from './get-member-info-by-profile-type.helper';
import {
  filterDependentsBasedOnAgeAndFamilyId,
  mapPrimaryProfileDetails,
} from '../../../utils/person/person-helper';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { assertHasFamilyId } from '../../../assertions/assert-has-family-id';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('../../../utils/person/person-helper');
const mapPrimaryProfileDetailsMock = mapPrimaryProfileDetails as jest.Mock;
const filterDependentsBasedOnAgeAndFamilyIdMock =
  filterDependentsBasedOnAgeAndFamilyId as jest.Mock;

jest.mock('../../../assertions/assert-has-family-id');
const assertHasFamilyIdMock = assertHasFamilyId as jest.Mock;

describe('getMemberInfoBasedOnProfileType', () => {
  const allDependentsMock = [
    {
      dateOfBirth: '2001-01-01',
      email: '',
      firstName: 'first-user1',
      identifier: '1',
      isPhoneNumberVerified: false,
      isPrimary: false,
      lastName: 'last-user1',
      phoneNumber: '',
      primaryMemberFamilyId: 'family-id',
      primaryMemberPersonCode: 'person-code-id5',
      primaryMemberRxId: 'mock-id5',
      secondaryAlertChildCareTakerIdentifier: 'loggedIn-member-identifier',
    },
    {
      dateOfBirth: '2016-01-01',
      email: '',
      firstName: 'first-user2',
      identifier: '2',
      isPhoneNumberVerified: false,
      isPrimary: false,
      lastName: 'last-user2',
      phoneNumber: '',
      primaryMemberFamilyId: 'family-id',
      primaryMemberPersonCode: 'person-code-id2',
      primaryMemberRxId: 'mock-id2',
    },
    {
      dateOfBirth: '2018-01-01',
      email: '',
      firstName: 'first-user3',
      identifier: '3',
      isPhoneNumberVerified: false,
      isPrimary: false,
      lastName: 'last-user3',
      phoneNumber: '',
      primaryMemberFamilyId: 'family-id2',
      primaryMemberPersonCode: 'person-code-id2',
      primaryMemberRxId: 'mock-id3',
    },
  ] as IPerson[];
  const primaryPersonMock = {
    dateOfBirth: '2001-01-01',
    email: 'test@t.com',
    firstName: 'first-user1',
    identifier: '1',
    isPhoneNumberVerified: false,
    isPrimary: true,
    lastName: 'last-user1',
    phoneNumber: '+1234567890',
    primaryMemberFamilyId: 'family-id',
    primaryMemberPersonCode: 'person-code-id1',
    primaryMemberRxId: 'mock-identifier',
    secondaryAlertChildCareTakerIdentifier: 'loggedIn-member-identifier',
    rxGroupType: 'CASH',
  } as IPerson;

  beforeEach(() => {
    mapPrimaryProfileDetailsMock.mockReset();
    filterDependentsBasedOnAgeAndFamilyIdMock.mockReset();
  });

  it('consolidates all family members based on profile type and return IProfile', () => {
    const primaryProfileMock: IPrimaryProfile = {
      dateOfBirth: '2001-01-01',
      email: 'test@t.com',
      firstName: 'first-user1',
      identifier: '1',
      isPhoneNumberVerified: false,
      isPrimary: true,
      lastName: 'last-user1',
      phoneNumber: '+1234567890',
      primaryMemberFamilyId: 'family-id',
      primaryMemberPersonCode: 'person-code-id1',
      primaryMemberRxId: 'mock-identifier',
      secondaryAlertChildCareTakerIdentifier: 'loggedIn-member-identifier',
      rxGroupType: 'CASH',
      rxSubGroup: 'CASH01',
    };

    const childMembersList: IDependentProfile[] = [
      {
        firstName: 'first-user2',
        identifier: '2',
        isPrimary: false,
        lastName: 'last-user2',
        primaryMemberFamilyId: 'family-id',
        primaryMemberPersonCode: 'person-code-id2',
        primaryMemberRxId: 'mock-id2',
        age: 5,
        isLimited: false,
        rxSubGroup: 'CASH01',
      },
    ];
    const adultMembersList: IDependentProfile[] = [
      {
        firstName: 'first-user1',
        identifier: '1',
        isPrimary: false,
        lastName: 'last-user1',
        primaryMemberFamilyId: 'family-id',
        primaryMemberPersonCode: 'person-code-id5',
        primaryMemberRxId: 'mock-id5',
        secondaryAlertChildCareTakerIdentifier: 'loggedIn-member-identifier',
        isLimited: false,
        rxSubGroup: 'CASH01',
      },
    ];

    mapPrimaryProfileDetailsMock.mockReturnValueOnce(primaryProfileMock);
    filterDependentsBasedOnAgeAndFamilyIdMock.mockReturnValueOnce({
      childMembers: childMembersList,
      adultMembers: adultMembersList,
    });

    const response = getMemberInfoBasedOnProfileType(
      primaryPersonMock,
      allDependentsMock,
      'CASH',
      configurationMock.childMemberAgeLimit
    );

    expectToHaveBeenCalledOnceOnlyWith(
      assertHasFamilyIdMock,
      primaryPersonMock.primaryMemberFamilyId
    );

    expectToHaveBeenCalledOnceOnlyWith(
      filterDependentsBasedOnAgeAndFamilyIdMock,
      allDependentsMock,
      primaryPersonMock.isPrimary,
      primaryPersonMock.identifier,
      configurationMock.childMemberAgeLimit,
      primaryPersonMock.primaryMemberFamilyId ?? ''
    );

    expect(response).toEqual({
      rxGroupType: 'CASH',
      primary: primaryProfileMock,
      childMembers: childMembersList,
      adultMembers: adultMembersList,
    });
  });
});

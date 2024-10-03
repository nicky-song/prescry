// Copyright 2018 Prescryptive Health, Inc.

import {
  formatAccountDetailsToPascalCase,
  formatMemberDependentProfileListToPascalCase,
  formatMemberDetailsToPascalCase,
} from './format-member-details-to-pascal-case';
import { IMemberContactInfo } from '../../../../../models/member-info/member-contact-info';
import {
  IDependentProfile,
  ILimitedAccount,
} from '../../../../../models/member-profile/member-profile-info';

describe('formatMemberDetailsToPascalCase', () => {
  it('should format the user firstname and lastname and convert them to Pascal case', () => {
    const list = [
      {
        firstName: 'firstName',
        lastName: 'lastName',
        rxGroupType: 'SIE',
      } as IMemberContactInfo,
    ];
    expect(formatMemberDetailsToPascalCase(list)).toEqual([
      {
        firstName: 'Firstname',
        lastName: 'Lastname',
        rxGroupType: 'SIE',
      },
    ]);
  });
});

describe('formatAccountDetailsToPascalCase', () => {
  it('should format the user firstname and lastname and convert them to Pascal case', () => {
    const account = {
      firstName: 'fake-first',
      lastName: 'fake-last',
      dateOfBirth: '01-01-2000',
      phoneNumber: 'fake-phone',
      recoveryEmail: 'test@test.com',
      favoritedPharmacies: [],
    } as ILimitedAccount;
    expect(formatAccountDetailsToPascalCase(account)).toEqual({
      firstName: 'Fake-first',
      lastName: 'Fake-last',
      dateOfBirth: '01-01-2000',
      phoneNumber: 'fake-phone',
      recoveryEmail: 'test@test.com',
      favoritedPharmacies: [],
    });
  });
});

describe('formatMemberDependentProfileListToPascalCase', () => {
  it('should format the user firstname and lastname and convert them to Pascal case', () => {
    const list = [
      {
        email: '',
        firstName: 'test',
        identifier: '6000b2fa965fa7b37c00a7b3',
        isLimited: false,
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: 'test',
        phoneNumber: '',
        primaryMemberFamilyId: 'CA7F7K',
        primaryMemberPersonCode: '03',
        primaryMemberRxId: 'CA7F7K03',
        rxSubGroup: 'CASH01',
        age: 4,
      } as IDependentProfile,
      {
        email: '',
        firstName: 'adult',
        identifier: '60013af2965fa7b37c00a7b4',
        isLimited: false,
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: 'adult',
        phoneNumber: '',
        primaryMemberFamilyId: 'CA7F7K',
        primaryMemberPersonCode: '05',
        primaryMemberRxId: 'CA7F7K05',
        rxSubGroup: 'CASH01',
        age: 20,
      } as IDependentProfile,
    ];
    expect(formatMemberDependentProfileListToPascalCase(list)).toEqual([
      {
        email: '',
        firstName: 'Test',
        identifier: '6000b2fa965fa7b37c00a7b3',
        isLimited: false,
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: 'Test',
        phoneNumber: '',
        primaryMemberFamilyId: 'CA7F7K',
        primaryMemberPersonCode: '03',
        primaryMemberRxId: 'CA7F7K03',
        rxSubGroup: 'CASH01',
        age: 4,
      } as IDependentProfile,
      {
        email: '',
        firstName: 'Adult',
        identifier: '60013af2965fa7b37c00a7b4',
        isLimited: false,
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: 'Adult',
        phoneNumber: '',
        primaryMemberFamilyId: 'CA7F7K',
        primaryMemberPersonCode: '05',
        primaryMemberRxId: 'CA7F7K05',
        rxSubGroup: 'CASH01',
        age: 20,
      } as IDependentProfile,
    ]);
  });
});

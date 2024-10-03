// Copyright 2018 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { IAccount } from '@phx/common/src/models/account';
import {
  getFirstOrDefault,
  sortMemberByPersonCode,
  filterMembers,
  mapChildMemberDetails,
  mapLimitedMemberDetails,
  filterDependentsBasedOnAgeAndFamilyId,
  mapChildDependentDetails,
  mapLimitedAdultDependentDetails,
  mapPrimaryProfileDetails,
  mapAccountDetails,
  getLoggedInMemberRxIds,
  masterIdExistInPersonCollection,
  getMasterIdsFromPersonList,
  getZipFromPersonList,
} from './person-helper';
import { IMemberDetails } from '../../models/member-details';
import { IConfiguration } from '../../configuration';
import { CalculateAbsoluteAge } from '@phx/common/src/utils/date-time-helper';
import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { Response } from 'express';
import { ApiConstants } from '../../constants/api-constants';
import { searchPersonByMasterIdAndRxGroupType } from '../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';

const memberList = [
  {
    firstName: 'ABC',
    primaryMemberPersonCode: '002',
  },
  {
    firstName: 'DEF',
    primaryMemberPersonCode: '001',
  },
] as unknown as IPerson[];

const configurationMock = {
  childMemberAgeLimit: 13,
} as IConfiguration;

jest.mock('@phx/common/src/utils/date-time-helper');
const calculateAbsoluteAgeMock = CalculateAbsoluteAge as jest.Mock;

jest.mock('@phx/common/src/utils/date-time-helper');
const UTCDateStringMock = UTCDateString as jest.Mock;

jest.mock(
  '../../databases/mongo-database/v1/query-helper/person-collection-helper'
);

const searchPersonByMasterIdAndRxGroupTypeMock =
  searchPersonByMasterIdAndRxGroupType as jest.Mock;

describe('personCollectionHelper', () => {
  beforeEach(() => {
    calculateAbsoluteAgeMock.mockReset();
    calculateAbsoluteAgeMock.mockReturnValue(12);
  });

  describe('sortMemberByPersonCode', () => {
    it('should sort member list on the basis of primaryMemberPersonCode', () => {
      const sortedMemberList = sortMemberByPersonCode(memberList);

      expect(sortedMemberList[0].primaryMemberPersonCode).toBe('001');
      expect(sortedMemberList[1].primaryMemberPersonCode).toBe('002');
    });
  });

  describe('getFirstOrDefault', () => {
    it('Should return first member if member list length 1', () => {
      const member = getFirstOrDefault([memberList[0]], sortMemberByPersonCode);

      expect(member).toBeDefined();
      expect(member).toBe(memberList[0]);
    });

    it('Should return first member of sortMemberlist if member list length is greater than one', () => {
      const member = getFirstOrDefault(memberList, sortMemberByPersonCode);

      expect(member).toBeDefined();
      if (member) {
        expect(member.primaryMemberPersonCode).toBe('001');
      }
    });

    it('Should return undefined if member list length is 0', () => {
      const member = getFirstOrDefault([], sortMemberByPersonCode);

      expect(member).toBeUndefined();
    });
  });

  describe('filterMembers()', () => {
    const loggedInMemberIdentifier = 'loggedIn-member-identifier';
    const membersListMock = [
      {
        dateOfBirth: '2001-01-01',
        email: '',
        firstName: 'user1',
        identifier: '1',
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: 'user1LastName',
        phoneNumber: '',
        primaryMemberFamilyId: 'family-id',
        primaryMemberPersonCode: 'person-code-id1',
        primaryMemberRxId: 'mock-id1',
        secondaryAlertChildCareTakerIdentifier: loggedInMemberIdentifier,
      },
      {
        dateOfBirth: '2016-01-01',
        email: '',
        firstName: 'user2',
        identifier: '2',
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: 'user2LastName',
        phoneNumber: '',
        primaryMemberFamilyId: 'family-id',
        primaryMemberPersonCode: 'person-code-id2',
        primaryMemberRxId: 'mock-id2',
      },
    ] as IMemberDetails[];

    it('should always return adult members', () => {
      calculateAbsoluteAgeMock.mockReturnValueOnce(14);
      const members = filterMembers(
        membersListMock,
        false,
        loggedInMemberIdentifier,
        configurationMock.childMemberAgeLimit
      );
      expect(members).toEqual({
        adultMembers: [
          {
            firstName: 'user1',
            identifier: '1',
            isLimited: true,
            isPrimary: false,
            lastName: 'user1LastName',
            age: 14,
          },
        ],
        childMembers: [],
      });
    });

    it('should return all adult members and all childMembers if loggedIn member is primary', () => {
      const members = filterMembers(
        membersListMock,
        true,
        loggedInMemberIdentifier,
        configurationMock.childMemberAgeLimit
      );
      expect(members).toEqual({
        adultMembers: [],
        childMembers: [
          {
            email: '',
            firstName: 'user1',
            identifier: '1',
            isLimited: false,
            isPhoneNumberVerified: false,
            isPrimary: false,
            lastName: 'user1LastName',
            phoneNumber: '',
            primaryMemberFamilyId: 'family-id',
            primaryMemberPersonCode: 'person-code-id1',
            primaryMemberRxId: 'mock-id1',
            secondaryAlertChildCareTakerIdentifier:
              'loggedIn-member-identifier',
            age: 12,
          },
          {
            email: '',
            firstName: 'user2',
            identifier: '2',
            isLimited: false,
            isPhoneNumberVerified: false,
            isPrimary: false,
            lastName: 'user2LastName',
            phoneNumber: '',
            primaryMemberFamilyId: 'family-id',
            primaryMemberPersonCode: 'person-code-id2',
            primaryMemberRxId: 'mock-id2',
            secondaryAlertChildCareTakerIdentifier: undefined,
            age: 12,
          },
        ],
      });
    });

    it('should return only adult members and all childMembers whom the logged in user is caretaker if loggedIn member is not primary', () => {
      const members = filterMembers(
        membersListMock,
        false,
        loggedInMemberIdentifier,
        configurationMock.childMemberAgeLimit
      );
      expect(members).toEqual({
        adultMembers: [],
        childMembers: [
          {
            firstName: 'user1',
            identifier: '1',
            isLimited: true,
            isPrimary: false,
            lastName: 'user1LastName',
            age: 12,
          },
        ],
      });
    });

    it('A member of age >=13 must be considered as adult', () => {
      calculateAbsoluteAgeMock.mockReturnValue(13);
      const members = filterMembers(
        membersListMock,
        false,
        loggedInMemberIdentifier,
        configurationMock.childMemberAgeLimit
      );
      expect(members).toEqual({
        adultMembers: [
          {
            firstName: 'user1',
            identifier: '1',
            isLimited: true,
            isPrimary: false,
            lastName: 'user1LastName',
            age: 13,
          },
          {
            firstName: 'user2',
            identifier: '2',
            isLimited: true,
            isPrimary: false,
            lastName: 'user2LastName',
            age: 13,
          },
        ],
        childMembers: [],
      });
    });
  });

  describe('mapChildMemberDetails()', () => {
    it('maps child member details and returns IMember data with isLimited flag as false', () => {
      const mockMemberInfo = {
        dateOfBirth: '1990-01-01',
        email: 'mockEmail',
        firstName: 'John',
        identifier: '1',
        isPhoneNumberVerified: true,
        isPrimary: false,
        lastName: 'mockLastName',
        phoneNumber: 'mockPhoneNumber',
        primaryMemberRxId: 'mock-id1',
      } as IPerson;

      const updatedMember = mapChildMemberDetails(mockMemberInfo, 12);
      expect(updatedMember).toEqual({
        email: 'mockEmail',
        firstName: 'John',
        identifier: '1',
        isLimited: false,
        isPhoneNumberVerified: true,
        isPrimary: false,
        lastName: 'mockLastName',
        phoneNumber: 'mockPhoneNumber',
        primaryMemberRxId: 'mock-id1',
        age: 12,
      });
    });
  });

  describe('mapLimitedMemberDetails', () => {
    it('should return member limited details with isLimited flag as true', () => {
      const mockMemberInfo = {
        dateOfBirth: '1990-01-01',
        email: 'mockEmail',
        firstName: 'John',
        identifier: '1',
        isPhoneNumberVerified: true,
        isPrimary: false,
        lastName: 'mockLastName',
        phoneNumber: 'mockPhoneNumber',
        primaryMemberRxId: 'mock-id1',
      } as IPerson;
      const limitedMemberInfo = mapLimitedMemberDetails(mockMemberInfo, 14);
      expect(limitedMemberInfo).toEqual({
        firstName: mockMemberInfo.firstName,
        identifier: mockMemberInfo.identifier,
        isLimited: true,
        isPrimary: mockMemberInfo.isPrimary,
        lastName: mockMemberInfo.lastName,
        age: 14,
      });
    });
  });

  describe('filterDependentsBasedOnAgeAndFamilyId', () => {
    const loggedInUserIdentifier = 'loggedIn-member-identifier';
    const membersListMock = [
      {
        dateOfBirth: '2001-01-01',
        email: '',
        firstName: 'user1',
        identifier: '1',
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: 'user1LastName',
        phoneNumber: '',
        primaryMemberFamilyId: 'family-id',
        primaryMemberPersonCode: 'person-code-id1',
        primaryMemberRxId: 'mock-id1',
        secondaryAlertChildCareTakerIdentifier: loggedInUserIdentifier,
      },
      {
        dateOfBirth: '2016-01-01',
        email: '',
        firstName: 'user2',
        identifier: '2',
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: 'user2LastName',
        phoneNumber: '',
        primaryMemberFamilyId: 'family-id',
        primaryMemberPersonCode: 'person-code-id2',
        primaryMemberRxId: 'mock-id2',
      },
    ] as IPerson[];

    it('always returns adult members', () => {
      calculateAbsoluteAgeMock.mockReturnValueOnce(14);
      const members = filterDependentsBasedOnAgeAndFamilyId(
        membersListMock,
        false,
        loggedInUserIdentifier,
        configurationMock.childMemberAgeLimit,
        'family-id'
      );
      expect(members).toEqual({
        adultMembers: [
          {
            firstName: 'user1',
            identifier: '1',
            isLimited: true,
            isPrimary: false,
            lastName: 'user1LastName',
            rxSubGroup: ApiConstants.CASH_USER_RX_SUB_GROUP,
            age: 14,
          },
        ],
        childMembers: [],
      });
    });

    it('returns all child and adult Members if loggedIn member is primary', () => {
      const members = filterDependentsBasedOnAgeAndFamilyId(
        membersListMock,
        true,
        loggedInUserIdentifier,
        configurationMock.childMemberAgeLimit,
        'family-id'
      );
      expect(members).toEqual({
        adultMembers: [],
        childMembers: [
          {
            firstName: 'user1',
            identifier: '1',
            isLimited: false,
            isPrimary: false,
            lastName: 'user1LastName',
            primaryMemberFamilyId: 'family-id',
            primaryMemberPersonCode: 'person-code-id1',
            primaryMemberRxId: 'mock-id1',
            secondaryAlertChildCareTakerIdentifier:
              'loggedIn-member-identifier',
            age: 12,
            rxGroupType: undefined,
            rxSubGroup: ApiConstants.CASH_USER_RX_SUB_GROUP,
            secondaryAlertCarbonCopyIdentifier: undefined,
            email: '',
            phoneNumber: '',
          },
          {
            firstName: 'user2',
            identifier: '2',
            isLimited: false,
            isPrimary: false,
            lastName: 'user2LastName',
            primaryMemberFamilyId: 'family-id',
            primaryMemberPersonCode: 'person-code-id2',
            primaryMemberRxId: 'mock-id2',
            secondaryAlertChildCareTakerIdentifier: undefined,
            age: 12,
            rxGroupType: undefined,
            rxSubGroup: ApiConstants.CASH_USER_RX_SUB_GROUP,
            secondaryAlertCarbonCopyIdentifier: undefined,
            email: '',
            phoneNumber: '',
          },
        ],
      });
    });

    it('returns only adult members and all childMembers whom the logged in user is caretaker if loggedIn member is not primary', () => {
      const members = filterDependentsBasedOnAgeAndFamilyId(
        membersListMock,
        false,
        loggedInUserIdentifier,
        configurationMock.childMemberAgeLimit,
        'family-id'
      );

      expect(members).toEqual({
        adultMembers: [],
        childMembers: [
          {
            firstName: 'user1',
            identifier: '1',
            isLimited: true,
            isPrimary: false,
            lastName: 'user1LastName',
            rxSubGroup: ApiConstants.CASH_USER_RX_SUB_GROUP,
            age: 12,
          },
        ],
      });
    });

    it('considers a member of age >=13 to be an adult', () => {
      calculateAbsoluteAgeMock.mockReturnValue(13);
      const members = filterDependentsBasedOnAgeAndFamilyId(
        membersListMock,
        false,
        loggedInUserIdentifier,
        configurationMock.childMemberAgeLimit,
        'family-id'
      );
      expect(members).toEqual({
        adultMembers: [
          {
            firstName: 'user1',
            identifier: '1',
            isLimited: true,
            isPrimary: false,
            lastName: 'user1LastName',
            rxSubGroup: ApiConstants.CASH_USER_RX_SUB_GROUP,
            age: 13,
          },
          {
            firstName: 'user2',
            identifier: '2',
            isLimited: true,
            isPrimary: false,
            lastName: 'user2LastName',
            rxSubGroup: ApiConstants.CASH_USER_RX_SUB_GROUP,
            age: 13,
          },
        ],
        childMembers: [],
      });
    });
  });

  describe('mapChildDependentDetails', () => {
    it.each([
      [undefined, ApiConstants.CASH_USER_RX_SUB_GROUP],
      ['HMA01', 'HMA01'],
    ])(
      'maps child dependents details and returns IdependentProfile (rxSubGroup: %p)',
      (rxSubGroupMock: undefined | string, expectedRxSubGroup: string) => {
        const personMock: IPerson = {
          identifier: '123',
          firstName: 'fake-first',
          lastName: 'fake-last',
          dateOfBirth: '2012-01-01',
          phoneNumber: 'fake-phone',
          isPhoneNumberVerified: false,
          primaryMemberRxId: 'primary-rx-id',
          primaryMemberFamilyId: 'fake-family-id',
          secondaryAlertChildCareTakerIdentifier: 'secondary-identifier',
          secondaryAlertCarbonCopyIdentifier: 'carbon-copy-identifier',
          isPrimary: false,
          email: 'fake-email.com',
          primaryMemberPersonCode: '03',
          rxGroup: 'abc',
          rxBin: 'default',
          carrierPCN: 'default',
          rxGroupType: RxGroupTypesEnum.CASH,
          rxSubGroup: rxSubGroupMock,
          masterId: 'master-id1',
        };

        const ageLimit = 9;
        const dependentProfileMock = {
          firstName: 'fake-first',
          lastName: 'fake-last',
          identifier: '123',
          isLimited: false,
          primaryMemberRxId: 'primary-rx-id',
          primaryMemberFamilyId: 'fake-family-id',
          primaryMemberPersonCode: '03',
          secondaryAlertChildCareTakerIdentifier: 'secondary-identifier',
          secondaryAlertCarbonCopyIdentifier: 'carbon-copy-identifier',
          isPrimary: false,
          age: 9,
          rxGroupType: RxGroupTypesEnum.CASH,
          rxSubGroup: expectedRxSubGroup,
          email: 'fake-email.com',
          phoneNumber: 'fake-phone',
          masterId: 'master-id1',
        };
        const response = mapChildDependentDetails(personMock, ageLimit);
        expect(response).toEqual(dependentProfileMock);
      }
    );
  });

  describe('mapLimitedAdultDependentDetails', () => {
    it.each([
      [undefined, ApiConstants.CASH_USER_RX_SUB_GROUP],
      ['HMA01', 'HMA01'],
    ])(
      'maps adult dependents details and returns IdependentProfile with limited flag set to TRUE (rxSubGroup: %p)',
      (rxSubGroupMock: undefined | string, expectedRxGroup: string) => {
        const personMock: IPerson = {
          identifier: '123',
          firstName: 'fake-first',
          lastName: 'fake-last',
          dateOfBirth: '2000-01-01',
          phoneNumber: 'fake-phone',
          isPhoneNumberVerified: false,
          primaryMemberRxId: 'primary-rx-id',
          primaryMemberFamilyId: 'fake-family-id',
          secondaryAlertChildCareTakerIdentifier: 'secondary-identifier',
          secondaryAlertCarbonCopyIdentifier: 'carbon-copy-identifier',
          isPrimary: false,
          email: 'fake-email.com',
          primaryMemberPersonCode: '03',
          rxGroup: 'abc',
          rxBin: 'default',
          carrierPCN: 'default',
          rxGroupType: RxGroupTypesEnum.CASH,
          rxSubGroup: rxSubGroupMock,
          masterId: 'master-id1',
        };

        const ageLimit = 21;
        const limitedAdultMock = {
          firstName: 'fake-first',
          lastName: 'fake-last',
          identifier: '123',
          isLimited: true,
          isPrimary: false,
          age: 21,
          rxGroupType: RxGroupTypesEnum.CASH,
          rxSubGroup: expectedRxGroup,
          masterId: 'master-id1',
        };
        const response = mapLimitedAdultDependentDetails(personMock, ageLimit);
        expect(response).toEqual(limitedAdultMock);
      }
    );
  });

  describe('mapPrimaryProfileDetails', () => {
    it.each([
      [undefined, ApiConstants.CASH_USER_RX_SUB_GROUP],
      ['HMA01', 'HMA01'],
    ])(
      'maps person details and returns IPrimaryProfile (rxSubGroup: %p)',
      (rxSubGroupMock: undefined | string, expectedRxSubGroup: string) => {
        const personMock: IPerson = {
          identifier: '123',
          firstName: 'fake-first',
          lastName: 'fake-last',
          dateOfBirth: '2000-01-01',
          phoneNumber: 'fake-phone',
          isPhoneNumberVerified: true,
          primaryMemberRxId: 'primary-rx-id',
          primaryMemberFamilyId: 'fake-family-id',
          secondaryAlertChildCareTakerIdentifier: 'secondary-identifier',
          secondaryAlertCarbonCopyIdentifier: 'carbon-copy-identifier',
          isPrimary: true,
          email: 'fake-email.com',
          primaryMemberPersonCode: '01',
          brokerAssociation: 'broker-association',
          rxGroupType: RxGroupTypesEnum.CASH,
          rxGroup: 'abc',
          rxBin: 'default',
          rxSubGroup: rxSubGroupMock,
          carrierPCN: 'default',
          address1: 'address1',
          masterId: 'master-id-mock',
          accountId: 'account-id-mock',
        };
        const response = mapPrimaryProfileDetails(personMock);
        expect(response).toEqual({
          identifier: '123',
          firstName: 'fake-first',
          lastName: 'fake-last',
          dateOfBirth: '2000-01-01',
          phoneNumber: 'fake-phone',
          isPhoneNumberVerified: true,
          primaryMemberRxId: 'primary-rx-id',
          primaryMemberFamilyId: 'fake-family-id',
          secondaryAlertChildCareTakerIdentifier: 'secondary-identifier',
          secondaryAlertCarbonCopyIdentifier: 'carbon-copy-identifier',
          isPrimary: true,
          isLimited: false,
          issuerNumber: undefined,
          primaryMemberPersonCode: '01',
          brokerAssociation: personMock.brokerAssociation,
          rxGroup: 'abc',
          rxBin: 'default',
          carrierPCN: 'default',
          rxGroupType: 'CASH',
          rxSubGroup: expectedRxSubGroup,
          address1: 'address1',
          address2: undefined,
          city: undefined,
          county: undefined,
          state: undefined,
          zip: undefined,
          masterId: 'master-id-mock',
          accountId: 'account-id-mock',
        });
      }
    );
  });

  describe('mapAccountDetails', () => {
    it('should map account details and return limited account details', () => {
      UTCDateStringMock.mockReturnValue('2000-01-01');
      const accountMock: IAccount = {
        _id: 'id-1',
        firstName: 'fake-first',
        lastName: 'fake-last',
        dateOfBirth:
          'Fri Dec 31 1999 16:00:00 GMT-0800 (Pacific Standard Time)',
        phoneNumber: 'fake-phone',
        accountKey: 'account-key',
        pinHash: 'hash-key',
        recoveryEmail: 'test@sdsd.com',
        favoritedPharmacies: ['ncpdp-mock-1', 'ncpdp-mock-2'],
        isFavoritedPharmaciesFeatureKnown: true,
        languageCode: 'es',
      };

      const response = mapAccountDetails(accountMock);
      expect(response).toEqual({
        firstName: 'fake-first',
        lastName: 'fake-last',
        phoneNumber: 'fake-phone',
        dateOfBirth: '2000-01-01',
        recoveryEmail: 'test@sdsd.com',
        favoritedPharmacies: ['ncpdp-mock-1', 'ncpdp-mock-2'],
        isFavoritedPharmaciesFeatureKnown: true,
        languageCode: 'es',
      });
    });
  });

  describe('getPatientIdList', () => {
    it('should return patientIds', () => {
      const mockPersonList = [
        {
          rxGroupType: RxGroupTypesEnum.SIE,
          firstName: 'first',
          lastName: 'last',
          dateOfBirth: '01/01/2000',
          primaryMemberRxId: 'id-1',
        } as IPerson,
      ];

      const responseMock = {
        locals: { personList: mockPersonList },
      } as unknown as Response;

      const personRxIds = getLoggedInMemberRxIds(responseMock);
      expect(personRxIds).toEqual(['id-1']);
    });
    it('should not return patientIds if personList is empty', () => {
      const mockPersonList = [] as IPerson[];

      const responseMock = {
        locals: { personList: mockPersonList },
      } as unknown as Response;

      const personRxIds = getLoggedInMemberRxIds(responseMock);
      expect(personRxIds).toEqual([]);
    });
  });

  describe('getMasterIdsFromPersonList', () => {
    it('should return masterIds', () => {
      const masterIdMock = 'master-id';
      const mockPersonList = [
        {
          rxGroupType: RxGroupTypesEnum.SIE,
          firstName: 'first',
          lastName: 'last',
          dateOfBirth: '01/01/2000',
          primaryMemberRxId: 'id-1',
          masterId: masterIdMock,
        } as IPerson,
      ];

      const personRxIds = getMasterIdsFromPersonList(mockPersonList);
      expect(personRxIds).toEqual([masterIdMock]);
    });
    it('should return unique masterIds', () => {
      const masterIdMock = 'master-id';
      const mockPersonList = [
        {
          rxGroupType: RxGroupTypesEnum.SIE,
          firstName: 'first',
          lastName: 'last',
          dateOfBirth: '01/01/2000',
          primaryMemberRxId: 'id-1',
          masterId: masterIdMock,
        } as IPerson,
        {
          rxGroupType: RxGroupTypesEnum.CASH,
          firstName: 'first',
          lastName: 'last',
          dateOfBirth: '01/01/2000',
          primaryMemberRxId: 'id-1',
          masterId: masterIdMock,
        } as IPerson,
      ];

      const personRxIds = getMasterIdsFromPersonList(mockPersonList);
      expect(personRxIds).toEqual([masterIdMock]);
    });
    it('should not return masterIds if personList is empty', () => {
      const mockPersonList = [] as IPerson[];

      const personRxIds = getMasterIdsFromPersonList(mockPersonList);
      expect(personRxIds).toEqual([]);
    });
  });

  describe('masterIdExistInPersonCollection', () => {
    beforeEach(() => {
      searchPersonByMasterIdAndRxGroupTypeMock.mockReset();
    });

    it('returns true if masterId exist in person collection', async () => {
      const databaseMock = {} as IDatabase;

      const masterIdMock = 'master-id-mock';

      const personInfo = {
        firstName: 'first-name',
        lastName: 'last-name',
        dateOfBirth: '01/01/2000',
        masterId: masterIdMock,
      } as unknown as IPerson;

      searchPersonByMasterIdAndRxGroupTypeMock.mockReturnValueOnce(personInfo);

      const result = await masterIdExistInPersonCollection(
        databaseMock,
        masterIdMock
      );

      expect(searchPersonByMasterIdAndRxGroupTypeMock).toHaveBeenCalledWith(
        databaseMock,
        masterIdMock,
        RxGroupTypesEnum.CASH
      );
      expect(result).toEqual(true);
    });

    it('returns false if cash masterId does not exist in person collection', async () => {
      const databaseMock = {} as IDatabase;

      const masterIdMock = 'master-id-mock';

      searchPersonByMasterIdAndRxGroupTypeMock.mockReturnValueOnce(undefined);

      const result = await masterIdExistInPersonCollection(
        databaseMock,
        masterIdMock
      );

      expect(searchPersonByMasterIdAndRxGroupTypeMock).toHaveBeenCalledWith(
        databaseMock,
        masterIdMock,
        RxGroupTypesEnum.CASH
      );
      expect(result).toEqual(false);
    });

    describe('getZipFromPersonList', () => {
      it('returns zip from personList', () => {
        const zipMock = '12345';

        const mockPersonListWithZip = [
          {
            rxGroupType: RxGroupTypesEnum.SIE,
            firstName: 'first',
            lastName: 'last',
            dateOfBirth: '01/01/2000',
            primaryMemberRxId: 'id-1',
            zip: zipMock,
          } as IPerson,
        ];

        const zip = getZipFromPersonList(mockPersonListWithZip);
        expect(zip).toEqual(zipMock);
      });
      it('returns undefined when zip is not found in personList', () => {
        const mockPersonListWithZip = [
          {
            rxGroupType: RxGroupTypesEnum.SIE,
            firstName: 'first',
            lastName: 'last',
            dateOfBirth: '01/01/2000',
            primaryMemberRxId: 'id-1',
            zip: undefined,
          } as IPerson,
        ];

        const zip = getZipFromPersonList(mockPersonListWithZip);
        expect(zip).toEqual(undefined);
      });
    });
  });
});

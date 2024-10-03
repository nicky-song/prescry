// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import { searchAllMembersForFamilyId } from '../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { getPersonCreationDataFromRedis } from '../../databases/redis/redis-query-helper';
import {
  getAllAllowedFamilyMembersForFamily,
  isMemberIdValidForUserAndDependents,
  getAllowedPersonsForLoggedInUser,
  getAllowedMemberIdsForLoggedInUser,
  getLoggedInUserProfileForRxGroupType,
  getLoggedInUserPatientForRxGroupType,
  getAllDependentsForPrimaryProfile,
  isMasterIdValidForUserAndDependents,
} from './get-dependent-person.helper';
import { databaseMock } from '../../mock-data/database.mock';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { PatientIdentifierCodeableConceptCode } from '../../models/fhir/patient/patient';
import { IPatientProfile } from '../../models/patient-profile';
import { IAppLocals } from '../../models/app-locals';

jest.mock(
  '../../databases/mongo-database/v1/query-helper/person-collection-helper'
);
const searchAllMembersForFamilyIdMock =
  searchAllMembersForFamilyId as jest.Mock;

jest.mock('../../databases/redis/redis-query-helper');
const getPersonCreationDataFromRedisMock =
  getPersonCreationDataFromRedis as jest.Mock;

jest.mock('@phx/common/src/utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

const loggedInPatientCashPrimary: IPatientProfile = {
  rxGroupType: 'CASH',
  primary: {
    dateOfBirth: '2001-01-01',
    name: [{ given: ['user1'], family: 'user1LastName' }],
    identifier: [
      {
        type: {
          coding: [
            {
              code: PatientIdentifierCodeableConceptCode.PHONE_NUMBER,
              display: "Patient's MyRx Phone Number",
              system: 'http://hl7.org/fhir/ValueSet/identifier-type',
            },
          ],
        },
        value: 'phone',
      },
      {
        type: {
          coding: [
            {
              code: PatientIdentifierCodeableConceptCode.MEMBER_ID,
              display: 'Unique MyRx ID',
              system: 'http://hl7.org/fhir/ValueSet/identifier-type',
            },
          ],
        },
        value: 'family-id-cash01',
      },
      {
        type: {
          coding: [
            {
              code: PatientIdentifierCodeableConceptCode.FAMILY_ID,
              display: "Patient's Cash Family Id",
              system: 'http://hl7.org/fhir/ValueSet/identifier-type',
            },
          ],
        },
        value: 'family-id-cash',
      },
    ],
    masterId: 'master-id-mock',
  },
} as IPatientProfile;

const loggedInPersonCashPrimary = {
  dateOfBirth: '2001-01-01',
  firstName: 'user1',
  identifier: 'id-1',
  isPrimary: true,
  lastName: 'user1LastName',
  phoneNumber: 'phone',
  primaryMemberFamilyId: 'family-id-cash',
  primaryMemberPersonCode: '01',
  primaryMemberRxId: 'family-id-cash01',
  rxGroupType: 'CASH',
  rxSubGroup: 'CASH',
  masterId: 'master-id-mock',
} as IPerson;
const loggedInSiePrimary = {
  dateOfBirth: '2001-01-01',
  firstName: 'user1',
  identifier: 'id-2',
  isPrimary: true,
  lastName: 'user1LastName',
  phoneNumber: 'phone',
  primaryMemberFamilyId: 'sie-family-id',
  primaryMemberPersonCode: '01',
  primaryMemberRxId: 'sie-family-id01',
  rxGroupType: 'SIE',
  masterId: 'master-id-mock',
} as IPerson;
const loggedInSieSecondary = {
  dateOfBirth: '2001-01-01',
  firstName: 'user1',
  identifier: 'id-3',
  isPrimary: false,
  lastName: 'user1LastName',
  phoneNumber: 'phone',
  primaryMemberFamilyId: 'sie-family-id',
  primaryMemberPersonCode: '02',
  primaryMemberRxId: 'sie-family-id02',
  rxGroupType: 'SIE',
  masterId: 'master-id-mock',
} as IPerson;

const loggedInPersonSmartPricePrimary = {
  dateOfBirth: '2001-01-01',
  firstName: 'user1',
  identifier: 'id-4',
  isPrimary: true,
  lastName: 'user1LastName',
  phoneNumber: 'phone',
  primaryMemberFamilyId: 'family-id-sm',
  primaryMemberPersonCode: '01',
  primaryMemberRxId: 'family-id-sm01',
  rxGroupType: 'CASH',
  rxSubGroup: 'SMARTPRICE',
  masterId: 'master-id-mock',
} as IPerson;

const cashDependent1 = {
  dateOfBirth: '2010-01-01',
  firstName: 'user3',
  identifier: 'dep-id-3',
  isPrimary: false,
  lastName: 'user3LastName',
  primaryMemberFamilyId: 'family-id-cash',
  primaryMemberPersonCode: '03',
  primaryMemberRxId: 'family-id-cash03',
  rxGroupType: 'CASH',
  rxSubGroup: 'CASH',
  masterId: 'master-id-mock',
} as IPerson;
const cashDependent2 = {
  dateOfBirth: '2017-01-01',
  firstName: 'user4',
  identifier: 'dep-id-4',
  isPrimary: false,
  lastName: 'user4LastName',
  primaryMemberFamilyId: 'family-id-cash',
  primaryMemberPersonCode: '04',
  primaryMemberRxId: 'family-id-cash04',
  rxGroupType: 'CASH',
  rxSubGroup: 'CASH',
  masterId: 'master-id-mock',
};
const cashAdultDependent = {
  dateOfBirth: '2001-01-01',
  firstName: 'user2',
  identifier: 'dep-id-2',
  isPrimary: false,
  lastName: 'user2LastName',
  primaryMemberFamilyId: 'family-id-cash',
  primaryMemberPersonCode: '02',
  primaryMemberRxId: 'family-id-cash02',
  rxGroupType: 'CASH',
  rxSubGroup: 'CASH',
  masterId: 'master-id-mock',
};
const sieDependent1 = {
  dateOfBirth: '2010-01-01',
  firstName: 'user3',
  identifier: 'dep-id-3',
  isPrimary: false,
  lastName: 'user3LastName',
  primaryMemberFamilyId: 'sie-family-id',
  primaryMemberPersonCode: '03',
  primaryMemberRxId: 'sie-family-id03',
  rxGroupType: 'SIE',
  masterId: 'master-id-mock',
} as IPerson;

const sieAdultDependent = {
  dateOfBirth: '2001-01-01',
  firstName: 'user2',
  identifier: 'dep-id-2',
  isPrimary: false,
  lastName: 'user2LastName',
  primaryMemberFamilyId: 'sie-family-id',
  primaryMemberPersonCode: '02',
  primaryMemberRxId: 'sie-family-id02',
  rxGroupType: 'SIE',
  masterId: 'master-id-mock',
};

describe('getDependentPersonHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllMembersForFamily()', () => {
    beforeEach(() => {
      getPersonCreationDataFromRedisMock.mockReturnValue(undefined);
    });

    it('does not return any dependent if person does not have a family id', async () => {
      const loggedInMemberNoFamilyId = {
        dateOfBirth: '2001-01-01',
        firstName: 'user1',
        identifier: 'id-1',
        isPrimary: false,
        lastName: 'user1LastName',
        phoneNumber: 'phone',
        primaryMemberPersonCode: '01',
        primaryMemberRxId: 'family-id01',
      } as IPerson;
      const childDependents = await getAllAllowedFamilyMembersForFamily(
        databaseMock,
        [loggedInMemberNoFamilyId],
        'phone',
        13
      );
      expect(childDependents).toEqual([]);
      expect(searchAllMembersForFamilyIdMock).not.toHaveBeenCalled();
    });

    it('returns all dependents from Database and not return the "over 13" dependents for SIE user if logged in user is primary user', async () => {
      searchAllMembersForFamilyIdMock.mockReturnValueOnce([
        loggedInPersonCashPrimary,
        cashDependent1,
        cashDependent2,
        cashAdultDependent,
      ]);
      searchAllMembersForFamilyIdMock.mockReturnValueOnce([
        loggedInSiePrimary,
        sieDependent1,
        sieAdultDependent,
      ]);
      getNewDateMock.mockReturnValue(new Date('2020-06-24'));

      const childDependents = await getAllAllowedFamilyMembersForFamily(
        databaseMock,
        [loggedInPersonCashPrimary, loggedInSiePrimary],
        'phone',
        13
      );
      expect(searchAllMembersForFamilyIdMock).toHaveBeenCalledTimes(2);
      expect(searchAllMembersForFamilyIdMock).toHaveBeenNthCalledWith(
        1,
        databaseMock,
        loggedInPersonCashPrimary.primaryMemberFamilyId
      );
      expect(searchAllMembersForFamilyIdMock).toHaveBeenNthCalledWith(
        2,
        databaseMock,
        loggedInSiePrimary.primaryMemberFamilyId
      );
      expect(childDependents).toEqual([
        cashDependent1,
        cashDependent2,
        cashAdultDependent,
        sieDependent1,
      ]);
      expect(getPersonCreationDataFromRedisMock).toHaveBeenNthCalledWith(
        1,
        'phone'
      );
    });

    it('adds all dependent members from redis if not already added', async () => {
      searchAllMembersForFamilyIdMock.mockReturnValueOnce([
        loggedInPersonCashPrimary,
        cashDependent1,
        cashDependent2,
        cashAdultDependent,
      ]);
      searchAllMembersForFamilyIdMock.mockReturnValueOnce([
        loggedInSiePrimary,
        sieDependent1,
        sieAdultDependent,
      ]);
      const redisDependent = {
        dateOfBirth: '2015-01-01',
        firstName: 'user5',
        isPrimary: false,
        lastName: 'user5LastName',
        primaryMemberFamilyId: 'family-id-cash',
        primaryMemberPersonCode: '05',
        primaryMemberRxId: 'family-id-cash05',
        rxGroupType: 'CASH',
      } as IPerson;
      getPersonCreationDataFromRedisMock.mockReturnValueOnce([
        loggedInPersonCashPrimary,
        cashAdultDependent,
        redisDependent,
      ]);

      getNewDateMock.mockReturnValue(new Date('2020-06-24'));

      const childDependents = await getAllAllowedFamilyMembersForFamily(
        databaseMock,
        [loggedInPersonCashPrimary, loggedInSiePrimary],
        'phone',
        13
      );

      expect(searchAllMembersForFamilyIdMock).toHaveBeenCalledTimes(2);
      expect(searchAllMembersForFamilyIdMock).toHaveBeenNthCalledWith(
        1,
        databaseMock,
        loggedInPersonCashPrimary.primaryMemberFamilyId
      );
      expect(searchAllMembersForFamilyIdMock).toHaveBeenNthCalledWith(
        2,
        databaseMock,
        loggedInSiePrimary.primaryMemberFamilyId
      );
      expect(childDependents).toEqual([
        cashDependent1,
        cashDependent2,
        cashAdultDependent,
        sieDependent1,
        redisDependent,
      ]);
      expect(getPersonCreationDataFromRedisMock).toHaveBeenNthCalledWith(
        1,
        'phone'
      );
    });

    it('does not add any dependent members from redis if those are already added', async () => {
      searchAllMembersForFamilyIdMock.mockReturnValueOnce([
        loggedInPersonCashPrimary,
        cashDependent1,
        cashDependent2,
        cashAdultDependent,
      ]);
      searchAllMembersForFamilyIdMock.mockReturnValueOnce([
        loggedInSiePrimary,
        sieDependent1,
        sieAdultDependent,
      ]);
      const redisDependent = {
        dateOfBirth: '2001-01-01',
        firstName: 'user2',
        identifier: 'dep-id-2',
        isPrimary: false,
        lastName: 'user2LastName',
        primaryMemberFamilyId: 'family-id-cash',
        primaryMemberPersonCode: '02',
        primaryMemberRxId: 'family-id-cash02',
        rxGroupType: 'CASH',
        rxSubGroup: 'CASH',
      } as IPerson;
      getPersonCreationDataFromRedisMock.mockReturnValueOnce([
        loggedInPersonCashPrimary,
        cashAdultDependent,
        redisDependent,
      ]);

      getNewDateMock.mockReturnValue(new Date('2020-06-24'));

      const childDependents = await getAllAllowedFamilyMembersForFamily(
        databaseMock,
        [loggedInPersonCashPrimary, loggedInSiePrimary],
        'phone',
        13
      );

      expect(searchAllMembersForFamilyIdMock).toHaveBeenCalledTimes(2);
      expect(searchAllMembersForFamilyIdMock).toHaveBeenNthCalledWith(
        1,
        databaseMock,
        loggedInPersonCashPrimary.primaryMemberFamilyId
      );
      expect(searchAllMembersForFamilyIdMock).toHaveBeenNthCalledWith(
        2,
        databaseMock,
        loggedInSiePrimary.primaryMemberFamilyId
      );
      expect(childDependents).toEqual([
        cashDependent1,
        cashDependent2,
        cashAdultDependent,
        sieDependent1,
      ]);
      expect(getPersonCreationDataFromRedisMock).toHaveBeenNthCalledWith(
        1,
        'phone'
      );
    });

    it('does not return any dependents for the profile where logged in user is not primary user', async () => {
      searchAllMembersForFamilyIdMock.mockReturnValueOnce([
        loggedInPersonCashPrimary,
        cashDependent1,
        cashDependent2,
        cashAdultDependent,
      ]);

      getNewDateMock.mockReturnValue(new Date('2020-06-24'));

      const childDependents = await getAllAllowedFamilyMembersForFamily(
        databaseMock,
        [loggedInPersonCashPrimary, loggedInSieSecondary],
        'phone',
        13
      );

      expect(searchAllMembersForFamilyIdMock).toHaveBeenCalledTimes(1);
      expect(searchAllMembersForFamilyIdMock).toHaveBeenNthCalledWith(
        1,
        databaseMock,
        loggedInPersonCashPrimary.primaryMemberFamilyId
      );
      expect(childDependents).toEqual([
        cashDependent1,
        cashDependent2,
        cashAdultDependent,
      ]);
      expect(getPersonCreationDataFromRedisMock).toHaveBeenNthCalledWith(
        1,
        'phone'
      );
    });
  });

  const dependentsMock = [
    cashDependent1,
    cashDependent2,
    cashAdultDependent,
    sieDependent1,
  ];
  const responseMock = {
    locals: {
      device: {
        data: 'phone',
      },
      personList: [loggedInPersonCashPrimary, loggedInSiePrimary],
      dependents: dependentsMock,
    } as IAppLocals,
  } as unknown as Response;

  const responsePatientMock = {
    locals: {
      device: {
        data: 'phone',
      },
      patientProfiles: [loggedInPatientCashPrimary],
    } as IAppLocals,
  } as unknown as Response;

  describe('isMemberIdValidForUserAndDependents()', () => {
    it('returns false if personList does not exists in response', () => {
      const responseMockNoPersonList = {
        locals: { dependents: [] },
      } as unknown as Response;

      expect(
        isMemberIdValidForUserAndDependents(
          responseMockNoPersonList,
          'sie-family-id01'
        )
      ).toEqual(false);
    });

    it('returns true if memberId matches any of logged in user profiles', () => {
      expect(
        isMemberIdValidForUserAndDependents(responseMock, 'sie-family-id01')
      ).toEqual(true);
    });

    it('returns true if memberId does not matches person but matches dependent', () => {
      expect(
        isMemberIdValidForUserAndDependents(responseMock, 'family-id-cash02')
      ).toEqual(true);
    });

    it('returns false if memberId does not matches person and there is no dependents in response mock', () => {
      const responseMockNoDependents = {
        locals: {
          device: {
            data: 'phone',
          },
          personList: [loggedInPersonCashPrimary, loggedInSiePrimary],
          dependents: [],
        },
      } as unknown as Response;
      expect(
        isMemberIdValidForUserAndDependents(
          responseMockNoDependents,
          'family-id-cash02'
        )
      ).toEqual(false);
    });

    it('returns false if memberId does not matches person as well as dependents in response mock', () => {
      expect(
        isMemberIdValidForUserAndDependents(responseMock, 'family-id08')
      ).toEqual(false);
    });
  });

  describe('isMasterIdValidForUserAndDependents()', () => {
    it('returns false if personList does not exists in response', () => {
      const responseMockNoPersonList = {
        locals: { masterIds: [], dependentMasterIds: ['master-id-mock1'] },
      } as unknown as Response;

      expect(
        isMasterIdValidForUserAndDependents(
          responseMockNoPersonList,
          'master-id-mock'
        )
      ).toEqual(false);
    });

    it('returns true if masterId matches any of logged in user profiles', () => {
      const responseMock = {
        locals: {
          masterIds: ['master-id-mock'],
          dependentMasterIds: [],
        },
      } as unknown as Response;

      expect(
        isMasterIdValidForUserAndDependents(responseMock, 'master-id-mock')
      ).toEqual(true);
    });

    it('returns true if masterId does not matches person but matches dependent', () => {
      const responseMock = {
        locals: {
          masterIds: [],
          dependentMasterIds: ['master-id-mock1'],
        },
      } as unknown as Response;

      expect(
        isMasterIdValidForUserAndDependents(responseMock, 'master-id-mock1')
      ).toEqual(true);
    });

    it('returns false if masterId does not matches person and there is no dependents in response mock', () => {
      const responseMockNoDependents = {
        locals: { masterIds: [], dependentMasterIds: ['master-id-mock1'] },
      } as unknown as Response;

      expect(
        isMasterIdValidForUserAndDependents(
          responseMockNoDependents,
          'master-id-invalid-mock'
        )
      ).toEqual(false);
    });

    it('returns false if masterId does not matches person as well as dependents in response mock', () => {
      expect(
        isMasterIdValidForUserAndDependents(
          responseMock,
          'master-id-invalid-mock'
        )
      ).toEqual(false);
    });
  });

  describe('getAllowedPersonsForLoggedInUser()', () => {
    it('returns empty array if personList does not exists in response', () => {
      const responseMockNoPersonList = {
        locals: {},
      } as unknown as Response;

      expect(
        getAllowedPersonsForLoggedInUser(responseMockNoPersonList)
      ).toEqual([]);
    });

    it('returns personList if there is no dependents in response mock', () => {
      const responseMockNoDependents = {
        locals: {
          device: {
            data: 'phone',
          },
          personList: [loggedInSieSecondary],
          dependents: [],
        },
      } as unknown as Response;
      expect(
        getAllowedPersonsForLoggedInUser(responseMockNoDependents)
      ).toEqual([loggedInSieSecondary]);
    });

    it('returns dependents as well as person if response local has both personList as well as dependents', () => {
      expect(getAllowedPersonsForLoggedInUser(responseMock)).toEqual([
        loggedInPersonCashPrimary,
        loggedInSiePrimary,
        cashDependent1,
        cashDependent2,
        cashAdultDependent,
        sieDependent1,
      ]);
    });
  });

  describe('getAllowedMemberIdsForLoggedInUser()', () => {
    it('returns empty array if personList does not exists in response', () => {
      const responseMockNoPersonList = {
        locals: {},
      } as unknown as Response;

      expect(
        getAllowedMemberIdsForLoggedInUser(responseMockNoPersonList)
      ).toEqual([]);
    });

    it('returns logged in users primary member Rx ids if there is no dependents in response mock', () => {
      const responseMockNoDependents = {
        locals: {
          device: {
            data: 'phone',
          },
          personList: [loggedInSiePrimary, loggedInPersonCashPrimary],
        },
      } as unknown as Response;
      expect(
        getAllowedMemberIdsForLoggedInUser(responseMockNoDependents)
      ).toEqual(['sie-family-id01', 'family-id-cash01']);
    });

    it('returns dependents primary member rx id as well as person primary member rx id if response local has both personList as well as dependents', () => {
      expect(getAllowedMemberIdsForLoggedInUser(responseMock)).toEqual([
        'family-id-cash01',
        'sie-family-id01',
        'family-id-cash03',
        'family-id-cash04',
        'family-id-cash02',
        'sie-family-id03',
      ]);
    });
  });

  describe('getLoggedInUserProfileForRxGroupType()', () => {
    it('returns undefined if personList does not exists in response', () => {
      const responseMockNoPersonList = {
        locals: {},
      } as unknown as Response;

      expect(
        getLoggedInUserProfileForRxGroupType(responseMockNoPersonList, 'CASH')
      ).toEqual(undefined);
    });

    it('returns logged in users profile matching for given rxGroupType', () => {
      expect(
        getLoggedInUserProfileForRxGroupType(responseMock, 'CASH')
      ).toEqual(loggedInPersonCashPrimary);
    });

    it('returns profile based on rxGrouptype and subgroup if multiple profile exists for rxgrouptype and subgroup is passed', () => {
      const responseMockMultipleRxGroupTypes = {
        locals: {
          device: {
            data: 'phone',
          },
          personList: [
            loggedInSiePrimary,
            loggedInPersonCashPrimary,
            loggedInPersonSmartPricePrimary,
          ],
        },
      } as unknown as Response;
      expect(
        getLoggedInUserProfileForRxGroupType(
          responseMockMultipleRxGroupTypes,
          'CASH',
          'CASH'
        )
      ).toEqual(loggedInPersonCashPrimary);
    });

    it('returns profile based on rxGrouptype and subgroup if multiple profile exists for rxgrouptype and subgroup is passed', () => {
      const responseMockMultipleRxGroupTypes = {
        locals: {
          device: {
            data: 'phone',
          },
          personList: [
            loggedInSiePrimary,
            loggedInPersonCashPrimary,
            loggedInPersonSmartPricePrimary,
          ],
        },
      } as unknown as Response;
      expect(
        getLoggedInUserProfileForRxGroupType(
          responseMockMultipleRxGroupTypes,
          'CASH',
          'SMARTPRICE'
        )
      ).toEqual(loggedInPersonSmartPricePrimary);
    });

    it('returns first profile based on rxGrouptype if multiple profile exists for rxgrouptype and subgroup is not passed', () => {
      const responseMockMultipleRxGroupTypes = {
        locals: {
          device: {
            data: 'phone',
          },
          personList: [
            loggedInSiePrimary,
            loggedInPersonCashPrimary,
            loggedInPersonSmartPricePrimary,
          ],
        },
      } as unknown as Response;
      expect(
        getLoggedInUserProfileForRxGroupType(
          responseMockMultipleRxGroupTypes,
          'CASH'
        )
      ).toEqual(loggedInPersonCashPrimary);
    });

    it('returns first profile based on rxGrouptype if multiple profile exists for rxgrouptype and subgroup is passed but does not match existing profiles', () => {
      const responseMockMultipleRxGroupTypes = {
        locals: {
          device: {
            data: 'phone',
          },
          personList: [
            loggedInSiePrimary,
            loggedInPersonCashPrimary,
            loggedInPersonSmartPricePrimary,
          ],
        },
      } as unknown as Response;
      expect(
        getLoggedInUserProfileForRxGroupType(
          responseMockMultipleRxGroupTypes,
          'CASH',
          'SMARTPRICE1'
        )
      ).toEqual(loggedInPersonCashPrimary);
    });
  });

  describe('getLoggedInUserPatientForRxGroupType()', () => {
    it('returns undefined if patientProfiles does not exist in response', () => {
      const responseMockNoPatientList = {
        locals: {} as IAppLocals,
      } as unknown as Response;

      expect(
        getLoggedInUserPatientForRxGroupType(responseMockNoPatientList, 'CASH')
      ).toEqual(undefined);
    });

    it('returns logged in users profile matching for given rxGroupType', () => {
      expect(
        getLoggedInUserPatientForRxGroupType(responsePatientMock, 'CASH')
      ).toEqual(loggedInPatientCashPrimary.primary);
    });
  });

  describe('getAllDependentsForPrimaryProfile()', () => {
    it('returns passed dependent as is if SIE profile person does not have a family id', async () => {
      const dependentsMockLocal: IPerson[] = [];
      const primaryProfileNoFamilyId = {
        dateOfBirth: '2001-01-01',
        firstName: 'user1',
        identifier: 'id-1',
        isPrimary: false,
        lastName: 'user1LastName',
        phoneNumber: 'phone',
        primaryMemberPersonCode: '01',
        primaryMemberRxId: 'family-id01',
      } as IPerson;
      const allDependents = await getAllDependentsForPrimaryProfile(
        databaseMock,
        primaryProfileNoFamilyId,
        dependentsMockLocal
      );
      expect(allDependents).toEqual([]);
      expect(searchAllMembersForFamilyIdMock).not.toHaveBeenCalled();
    });

    it('returns all dependents from Database for SIE user if loggedin user has familyID', async () => {
      searchAllMembersForFamilyIdMock.mockReturnValueOnce([
        loggedInSiePrimary,
        sieDependent1,
        sieAdultDependent,
      ]);
      const allDependents = await getAllDependentsForPrimaryProfile(
        databaseMock,
        loggedInSiePrimary,
        [sieDependent1]
      );
      expect(searchAllMembersForFamilyIdMock).toHaveBeenCalled();
      expect(searchAllMembersForFamilyIdMock).toHaveBeenCalledWith(
        databaseMock,
        loggedInSiePrimary.primaryMemberFamilyId
      );
      expect(allDependents).toEqual([sieDependent1, sieAdultDependent]);
    });
  });
});

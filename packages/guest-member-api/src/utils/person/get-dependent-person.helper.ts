// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { RxGroupTypes } from '@phx/common/src/models/member-profile/member-profile-info';
import { IPerson } from '@phx/common/src/models/person';
import { CalculateAbsoluteAge } from '@phx/common/src/utils/date-time-helper';
import { searchAllMembersForFamilyId } from '../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { getPersonCreationDataFromRedis } from '../../databases/redis/redis-query-helper';
import { getResponseLocal } from '../request/request-app-locals.helper';
import { sortMemberByPersonCode } from './person-helper';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { IPatient } from '../../models/fhir/patient/patient';

export const getAllAllowedFamilyMembersForFamily = async (
  database: IDatabase,
  personList: IPerson[],
  phoneNumber: string,
  childMemberAgeLimit: number
): Promise<IPerson[]> => {
  const dependentFamilyMembers: IPerson[] = [];
  for (const person of personList) {
    if (person.isPrimary && person.primaryMemberFamilyId) {
      const familyMembers: IPerson[] | null = await searchAllMembersForFamilyId(
        database,
        person.primaryMemberFamilyId
      );
      if (person.rxGroupType === 'CASH') {
        familyMembers
          .filter((member: IPerson) => member.identifier !== person.identifier)
          .map((member) => {
            dependentFamilyMembers.push(member);
          });
      } else {
        familyMembers
          .filter((member: IPerson) => member.identifier !== person.identifier)
          .map((member) => {
            const age = CalculateAbsoluteAge(getNewDate(), member.dateOfBirth);
            if (age < childMemberAgeLimit) {
              dependentFamilyMembers.push(member);
            }
          });
      }
    }
  }
  const personCreateDataInRedis: IPerson[] | undefined =
    await getPersonCreationDataFromRedis(phoneNumber);

  if (personCreateDataInRedis) {
    const dependentsFromRedis = personCreateDataInRedis.filter(
      (member) =>
        personList.filter(
          (self) => member.primaryMemberRxId === self.primaryMemberRxId
        ).length === 0 &&
        dependentFamilyMembers.filter(
          (dependent) =>
            dependent.primaryMemberRxId === member.primaryMemberRxId
        ).length === 0
    );
    if (dependentsFromRedis.length > 0) {
      dependentsFromRedis.map((redisDependent) => {
        dependentFamilyMembers.push(redisDependent);
      });
    }
  }
  return dependentFamilyMembers;
};

export const isMemberIdValidForUserAndDependents = (
  response: Response,
  memberId: string
): boolean => {
  const personList = getResponseLocal(response, 'personList');
  if (!personList) {
    return false;
  }
  if (
    personList &&
    personList.find((person) => person.primaryMemberRxId === memberId)
  ) {
    return true;
  }
  const dependents = getResponseLocal(response, 'dependents');
  if (!dependents) {
    return false;
  }
  if (
    dependents.find((dependent) => dependent.primaryMemberRxId === memberId)
  ) {
    return true;
  }
  return false;
};

export const isMasterIdValidForUserAndDependents = (
  response: Response,
  masterId?: string
): boolean => {
  const dependentMasterIds =
    getResponseLocal(response, 'dependentMasterIds') || [];
  const primaryMasterIds = getResponseLocal(response, 'masterIds') || [];

  if (!primaryMasterIds.length && !dependentMasterIds.length) {
    return false;
  }

  if (
    primaryMasterIds.find((primaryMasterId) => primaryMasterId === masterId)
  ) {
    return true;
  }

  if (
    dependentMasterIds.find(
      (dependentMasterId) => dependentMasterId === masterId
    )
  ) {
    return true;
  }

  return false;
};

export const getAllowedPersonsForLoggedInUser = (
  response: Response
): IPerson[] => {
  const personList = getResponseLocal(response, 'personList');
  if (!personList) {
    return [];
  }

  const dependents = getResponseLocal(response, 'dependents');
  if (!dependents) {
    return [...personList];
  }
  return [...personList, ...dependents];
};

export const getAllowedMemberIdsForLoggedInUser = (
  response: Response
): string[] => {
  const personList = getResponseLocal(response, 'personList');
  if (!personList) {
    return [];
  }

  const dependents = getResponseLocal(response, 'dependents');
  if (!dependents) {
    return [...personList.map((person) => person.primaryMemberRxId)];
  }
  return [
    ...personList.map((person) => person.primaryMemberRxId),
    ...dependents.map((dependent) => dependent.primaryMemberRxId),
  ];
};

export const getLoggedInUserProfileForRxGroupType = (
  response: Response,
  rxGroupType: RxGroupTypes,
  rxSubgroup?: string
): IPerson | undefined => {
  const personList = getResponseLocal(response, 'personList');
  if (!personList) {
    return undefined;
  }
  const profiles = personList.filter(
    (person) => person.rxGroupType === rxGroupType
  );
  if (profiles.length === 0) {
    return undefined;
  }

  if (profiles.length > 1 && rxSubgroup) {
    const profileSubgroupMatch = profiles.find(
      (person) => person.rxSubGroup === rxSubgroup
    );
    if (profileSubgroupMatch) {
      return profileSubgroupMatch;
    }
  }
  return profiles[0];
};

export const getLoggedInUserPatientForRxGroupType = (
  response: Response,
  rxGroupType: RxGroupTypes
): IPatient | undefined => {
  const patientProfiles = getResponseLocal(response, 'patientProfiles');
  if (!patientProfiles) {
    return undefined;
  }
  const profiles = patientProfiles.filter(
    (patient) => patient.rxGroupType === rxGroupType
  );
  if (profiles.length === 0) {
    return undefined;
  }

  return profiles[0].primary;
};

export const getAllDependentsForPrimaryProfile = async (
  database: IDatabase,
  primaryProfile: IPerson,
  dependents: IPerson[] = []
): Promise<IPerson[]> => {
  const dependentFamilyMembers: IPerson[] = dependents;
  if (primaryProfile.primaryMemberFamilyId) {
    const familyMembers: IPerson[] | null = await searchAllMembersForFamilyId(
      database,
      primaryProfile.primaryMemberFamilyId
    );
    familyMembers
      .filter(
        (member: IPerson) => member.identifier !== primaryProfile.identifier
      )
      .map((member) => {
        const isPresent = dependentFamilyMembers.some(
          (dependent) => dependent.identifier === member.identifier
        );
        if (!isPresent) {
          dependentFamilyMembers.push(member);
        }
      });
  }
  return dependentFamilyMembers;
};

export const getNextAvailablePersonCode = async (
  database: IDatabase,
  memberFamilyId: string
): Promise<string> => {
  const familyMembers = await searchAllMembersForFamilyId(
    database,
    memberFamilyId
  );
  if (familyMembers && familyMembers.length > 1) {
    const sortedFamilyMembers = sortMemberByPersonCode(familyMembers);
    const maxPersonCode: string =
      sortedFamilyMembers[sortedFamilyMembers.length - 1]
        .primaryMemberPersonCode;
    const nextPersonCode = parseInt(maxPersonCode, 10) + 1;
    return nextPersonCode < 10
      ? '0' + nextPersonCode.toString()
      : nextPersonCode.toString();
  }
  return '03';
};

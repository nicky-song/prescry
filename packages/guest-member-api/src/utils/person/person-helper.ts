// Copyright 2018 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import {
  CalculateAbsoluteAge,
  UTCDateString,
} from '@phx/common/src/utils/date-time-helper';
import { IMemberDetails } from '../../models/member-details';
import { IMember } from '../../models/member';
import {
  IDependentProfile,
  ILimitedAccount,
  IPrimaryProfile,
  RxGroupTypesEnum,
} from '@phx/common/src/models/member-profile/member-profile-info';
import { IAccount } from '@phx/common/src/models/account';
import { getResponseLocal } from '../request/request-app-locals.helper';
import { Response } from 'express';
import { ApiConstants } from '../../constants/api-constants';
import { searchPersonByMasterIdAndRxGroupType } from '../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';

export const sortMemberByPersonCode = (members: IPerson[]): IPerson[] => {
  return members.sort((first: IPerson, second: IPerson) => {
    return (
      parseInt(first.primaryMemberPersonCode, 10) -
      parseInt(second.primaryMemberPersonCode, 10)
    );
  });
};

export const getFirstOrDefault = (
  members: IPerson[],
  sorter: (members: IPerson[]) => IPerson[]
): IPerson | undefined => {
  if (!members || members.length === 0) {
    return undefined;
  }
  return getFirstOrDefaultForPersonList(members, sorter);
};

export const getFirstOrDefaultForPersonList = (
  members: IPerson[],
  sorter: (members: IPerson[]) => IPerson[]
): IPerson => {
  if (members.length === 1) {
    return members[0];
  }
  const sorted = sorter(members);
  return sorted[0];
};

export const filterMembers = (
  members: IMemberDetails[],
  isloggedInUserPrimary: boolean,
  loggedInUserIdentifier: string,
  childMemberAgeLimit: number
) => {
  const childMembersList: IMember[] = [];
  const adultMembersList: IMember[] = [];

  members.map((member) => {
    const age = CalculateAbsoluteAge(new Date(), member.dateOfBirth);
    if (age >= childMemberAgeLimit) {
      adultMembersList.push(mapLimitedMemberDetails(member, age));
    } else {
      if (isloggedInUserPrimary) {
        childMembersList.push(mapChildMemberDetails(member, age));
      } else {
        if (
          member.secondaryAlertChildCareTakerIdentifier ===
          loggedInUserIdentifier
        ) {
          childMembersList.push(mapLimitedMemberDetails(member, age));
        }
      }
    }
  });

  return { childMembers: childMembersList, adultMembers: adultMembersList };
};

export const mapChildMemberDetails = (
  member: IMemberDetails,
  age: number
): IMember => {
  return {
    email: member.email,
    firstName: member.firstName,
    identifier: member.identifier,
    isLimited: false,
    isPhoneNumberVerified: member.isPhoneNumberVerified,
    isPrimary: member.isPrimary,
    lastName: member.lastName,
    phoneNumber: member.phoneNumber,
    primaryMemberFamilyId: member.primaryMemberFamilyId,
    primaryMemberPersonCode: member.primaryMemberPersonCode,
    primaryMemberRxId: member.primaryMemberRxId,
    secondaryAlertChildCareTakerIdentifier:
      member.secondaryAlertChildCareTakerIdentifier,
    age,
  };
};

export const mapLimitedMemberDetails = (
  member: IMemberDetails,
  age: number
): IMember => {
  return {
    firstName: member.firstName,
    identifier: member.identifier,
    isLimited: true,
    isPrimary: member.isPrimary,
    lastName: member.lastName,
    age,
  };
};

export const filterDependentsBasedOnAgeAndFamilyId = (
  members: IPerson[],
  isloggedInUserPrimary: boolean,
  loggedInUserIdentifier: string,
  childMemberAgeLimit: number,
  familyId: string
) => {
  const childMembersList: IDependentProfile[] = [];
  const adultMembersList: IDependentProfile[] = [];

  members.map((member) => {
    const age = CalculateAbsoluteAge(new Date(), member.dateOfBirth);
    if (!!familyId && member.primaryMemberFamilyId === familyId) {
      if (age >= childMemberAgeLimit) {
        adultMembersList.push(mapLimitedAdultDependentDetails(member, age));
      } else {
        if (isloggedInUserPrimary) {
          childMembersList.push(mapChildDependentDetails(member, age));
        } else {
          if (
            member.secondaryAlertChildCareTakerIdentifier ===
            loggedInUserIdentifier
          ) {
            childMembersList.push(mapLimitedAdultDependentDetails(member, age));
          }
        }
      }
    }
  });

  return { childMembers: childMembersList, adultMembers: adultMembersList };
};

export const mapPrimaryProfileDetails = (member: IPerson): IPrimaryProfile => {
  return {
    firstName: member.firstName,
    lastName: member.lastName,
    dateOfBirth: member.dateOfBirth,
    identifier: member.identifier,
    isPhoneNumberVerified: member.isPhoneNumberVerified,
    primaryMemberFamilyId: member.primaryMemberFamilyId,
    primaryMemberPersonCode: member.primaryMemberPersonCode,
    primaryMemberRxId: member.primaryMemberRxId,
    phoneNumber: member.phoneNumber,
    isPrimary: member.isPrimary,
    isLimited: false,
    secondaryAlertCarbonCopyIdentifier:
      member.secondaryAlertCarbonCopyIdentifier,
    secondaryAlertChildCareTakerIdentifier:
      member.secondaryAlertChildCareTakerIdentifier,
    issuerNumber: member.issuerNumber,
    brokerAssociation: member.brokerAssociation,
    rxGroup: member.rxGroup,
    rxGroupType: member.rxGroupType,
    rxSubGroup: member.rxSubGroup ?? ApiConstants.CASH_USER_RX_SUB_GROUP,
    rxBin: member.rxBin,
    carrierPCN: member.carrierPCN,
    address1: member.address1,
    address2: member.address2,
    city: member.city,
    state: member.state,
    zip: member.zip,
    county: member.county,
    masterId: member.masterId,
    accountId: member.accountId,
  };
};

export const mapAccountDetails = (account: IAccount): ILimitedAccount => {
  return {
    firstName: account.firstName,
    lastName: account.lastName,
    dateOfBirth: account.dateOfBirth
      ? UTCDateString(account.dateOfBirth)
      : undefined,
    recoveryEmail: account.recoveryEmail,
    phoneNumber: account.phoneNumber,
    favoritedPharmacies: account.favoritedPharmacies ?? [],
    isFavoritedPharmaciesFeatureKnown:
      account.isFavoritedPharmaciesFeatureKnown,
    languageCode: account.languageCode,
  };
};

export const mapChildDependentDetails = (
  member: IPerson,
  age: number
): IDependentProfile => {
  return {
    firstName: member.firstName,
    lastName: member.lastName,
    identifier: member.identifier,
    isLimited: false,
    isPrimary: member.isPrimary,
    primaryMemberFamilyId: member.primaryMemberFamilyId,
    primaryMemberPersonCode: member.primaryMemberPersonCode,
    primaryMemberRxId: member.primaryMemberRxId,
    secondaryAlertChildCareTakerIdentifier:
      member.secondaryAlertChildCareTakerIdentifier,
    secondaryAlertCarbonCopyIdentifier:
      member.secondaryAlertCarbonCopyIdentifier,
    age,
    rxGroupType: member.rxGroupType,
    rxSubGroup: member.rxSubGroup ?? ApiConstants.CASH_USER_RX_SUB_GROUP,
    email: member.email,
    phoneNumber: member.phoneNumber,
    masterId: member.masterId,
  };
};

export const mapLimitedAdultDependentDetails = (
  member: IPerson,
  age: number
): IDependentProfile => {
  return {
    firstName: member.firstName,
    lastName: member.lastName,
    identifier: member.identifier,
    isLimited: true,
    isPrimary: member.isPrimary,
    age,
    rxGroupType: member.rxGroupType,
    rxSubGroup: member.rxSubGroup ?? ApiConstants.CASH_USER_RX_SUB_GROUP,
    masterId: member.masterId,
  };
};

export const getLoggedInMemberRxIds = (response: Response) => {
  const personList = getResponseLocal(response, 'personList');
  return personList ? personList.map((person) => person.primaryMemberRxId) : [];
};

export const getMasterIdsFromPersonList = (personList: IPerson[]) => {
  const loggedInMasterIds: string[] = [];
  if (personList.length) {
    for (const person of personList) {
      if (person.masterId) {
        loggedInMasterIds.push(person.masterId);
      }
    }
  }
  return [...new Set(loggedInMasterIds)];
};

export const masterIdExistInPersonCollection = async (
  database: IDatabase,
  masterId: string
): Promise<boolean> => {
  const personInfo = await searchPersonByMasterIdAndRxGroupType(
    database,
    masterId,
    RxGroupTypesEnum.CASH
  );
  if (personInfo) {
    return true;
  }
  return false;
};

export const getZipFromPersonList = (
  personList: IPerson[]
): string | undefined => {
  const personWithZipCode = personList.find((x) => x.zip);
  return personWithZipCode?.zip;
};

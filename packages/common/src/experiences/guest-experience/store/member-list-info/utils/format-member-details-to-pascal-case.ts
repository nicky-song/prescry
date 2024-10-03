// Copyright 2018 Prescryptive Health, Inc.

import { IMemberContactInfo } from '../../../../../models/member-info/member-contact-info';
import {
  IDependentProfile,
  ILimitedAccount,
  IProfile,
} from '../../../../../models/member-profile/member-profile-info';
import { StringFormatter } from '../../../../../utils/formatters/string.formatter';

export const formatMemberDetailsToPascalCase = (list: IMemberContactInfo[]) => {
  return list.map((member: IMemberContactInfo): IMemberContactInfo => {
    return {
      ...member,
      firstName: StringFormatter.trimAndConvertToNameCase(member.firstName),
      lastName: StringFormatter.trimAndConvertToNameCase(member.lastName),
    };
  });
};

export const formatAccountDetailsToPascalCase = (list: ILimitedAccount) => {
  return {
    ...list,
    firstName: StringFormatter.trimAndConvertToNameCase(list.firstName),
    lastName: StringFormatter.trimAndConvertToNameCase(list.lastName),
  };
};

export const formatMemberProfileListToPascalCase = (list: IProfile[]) => {
  return list.map((profile: IProfile): IProfile => {
    return {
      ...profile,
      primary: {
        ...profile.primary,
        firstName:
          StringFormatter.trimAndConvertToNameCase(profile.primary.firstName) ??
          profile.primary.firstName,
        lastName:
          StringFormatter.trimAndConvertToNameCase(profile.primary.lastName) ??
          profile.primary.lastName,
      },
      adultMembers: profile.adultMembers
        ? formatMemberDependentProfileListToPascalCase(profile.adultMembers)
        : profile.adultMembers,
      childMembers: profile.childMembers
        ? formatMemberDependentProfileListToPascalCase(profile.childMembers)
        : profile.childMembers,
    };
  });
};

export const formatMemberDependentProfileListToPascalCase = (
  list: IDependentProfile[]
) => {
  return list.map((profile: IDependentProfile): IDependentProfile => {
    return {
      ...profile,
      firstName:
        StringFormatter.trimAndConvertToNameCase(profile.firstName) ??
        profile.firstName,
      lastName:
        StringFormatter.trimAndConvertToNameCase(profile.lastName) ??
        profile.lastName,
    };
  });
};

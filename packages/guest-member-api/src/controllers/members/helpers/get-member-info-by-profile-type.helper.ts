// Copyright 2021 Prescryptive Health, Inc.

import {
  IProfile,
  RxGroupTypes,
} from '@phx/common/src/models/member-profile/member-profile-info';
import { IPerson } from '@phx/common/src/models/person';
import { assertHasFamilyId } from '../../../assertions/assert-has-family-id';
import {
  filterDependentsBasedOnAgeAndFamilyId,
  mapPrimaryProfileDetails,
} from '../../../utils/person/person-helper';

export const getMemberInfoBasedOnProfileType = (
  profile: IPerson,
  allDependents: IPerson[],
  type: RxGroupTypes,
  ageLimit: number
) => {
  const familyId = profile.primaryMemberFamilyId;
  assertHasFamilyId(familyId);

  const { childMembers, adultMembers } = filterDependentsBasedOnAgeAndFamilyId(
    allDependents,
    profile.isPrimary,
    profile.identifier,
    ageLimit,
    familyId
  );
  return {
    rxGroupType: type,
    primary: mapPrimaryProfileDetails(profile),
    childMembers,
    adultMembers,
  } as IProfile;
};

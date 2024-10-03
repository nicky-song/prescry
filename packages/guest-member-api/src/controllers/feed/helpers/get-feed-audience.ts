// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { FeedAudience } from '../../../models/feed-audience';
import { IPerson } from '@phx/common/src/models/person';
import { ApiConstants } from '../../../constants/api-constants';
import { RxGroupTypes } from '@phx/common/src/models/member-profile/member-profile-info';
import { featureSwitchOverrideRxGroupType } from '../../../utils/features/feature-switch-override';
import { getAllowedPersonsForLoggedInUser } from '../../../utils/person/get-dependent-person.helper';
import {
  getAllActivePatientsForLoggedInUser,
  getAllMemberIdsFromPatients,
} from '../../../utils/fhir-patient/patient.helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { IPatientProfile } from '../../../models/patient-profile';

export const getFeedAudience = (response: Response): FeedAudience => {
  const memberList: IPerson[] =
    getAllowedPersonsForLoggedInUser(response) || [];

  const rxGroupTypes = distinct(memberList, (p) => p.rxGroupType);
  const members = distinct(memberList, (p) => p.primaryMemberRxId);

  const rxGroupTypeOverride = featureSwitchOverrideRxGroupType(
    response,
    memberList
  );
  if (rxGroupTypeOverride) {
    return { rxGroupTypes: [rxGroupTypeOverride], members };
  }
  if (shouldDefaultGroupType(memberList, rxGroupTypes)) {
    return { rxGroupTypes: [ApiConstants.DEFAULT_RX_GROUP_TYPE], members };
  }
  return { rxGroupTypes, members };
};

export const getFeedAudienceV2 = (response: Response): FeedAudience => {
  const patients = getAllActivePatientsForLoggedInUser(response);

  const patientProfiles = getRequiredResponseLocal(response, 'patientProfiles');

  const rxGroupTypes = distinct(patientProfiles, (p) => p.rxGroupType);

  const members = getAllMemberIdsFromPatients(patients);

  const memberList: IPerson[] =
    getAllowedPersonsForLoggedInUser(response) || [];

  const rxGroupTypeOverride = featureSwitchOverrideRxGroupType(
    response,
    memberList
  );
  if (rxGroupTypeOverride) {
    return { rxGroupTypes: [rxGroupTypeOverride], members };
  }
  if (shouldDefaultGroupTypeV2(patientProfiles, rxGroupTypes)) {
    return { rxGroupTypes: [ApiConstants.DEFAULT_RX_GROUP_TYPE], members };
  }
  return { rxGroupTypes, members };
};

const shouldDefaultGroupType = (
  memberList: IPerson[],
  rxGroupTypes: RxGroupTypes[]
) => memberList?.length && !rxGroupTypes.length;

const shouldDefaultGroupTypeV2 = (
  memberList: IPatientProfile[],
  rxGroupTypes: RxGroupTypes[]
) => memberList?.length && !rxGroupTypes.length;

const distinct = <T, V>(items: T[], select: (item: T) => V) => {
  return [...new Set(items?.map((o) => select(o)).filter((f) => f))];
};

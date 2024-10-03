// Copyright 2018 Prescryptive Health, Inc.

import { IFeaturesState } from '../experiences/guest-experience/guest-experience-features';
import {
  IDependentProfile,
  IPrimaryProfile,
  IProfile,
  RxGroupTypes,
  RxGroupTypesEnum,
} from '../models/member-profile/member-profile-info';
import {
  IPatientDependentsResponse,
  IPatientProfileResponse,
} from '../models/patient-profile/patient-profile';
import { CalculateAbsoluteAge } from './date-time-helper';

export interface IMapPatientDependentsResponse {
  childDependents: IDependentProfile[];
  adultDependents: IDependentProfile[];
}

export function getProfileName(
  firstName: string | undefined,
  lastName: string | undefined
): string {
  let profileName = '';
  if (firstName && lastName) {
    profileName = `${firstName} ${lastName}`;
  } else if (firstName) {
    profileName = firstName;
  } else if (lastName) {
    profileName = lastName;
  }
  return profileName;
}

export function getProfilesByGroup(
  profileList: IProfile[],
  rxGroupType: RxGroupTypes,
  patientList?: IPatientProfileResponse[]
): IProfile[] {
  if (patientList) {
    const profiles: IProfile[] = [];

    const filteredPatientList = patientList.filter(
      (patient) => patient.rxGroupType === rxGroupType
    );

    for (const patient of filteredPatientList) {
      const personProfile = profileList.find(
        (profile) =>
          profile.primary.primaryMemberRxId === patient.primary.memberId
      );

      const primary = {
        identifier: personProfile?.primary.identifier,
        firstName: patient?.primary?.firstName,
        lastName: patient?.primary?.lastName,
        dateOfBirth: patient?.primary?.dateOfBirth,
        rxGroupType: patient?.primary?.rxGroupType,
        rxSubGroup: patient?.primary?.rxSubGroup,
        phoneNumber: patient?.primary?.phoneNumber,
        masterId: patient?.primary.masterId,
        primaryMemberRxId: patient?.primary?.memberId,
        email: patient?.primary?.recoveryEmail,
        isPrimary: true,
        primaryMemberFamilyId: personProfile?.primary.primaryMemberFamilyId,
        secondaryAlertChildCareTakerIdentifier:
          personProfile?.primary.secondaryAlertChildCareTakerIdentifier,
        secondaryAlertCarbonCopyIdentifier:
          personProfile?.primary.secondaryAlertCarbonCopyIdentifier,
      } as IPrimaryProfile;

      const profile = {
        rxGroupType: patient?.primary?.rxGroupType,
        primary,
        childMembers: personProfile?.childMembers,
        adultMembers: personProfile?.adultMembers,
      } as IProfile;

      profiles.push(profile);
    }

    return profiles;
  }

  if (profileList) {
    return profileList.filter((profile) => profile.rxGroupType === rxGroupType);
  }
  return [];
}

export const getHighestPriorityProfile = (profileList: IProfile[]) => {
  if (profileList.length === 0) {
    return undefined;
  }

  if (profileList.length > 1) {
    const filteredProfileList = profileList.filter(
      (profile: IProfile) => profile.rxGroupType === RxGroupTypesEnum.SIE
    );
    if (filteredProfileList && filteredProfileList.length >= 1) {
      return filteredProfileList[0];
    }
  }
  return profileList[0];
};

export function getProfileByMemberRxId(
  profileList: IProfile[],
  memberRxId?: string
): IProfile | undefined {
  if (!memberRxId || profileList.length === 0) {
    return undefined;
  }
  return profileList.find(
    (profile) =>
      profile.primary.primaryMemberRxId === memberRxId ||
      profile.childMembers?.find(
        (member) => member.primaryMemberRxId === memberRxId
      ) ||
      profile.adultMembers?.find(
        (member) => member.primaryMemberRxId === memberRxId
      )
  );
}

export const isPbmMember = (
  profileList: IProfile[] = [],
  features: IFeaturesState
) => {
  if (features.usegrouptypesie) {
    return true;
  }

  if (features.usegrouptypecash || features.usegrouptypecovid) {
    return false;
  }

  return profileList?.some((profile) =>
    isPbmGroupType(profile.rxGroupType as RxGroupTypes)
  );
};

export const isPbmGroupType = (rxGroupType: RxGroupTypes): boolean =>
  rxGroupType === RxGroupTypesEnum.SIE;

export const mapPatientDependents = (
  patientDependents: IPatientDependentsResponse[],
  rxGroupType: string = RxGroupTypesEnum.CASH,
  personProfile?: IProfile
): IMapPatientDependentsResponse => {
  const personChildMembers = personProfile?.childMembers ?? [];
  const personAdultMembers = personProfile?.adultMembers ?? [];

  const childDependents: IDependentProfile[] = [];
  const adultDependents: IDependentProfile[] = [];

  for (const dependents of patientDependents) {
    if (dependents.rxGroupType === rxGroupType) {
      const childActiveMembers = dependents.childMembers?.activePatients ?? [];
      const adultActiveMembers = dependents.adultMembers?.activePatients ?? [];

      for (const patient of childActiveMembers) {
        const personChildMember = personChildMembers.find(
          (person) => person.primaryMemberRxId === patient.memberId
        );

        const age = CalculateAbsoluteAge(new Date(), patient.dateOfBirth);

        const childDependent = {
          identifier: personChildMember?.identifier,
          firstName: patient?.firstName,
          lastName: patient?.lastName,
          rxGroupType: patient?.rxGroupType,
          rxSubGroup: patient?.rxSubGroup,
          phoneNumber: patient?.phoneNumber,
          masterId: patient?.masterId,
          primaryMemberRxId: patient?.memberId,
          primaryMemberFamilyId: personChildMember?.primaryMemberFamilyId,
          secondaryAlertChildCareTakerIdentifier:
            personChildMember?.secondaryAlertChildCareTakerIdentifier,
          secondaryAlertCarbonCopyIdentifier:
            personChildMember?.secondaryAlertCarbonCopyIdentifier,
          email: patient?.recoveryEmail,
          isPrimary: false,
          age,
        } as IDependentProfile;

        childDependents.push(childDependent);
      }

      for (const patient of adultActiveMembers) {
        const personAdultMember = personAdultMembers.find(
          (person) => person.primaryMemberRxId === patient.memberId
        );

        const age = CalculateAbsoluteAge(new Date(), patient.dateOfBirth);

        const childDependent = {
          identifier: personAdultMember?.identifier,
          firstName: patient?.firstName,
          lastName: patient?.lastName,
          rxGroupType: patient?.rxGroupType,
          rxSubGroup: patient?.rxSubGroup,
          phoneNumber: patient?.phoneNumber,
          masterId: patient?.masterId,
          primaryMemberRxId: patient?.memberId,
          primaryMemberFamilyId: personAdultMember?.primaryMemberFamilyId,
          secondaryAlertChildCareTakerIdentifier:
            personAdultMember?.secondaryAlertChildCareTakerIdentifier,
          secondaryAlertCarbonCopyIdentifier:
            personAdultMember?.secondaryAlertCarbonCopyIdentifier,
          email: patient?.recoveryEmail,
          isPrimary: false,
          age,
        } as IDependentProfile;

        adultDependents.push(childDependent);
      }
    }
  }

  return {
    childDependents,
    adultDependents,
  };
};

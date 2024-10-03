// Copyright 2022 Prescryptive Health, Inc.

import { Response } from 'express';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { ILimitedPatient } from '@phx/common/src/models/patient-profile/limited-patient';
import {
  IActiveExpiredPatientsResponse,
  IPatientDependentsResponse,
  IPatientProfileResponse,
} from '@phx/common/src/models/patient-profile/patient-profile';
import { formatPhoneNumberForApi } from '@phx/common/src/utils/formatters/phone-number.formatter';
import { ApiConstants } from '../../constants/api-constants';
import { IConfiguration } from '../../configuration';
import { Identifier } from '../../models/fhir/identifier';
import {
  IPatient,
  PatientIdentifierCodeableConceptCode,
} from '../../models/fhir/patient/patient';
import {
  IPatientDependents,
  IPatientProfile,
} from '../../models/patient-profile';
import {
  getMobileContactPhone,
  getPreferredEmailFromPatient,
} from '../fhir-patient/get-contact-info-from-patient';
import {
  buildFirstName,
  buildLastName,
  getHumanName,
  matchFirstName,
} from '../fhir/human-name.helper';
import { getPatientCoverageByFamilyId } from '../coverage/get-patient-coverage-by-family-id';
import { getRequiredResponseLocal } from '../request/request-app-locals.helper';
import { assertHasDateOfBirth } from '../../assertions/assert-has-date-of-birth';
import { getMemberIdFromPatient } from './patient-identifier.helper';

const identifierTypeSystemUrl = 'http://hl7.org/fhir/ValueSet/identifier-type';

export interface IGetPatientAndDependentInfoResponse {
  patients: IPatientProfileResponse[];
  dependents: IPatientDependentsResponse[];
}

export const formatDependentNumber = (dependentNumber: number): string =>
  dependentNumber.toString().padStart(2, '0');

export const buildMemberId = (
  familyId: string,
  dependentNumber: number
): string => `${familyId}${formatDependentNumber(dependentNumber)}`;

export const buildPatientIdentifiers = (
  familyId: string,
  memberId: string,
  phoneNumber: string,
  isDependent?: boolean
): Identifier[] => [
  ...(!isDependent
    ? [
        {
          type: {
            coding: [
              {
                code: PatientIdentifierCodeableConceptCode.PHONE_NUMBER,
                display: "Patient's MyRx Phone Number",
                system: identifierTypeSystemUrl,
              },
            ],
          },
          value: formatPhoneNumberForApi(phoneNumber),
        },
      ]
    : []),
  {
    type: {
      coding: [
        {
          code: PatientIdentifierCodeableConceptCode.MEMBER_ID,
          display: 'Unique MyRx ID',
          system: identifierTypeSystemUrl,
        },
      ],
    },
    value: memberId,
  },
  {
    type: {
      coding: [
        {
          code: PatientIdentifierCodeableConceptCode.FAMILY_ID,
          display: "Patient's Cash Family Id",
          system: identifierTypeSystemUrl,
        },
      ],
    },
    value: familyId,
  },
];

export const arePatientIdentityDetailsValid = (
  patient: IPatient,
  phoneNumber: string,
  emailAddress: string,
  dateOfBirth: string
): boolean => {
  return (
    doesPatientPhoneNumberMatch(patient, phoneNumber) &&
    doesPatientEmailMatch(patient, emailAddress) &&
    doesPatientBirthDateMatch(patient, dateOfBirth)
  );
};

export const doesPatientPhoneNumberMatch = (
  patient: IPatient,
  phoneNumber: string
): boolean => getMobileContactPhone(patient) === phoneNumber;

export const doesPatientEmailMatch = (
  patient: IPatient,
  email: string
): boolean =>
  getPreferredEmailFromPatient(patient)?.toLowerCase() === email.toLowerCase();

export const doesPatientBirthDateMatch = (
  patient: IPatient,
  birthDate: string
): boolean => patient.birthDate === birthDate;

export const doPatientNamesMatch = (
  patient: IPatient,
  firstName: string,
  lastName: string
): boolean => {
  const name = getHumanName(patient.name, 'official');

  return (
    buildLastName(name).toLowerCase() === lastName.toLowerCase() &&
    !!matchFirstName(firstName, name ? [name] : [])
  );
};

export const getPatientWithMemberId = (
  patients: IPatient[],
  memberId: string
): IPatient | undefined =>
  patients.find((patient) => getMemberIdFromPatient(patient) === memberId);

export const doPatientFirstNameMatch = (
  patient: IPatient,
  firstName: string
): boolean => {
  const name = getHumanName(patient.name, 'official');

  return !!matchFirstName(firstName, name ? [name] : []);
};

export const mapPatientDependentsToResponse = (
  dependentsList: IPatientDependents[]
): IPatientDependentsResponse[] => {
  const dependentResponse: IPatientDependentsResponse[] = [];

  for (const dependents of dependentsList) {
    const childMembersActivePatients =
      dependents.childMembers?.activePatients ?? [];

    const childMembersExpiredPatients =
      dependents.childMembers?.expiredPatients ?? [];

    const childMembers: IActiveExpiredPatientsResponse = {
      activePatients: mapPatientsToLimitedPatients(
        childMembersActivePatients,
        dependents.rxGroupType,
        true
      ),
      expiredPatients: mapPatientsToLimitedPatients(
        childMembersExpiredPatients,
        dependents.rxGroupType,
        true
      ),
    };

    const adultMembersActivePatients =
      dependents.adultMembers?.activePatients ?? [];

    const adultMembersExpiredPatients =
      dependents.adultMembers?.expiredPatients ?? [];

    const adultMembers: IActiveExpiredPatientsResponse = {
      activePatients: mapPatientsToLimitedPatients(
        adultMembersActivePatients,
        dependents.rxGroupType
      ),
      expiredPatients: mapPatientsToLimitedPatients(
        adultMembersExpiredPatients,
        dependents.rxGroupType
      ),
    };

    dependentResponse.push({
      rxGroupType: dependents.rxGroupType,
      childMembers,
      adultMembers,
    });
  }

  return dependentResponse;
};

export const mapPatientProfileToResponse = (
  patientProfileList: IPatientProfile[]
): IPatientProfileResponse[] => {
  const patientProfileResponse: IPatientProfileResponse[] = [];

  for (const patientProfile of patientProfileList) {
    const limitedPatient = mapPatientToLimitedPatient(
      patientProfile.primary,
      patientProfile.rxGroupType
    );

    patientProfileResponse.push({
      rxGroupType: patientProfile.rxGroupType,
      primary: limitedPatient,
    });
  }

  return patientProfileResponse;
};

export const mapPatientsToLimitedPatients = (
  patients: IPatient[],
  rxGroupType: string,
  isChildMember?: boolean
): ILimitedPatient[] => {
  const patientsResponse: ILimitedPatient[] = [];

  for (const patient of patients) {
    const limitedPatient = mapPatientToLimitedPatient(
      patient,
      rxGroupType,
      isChildMember
    );

    patientsResponse.push(limitedPatient);
  }

  return patientsResponse;
};

export const mapPatientToLimitedPatient = (
  patient: IPatient,
  rxGroupType: string,
  isChildMember?: boolean
): ILimitedPatient => {
  const name = getHumanName(patient.name, 'official');

  const patientPhoneNumber = getMobileContactPhone(patient);

  const recoveryEmail = getPreferredEmailFromPatient(patient);

  const memberId =
    patient?.identifier?.find((idr) =>
      idr?.type?.coding?.some(
        (cod) => cod?.code === PatientIdentifierCodeableConceptCode.UNIQUE_ID
      )
    )?.value ||
    patient?.identifier?.find((idr) =>
      idr?.type?.coding?.some(
        (cod) => cod?.code === PatientIdentifierCodeableConceptCode.MEMBER_ID
      )
    )?.value;

  const birthDate = patient.birthDate;

  assertHasDateOfBirth(birthDate);

  return {
    firstName: buildFirstName(name),
    lastName: buildLastName(name),
    dateOfBirth: patient.birthDate,
    rxGroupType,
    rxSubGroup:
      rxGroupType === RxGroupTypesEnum.CASH
        ? ApiConstants.CASH_USER_RX_SUB_GROUP
        : ApiConstants.SIE_USER_RX_SUB_GROUP,
    phoneNumber: isChildMember ? '' : patientPhoneNumber,
    masterId: patient.id,
    recoveryEmail,
    memberId,
  } as ILimitedPatient;
};

export const getPatientAndDependentsInfo = (
  patientProfiles: IPatientProfile[],
  dependentList: IPatientDependents[]
): IGetPatientAndDependentInfoResponse => {
  const dependents: IPatientDependentsResponse[] =
    mapPatientDependentsToResponse(dependentList);

  const patients: IPatientProfileResponse[] =
    mapPatientProfileToResponse(patientProfiles);

  return { dependents, patients };
};

export const getPatientDependentByMasterIdAndRxGroupType = (
  patientDependents: IPatientDependents[],
  masterId: string,
  rxGroupType: RxGroupTypesEnum
): IPatient | undefined => {
  const patients: IPatient[] = [];

  for (const patient of patientDependents) {
    if (patient.rxGroupType === rxGroupType) {
      if (patient.childMembers) {
        for (const dep of patient.childMembers.activePatients) {
          if (dep?.id === masterId) patients.push(dep);
        }
      }
      if (patient.adultMembers) {
        for (const dep of patient.adultMembers.activePatients) {
          if (dep?.id === masterId) patients.push(dep);
        }
      }
    }
  }

  const patient = patients[0];

  return patient;
};

export const getNextAvailablePersonCodePatientCoverages = async (
  primaryMemberFamilyId: string,
  configuration: IConfiguration
): Promise<number> => {
  const defaultFirstDependentCodeNum = 3;

  const personCodes: number[] = [];

  const patientCoverages = await getPatientCoverageByFamilyId(
    configuration,
    primaryMemberFamilyId
  );

  if (patientCoverages) {
    for (const coverage of patientCoverages) {
      const dependent = coverage.dependent;

      if (dependent) {
        const dependentNumber = parseInt(dependent, 10);

        personCodes.push(dependentNumber);
      }
    }
  }

  if (personCodes.length > 1) {
    const nextAvailablePersonCodeNum = Math.max(...personCodes) + 1;

    return nextAvailablePersonCodeNum;
  }

  return defaultFirstDependentCodeNum;
};

export const getAllActivePatientsForLoggedInUser = (
  response: Response
): IPatient[] => {
  const patientProfiles =
    getRequiredResponseLocal(response, 'patientProfiles') ?? [];

  const patientDependents =
    getRequiredResponseLocal(response, 'patientDependents') ?? [];

  const patients: IPatient[] = [];

  for (const profile of patientProfiles) {
    patients.push(profile.primary);
  }

  for (const dependents of patientDependents) {
    const adultActivePatients = dependents.adultMembers?.activePatients ?? [];
    const childActivePatients = dependents.childMembers?.activePatients ?? [];

    patients.push(...adultActivePatients);

    patients.push(...childActivePatients);
  }

  return patients;
};

export const getAllMemberIdsFromPatients = (patients: IPatient[]): string[] => {
  const memberIds: string[] = [];

  const identifierCodes = new Set([
    PatientIdentifierCodeableConceptCode.MEMBER_ID,
    PatientIdentifierCodeableConceptCode.UNIQUE_ID,
  ] as string[]);

  for (const patient of patients) {
    const memberId = patient.identifier?.find((idr) =>
      idr?.type?.coding?.some(
        (cod) => cod.code && identifierCodes.has(cod.code)
      )
    )?.value;

    if (memberId) {
      memberIds.push(memberId);
    }
  }

  return memberIds;
};

export const getAllPrimaryMemberIdsFromPatients = (
  response: Response
): string[] => {
  const patientProfiles =
    getRequiredResponseLocal(response, 'patientProfiles') ?? [];

  const patients: IPatient[] = [];

  const memberIds: string[] = [];

  for (const profile of patientProfiles) {
    patients.push(profile.primary);
  }

  memberIds.push(...getAllMemberIdsFromPatients(patients));

  return memberIds;
};

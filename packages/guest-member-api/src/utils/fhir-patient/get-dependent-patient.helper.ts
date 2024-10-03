// Copyright 2022 Prescryptive Health, Inc.

import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { CalculateAbsoluteAge } from '@phx/common/src/utils/date-time-helper';
import { IConfiguration } from '../../configuration';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import { IPatient } from '../../models/fhir/patient/patient';
import {
  IPatientDependents,
  IPatientProfile,
} from '../../models/patient-profile';
import { getPatientCoverageByFamilyId } from '../coverage/get-patient-coverage-by-family-id';
import { getPatientCoverageByQuery } from '../external-api/coverage/get-patient-coverage-by-query';
import { getPatientByMasterId } from '../external-api/identity/get-patient-by-master-id';
import { getMasterIdFromCoverage } from '../get-master-id-from-coverage.helper';
import { getActiveCoveragesOfPatient } from './get-active-coverages-of-patient';

interface ICoverageKeys {
  [key: string]: ICoverage[];
}

export const getAllFamilyMembersOfLoggedInUser = async (
  configuration: IConfiguration,
  patientProfiles: IPatientProfile[]
): Promise<IPatientDependents[]> => {
  const dependentFamilyMembers: IPatientDependents[] = [];
  const cashProfile = patientProfiles.filter(
    (patient) => patient.rxGroupType === RxGroupTypesEnum.CASH
  );
  const cashDependents = await getPatientProfileCoverages(
    configuration,
    cashProfile[0].primary,
    true
  );

  if (
    cashDependents &&
    (cashDependents.adultMembers || cashDependents?.childMembers)
  ) {
    dependentFamilyMembers.push(cashDependents);
  }

  const pbmProfile = patientProfiles.filter(
    (patient) => patient.rxGroupType === RxGroupTypesEnum.SIE
  );

  if (pbmProfile.length) {
    const pbmDependents = await getPatientProfileCoverages(
      configuration,
      pbmProfile[0].primary,
      false
    );
    if (
      pbmDependents &&
      (pbmDependents.adultMembers || pbmDependents.childMembers)
    )
      dependentFamilyMembers.push(pbmDependents);
  }
  return dependentFamilyMembers;
};

const getPatientProfileCoverages = async (
  configuration: IConfiguration,
  patient: IPatient,
  isCashProfile: boolean
) => {
  const query = `beneficiary=patient/${patient.id}`;
  const patientCoverages =
    (await getPatientCoverageByQuery(configuration, query)) ?? [];

  const activeCoverages = getActiveCoveragesOfPatient(patientCoverages);

  if (
    !activeCoverages?.length ||
    activeCoverages?.length > 1 ||
    !activeCoverages[0].subscriberId
  ) {
    return undefined;
  }
  const patientFamilyCoverages = await getPatientCoverageByFamilyId(
    configuration,
    activeCoverages[0].subscriberId
  );

  if (!patientFamilyCoverages?.length) {
    return undefined;
  }

  const dependentCoverages = patientFamilyCoverages.filter(
    (coverage: ICoverage) => coverage.dependent !== '01'
  );
  if (!dependentCoverages?.length) {
    return undefined;
  }

  const coverageById: ICoverageKeys = {};

  dependentCoverages?.forEach((dc) => {
    if (dc.beneficiary.reference) {
      if (coverageById[dc.beneficiary.reference]) {
        coverageById[dc.beneficiary.reference].push(dc);
      } else {
        coverageById[dc.beneficiary.reference] = [dc];
      }
    }
  });

  const consideredDependents: ICoverage[] = [];

  Object.keys(coverageById).map((id) => {
    const activeCoverages = getActiveCoveragesOfPatient(coverageById[id]);
    if (!activeCoverages?.length) {
      return undefined;
    }

    if (activeCoverages?.length > 1) {
      const tenantIdCollection = new Set();
      for (const coverage of activeCoverages) {
        const security = coverage?.meta?.security;
        if (security?.length) {
          const tenantIdObject = security.filter(
            (sec) => sec.system === 'http://prescryptive.io/tenant'
          );
          if (tenantIdObject.length) {
            tenantIdCollection.add(tenantIdObject[0].code);
          }
        }
      }
      if (tenantIdCollection.size === 1)
        consideredDependents.push(activeCoverages[0]);
      return consideredDependents;
    }
    consideredDependents.push(activeCoverages[0]);
    return consideredDependents;
  });

  if (!consideredDependents?.length) {
    return undefined;
  }

  return await getCategorizedPatientsFromCoverage(
    configuration,
    consideredDependents,
    isCashProfile
  );
};

const getCategorizedPatientsFromCoverage = async (
  configuration: IConfiguration,
  coverages: ICoverage[],
  isCashProfile: boolean
) => {
  const dependentPatients: IPatientDependents = {
    rxGroupType: isCashProfile ? RxGroupTypesEnum.CASH : RxGroupTypesEnum.SIE,
  };

  await Promise.all(
    coverages.map(async (coverage: ICoverage) => {
      const masterId = getMasterIdFromCoverage(coverage);
      const patient = await getPatientByMasterId(masterId ?? '', configuration);
      if (patient.birthDate) {
        const age = CalculateAbsoluteAge(new Date(), patient.birthDate);
        if (age < configuration.childMemberAgeLimit) {
          const currentActiveChildMembers: IPatient[] =
            dependentPatients.childMembers?.activePatients ?? [];

          currentActiveChildMembers.push(patient);

          dependentPatients.childMembers = {
            activePatients: currentActiveChildMembers,
          };
        } else {
          const currentActiveAdultMembers: IPatient[] =
            dependentPatients.adultMembers?.activePatients ?? [];

          currentActiveAdultMembers.push(patient);

          dependentPatients.adultMembers = {
            activePatients: currentActiveAdultMembers,
          };
        }
      }
      return dependentPatients;
    })
  );

  return dependentPatients;
};

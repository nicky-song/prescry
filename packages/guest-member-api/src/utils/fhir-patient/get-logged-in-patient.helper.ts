// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { IPatient } from '../../models/fhir/patient/patient';
import { IPatientProfile } from '../../models/patient-profile';
import { getPatientCoverageByQuery } from '../external-api/coverage/get-patient-coverage-by-query';
import { getMasterIdFromCoverage } from '../get-master-id-from-coverage.helper';
import { getPatientByMasterId } from '../external-api/identity/get-patient-by-master-id';
import { getActiveCoveragesOfPatient } from './get-active-coverages-of-patient';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';

export const getAllPatientRecordsForLoggedInPerson = async (
  patient: IPatient,
  configuration: IConfiguration
): Promise<IPatientProfile[]> => {
  const patientProfiles: IPatientProfile[] = [
    {
      rxGroupType: RxGroupTypesEnum.CASH,
      primary: patient,
    },
  ];

  const patientOtherLinks = patient.link;

  if (!patientOtherLinks) {
    return patientProfiles;
  }

  const allPbmMasterIds = patientOtherLinks.map((link) => link.other.reference);
  const concatenatedMasterIds = allPbmMasterIds.join(',');

  const query = `beneficiary=${concatenatedMasterIds}`;

  const patientCoverages = await getPatientCoverageByQuery(
    configuration,
    query
  );

  if (!patientCoverages) {
    return patientProfiles;
  }

  const activePBMCoverages = getActiveCoveragesOfPatient(patientCoverages);

  if (!activePBMCoverages?.length) {
    return patientProfiles;
  }

  if (activePBMCoverages.length > 1) {
    const tenantIdCollection = new Set();
    for (const coverage of activePBMCoverages) {
      const security = coverage?.meta?.security;
      if (security?.length) {
        const tenantIdObject = security.filter(
          (sec) =>
            sec.system === 'http://prescryptive.io/tenant' &&
            sec.code !== configuration.myrxIdentityTenantId
        );
        if (tenantIdObject.length) {
          tenantIdCollection.add(tenantIdObject[0].code);
        }
      }
    }

    // here if multiple PBM records exist, it will not add any PBM to the patientList
    // TODO: Log these details to app insights and see if we can notify to myrx team using an alert
    if (tenantIdCollection.size === 0 || tenantIdCollection.size > 1) {
      return patientProfiles;
    }
  }

  const patientCoverage = patientCoverages[0];
  const masterId = getMasterIdFromCoverage(patientCoverage);

  const pbmPatient = masterId
    ? await getPatientByMasterId(masterId, configuration)
    : undefined;

  if (pbmPatient) {
    patientProfiles.push({
      rxGroupType: RxGroupTypesEnum.SIE,
      primary: pbmPatient,
    });
  }

  return patientProfiles;
};

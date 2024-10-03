// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { ErrorConstants } from '../../../constants/response-messages';
import { InternalServerRequestError } from '../../../errors/request-errors/internal-server.request-error';
import { IPatient } from '../../../models/fhir/patient/patient';
import { IPatientLink } from '../../../models/fhir/patient/patient-link';
import { IPatientAccount } from '../../../models/platform/patient-account/patient-account';
import { getPatientCoverageByMemberId } from '../../../utils/coverage/get-patient-coverage-by-member-id';
import { getPatientCoverageByQuery } from '../../../utils/external-api/coverage/get-patient-coverage-by-query';
import { updatePatientByMasterId } from '../../../utils/external-api/identity/update-patient-by-master-id';
import { updatePatientAccount } from '../../../utils/external-api/patient-account/update-patient-account';
import { getActiveCoveragesOfPatient } from '../../../utils/fhir-patient/get-active-coverages-of-patient';

export const hasMatchingCoverage = async (
  configuration: IConfiguration,
  patientAccount: IPatientAccount,
  rxGroup: string
) => {
  const allPbmMasterIds = patientAccount?.patient?.link?.map(
    (link) => link.other.reference
  );
  const concatenatedMasterIds = allPbmMasterIds?.join(',');
  const query = `beneficiary=${concatenatedMasterIds}`;

  const patientCoverages = await getPatientCoverageByQuery(
    configuration,
    query
  );

  if (patientCoverages) {
    const activePBMCoverages = getActiveCoveragesOfPatient(patientCoverages);
    return activePBMCoverages.some((coverage) =>
      coverage?.class?.some((coverageClass) => coverageClass.value === rxGroup)
    );
  }

  return false;
};

export const addMembershipPlan = async (
  patientAccount: IPatientAccount,
  patient: IPatient,
  pbmMasterId: string,
  configuration: IConfiguration,
  pbmMemberId: string
) => {
  const patientLinkList: IPatientLink[] = [
    {
      other: {
        reference: `patient/${pbmMasterId}`,
      },
      type: 'seealso',
    },
  ];
  const patientId = patient.id;
  if (!patientId) {
    throw new InternalServerRequestError(ErrorConstants.PATIENT_ID_MISSING);
  }
  const patientAccountReference = patientAccount.reference;
  const sieMemberIdExist = patientAccount.reference.some(
    (ref) => ref === pbmMemberId
  );
  if (sieMemberIdExist) {
    const patientCoverages = await getPatientCoverageByMemberId(
      configuration,
      pbmMemberId
    );
    if (patientCoverages?.length) {
      const activeCoverages = getActiveCoveragesOfPatient(patientCoverages);
      if (activeCoverages?.length > 1) {
        const tenantIdCollection = new Set();
        for (const coverage of activeCoverages) {
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
        if (tenantIdCollection.size === 0 || tenantIdCollection.size > 1) {
          const updatedReference = patientAccount.reference.filter(
            (ref) => ref !== pbmMemberId
          );

          await updatePatientAccount(configuration, {
            ...patientAccount,
            reference: updatedReference,
          });
          throw new InternalServerRequestError(
            ErrorConstants.COVERAGE_INVALID_DATA
          );
        }
        return;
      }
    }
  }
  const updatedPatient = { ...patient, link: patientLinkList };
  await updatePatientByMasterId(patientId, updatedPatient, configuration);

  patientAccountReference.push(pbmMemberId);
  const updatedPatientAccount = {
    ...patientAccount,
    reference: patientAccountReference,
  };

  await updatePatientAccount(configuration, updatedPatientAccount);
};

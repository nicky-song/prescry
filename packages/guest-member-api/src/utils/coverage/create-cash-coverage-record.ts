// Copyright 2022 Prescryptive Health, Inc.

import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { IConfiguration } from '../../configuration';
import { ApiConstants } from '../../constants/api-constants';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import { createCoverage } from '../external-api/coverage/create-coverage';
import { getActiveCoveragesOfPatient } from '../fhir-patient/get-active-coverages-of-patient';
import {
  buildMemberId,
  formatDependentNumber,
} from '../fhir-patient/patient.helper';
import { getPatientCoverageByMemberId } from './get-patient-coverage-by-member-id';

export interface IDependentInfo {
  dependentNumber: number;
  masterId: string;
}

export const createCashCoverageRecord = async (
  configuration: IConfiguration,
  masterId: string,
  memberFamilyId: string,
  dependentInfo?: IDependentInfo
): Promise<void> => {
  const dependentNumber = dependentInfo?.dependentNumber ?? 1;
  const memberId = buildMemberId(memberFamilyId, dependentNumber);

  const coverageRecords = await getPatientCoverageByMemberId(
    configuration,
    memberId
  );
  const hasActiveCoverage =
    coverageRecords && getActiveCoveragesOfPatient(coverageRecords)?.length;

  if (hasActiveCoverage) {
    return;
  }

  const beneficiaryMasterId = dependentInfo?.masterId ?? masterId;

  const coverageTerminologySystemUrl =
    'http://terminology.hl7.org/CodeSystem/coverage-class';
  const coverageTerminologyFamilyIdSystemUrl = 'http://prescryptive.io/family';

  const coverage: ICoverage = {
    resourceType: 'Coverage',
    identifier: [
      {
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
              code: 'MB',
            },
          ],
        },
        system: 'https://prescryptive.io/memberidentifier',
        value: memberId,
      },
    ],
    status: 'active',
    type: {
      coding: [
        {
          code: 'individual',
          display: 'CoverageType',
        },
      ],
    },
    subscriber: {
      reference: `patient/${masterId}`,
      type: 'Patient',
    },
    subscriberId: memberFamilyId,
    beneficiary: {
      reference: `patient/${beneficiaryMasterId}`,
      type: 'Patient',
    },
    dependent: formatDependentNumber(dependentNumber),
    relationship: {
      coding: [
        {
          code: dependentInfo ? 'other' : 'self',
        },
      ],
    },
    period: {
      start: getNewDate().toISOString(),
    },
    payor: [
      {
        reference: `patient/${masterId}`,
        type: 'Patient',
      },
    ],
    class: [
      {
        type: {
          coding: [
            {
              system: coverageTerminologyFamilyIdSystemUrl,
              code: 'familyid',
            },
          ],
        },
        value: memberFamilyId,
        name: 'FamilyId',
      },
      {
        type: {
          coding: [
            {
              system: coverageTerminologySystemUrl,
              code: 'rxbin',
            },
          ],
        },
        value: ApiConstants.CASH_USER_RX_BIN,
        name: 'RxBin',
      },
      {
        type: {
          coding: [
            {
              system: coverageTerminologySystemUrl,
              code: 'rxpcn',
            },
          ],
        },
        value: ApiConstants.CASH_USER_CARRIER_PCN,
        name: 'RxPCN',
      },
      {
        type: {
          coding: [
            {
              system: coverageTerminologySystemUrl,
              code: 'rxgroup',
            },
          ],
        },
        value: ApiConstants.CASH_USER_RX_GROUP,
        name: 'RxGroup',
      },
      {
        type: {
          coding: [
            {
              system: coverageTerminologySystemUrl,
              code: 'rxsubgroup',
            },
          ],
        },
        value: ApiConstants.CASH_USER_RX_SUB_GROUP,
        name: 'RxSubGroup',
      },
    ],
  };

  await createCoverage(configuration, coverage);
};

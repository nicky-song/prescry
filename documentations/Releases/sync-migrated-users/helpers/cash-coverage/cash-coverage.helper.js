// Copyright 2022 Prescryptive Health, Inc.

const ApiConstants = {
  CASH_USER_RX_SUB_GROUP: 'CASH01',
  CASH_USER_RX_GROUP: '200P32F',
  CASH_USER_RX_BIN: '610749',
  CASH_USER_CARRIER_PCN: 'X01',
};

export const buildCashCoverage = (
  profile,
  primaryMasterId,
  dependentMasterId = null
) => {
  const { primaryMemberFamilyId, primaryMemberRxId, primaryMemberPersonCode } =
    profile.cashProfile;
  const masterId = dependentMasterId ?? primaryMasterId;
  const gearsPatientUrl = 'patient';

  const coverageTerminologySystemUrl =
    'http://terminology.hl7.org/CodeSystem/coverage-class';
  const coverageTerminologyFamilyIdSystemUrl = 'http://prescryptive.io/family';

  const coverage = {
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
        value: primaryMemberRxId,
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
      reference: `${gearsPatientUrl}/${primaryMasterId}`,
      type: 'Patient',
    },
    subscriberId: primaryMemberFamilyId,
    beneficiary: {
      reference: `${gearsPatientUrl}/${masterId}`,
      type: 'Patient',
    },
    dependent: primaryMemberPersonCode,
    relationship: {
      coding: [
        {
          code: primaryMemberPersonCode === '01' ? 'self' : 'other',
        },
      ],
    },
    period: {
      start: new Date().toISOString(),
    },
    payor: [
      {
        reference: `${gearsPatientUrl}/${primaryMasterId}`,
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
        value: primaryMemberFamilyId,
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

  return coverage;
};

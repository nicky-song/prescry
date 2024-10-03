// Copyright 2022 Prescryptive Health, Inc.

import { configurationMock } from '../../mock-data/configuration.mock';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import { createCoverage } from '../external-api/coverage/create-coverage';
import {
  createCashCoverageRecord,
  IDependentInfo,
} from './create-cash-coverage-record';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { ApiConstants } from '../../constants/api-constants';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import {
  buildMemberId,
  formatDependentNumber,
} from '../fhir-patient/patient.helper';
import { getPatientCoverageByMemberId } from './get-patient-coverage-by-member-id';
import { getActiveCoveragesOfPatient } from '../fhir-patient/get-active-coverages-of-patient';

jest.mock('../external-api/coverage/create-coverage');
const createCoverageMock = createCoverage as jest.Mock;

jest.mock('@phx/common/src/utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

jest.mock('../fhir-patient/patient.helper');
const buildMemberIdMock = buildMemberId as jest.Mock;
const formatDependentNumberMock = formatDependentNumber as jest.Mock;

jest.mock('./get-patient-coverage-by-member-id');
const getPatientCoverageByMemberIdMock =
  getPatientCoverageByMemberId as jest.Mock;

jest.mock('../fhir-patient/get-active-coverages-of-patient');
const getActiveCoveragesOfPatientMock =
  getActiveCoveragesOfPatient as jest.Mock;

describe('createCashCoverageRecord', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getPatientCoverageByMemberIdMock.mockResolvedValue(undefined);
  });

  it.each([
    [undefined, 1],
    [1, 1],
    [2, 2],
  ])(
    'does not create coverage record if active coverage already exists for dependent %p',
    async (
      dependentNumberMock: number | undefined,
      expectedDependentNumber: number
    ) => {
      const dependentInfoMock: IDependentInfo | undefined = dependentNumberMock
        ? {
            dependentNumber: dependentNumberMock,
            masterId: '',
          }
        : undefined;

      const memberIdMock = 'member-id';
      buildMemberIdMock.mockReturnValue(memberIdMock);

      const patientCoverageMock = [{}];
      getPatientCoverageByMemberIdMock.mockResolvedValue(patientCoverageMock);
      getActiveCoveragesOfPatientMock.mockReturnValue([{}]);

      const familyIdMock = 'family-id';

      await createCashCoverageRecord(
        configurationMock,
        'master-id',
        familyIdMock,
        dependentInfoMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        buildMemberIdMock,
        familyIdMock,
        expectedDependentNumber
      );
      expectToHaveBeenCalledOnceOnlyWith(
        getPatientCoverageByMemberIdMock,
        configurationMock,
        memberIdMock
      );
      expectToHaveBeenCalledOnceOnlyWith(
        getActiveCoveragesOfPatientMock,
        patientCoverageMock
      );
      expect(createCoverageMock).not.toHaveBeenCalled();
    }
  );

  it.each([
    [undefined, undefined, 1],
    [1, undefined, 1],
    [2, undefined, 2],
    [undefined, [], 1],
    [1, [], 1],
    [2, [], 2],
  ])(
    'creates coverage record for dependent %p (existing coverage: %p)',
    async (
      dependentNumberMock: number | undefined,
      existingCoverageMock: undefined | unknown[],
      expectedDependentNumber: number
    ) => {
      const masterIdMock = 'master-id';
      const dependentMasterIdMock = 'dependent-master-id';
      const memberFamilyIdMock = 'member-family-id';
      const nowMock = new Date();

      const beneficiaryMasterIdMock = dependentNumberMock
        ? dependentMasterIdMock
        : masterIdMock;

      const memberIdMock = 'member-id';
      buildMemberIdMock.mockReturnValue(memberIdMock);

      getPatientCoverageByMemberIdMock.mockResolvedValue(existingCoverageMock);

      const formattedDependentNumberMock = 'formatted-dependent-number';
      formatDependentNumberMock.mockReturnValue(formattedDependentNumberMock);

      getNewDateMock.mockReturnValue(nowMock);

      const dependentInfoMock: IDependentInfo | undefined = dependentNumberMock
        ? {
            dependentNumber: dependentNumberMock,
            masterId: dependentMasterIdMock,
          }
        : undefined;

      getActiveCoveragesOfPatientMock.mockReturnValue([]);

      await createCashCoverageRecord(
        configurationMock,
        masterIdMock,
        memberFamilyIdMock,
        dependentInfoMock
      );

      const coverageTerminologySystemUrl =
        'http://terminology.hl7.org/CodeSystem/coverage-class';

      const coverageTerminologyFamilyIdSystemUrl =
        'http://prescryptive.io/family';

      const expectedCoverage: ICoverage = {
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
            value: memberIdMock,
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
          reference: `patient/${masterIdMock}`,
          type: 'Patient',
        },
        subscriberId: memberFamilyIdMock,
        beneficiary: {
          reference: `patient/${beneficiaryMasterIdMock}`,
          type: 'Patient',
        },
        dependent: formattedDependentNumberMock,
        relationship: {
          coding: [
            {
              code: dependentNumberMock ? 'other' : 'self',
            },
          ],
        },
        period: {
          start: getNewDate().toISOString(),
        },
        payor: [
          {
            reference: `patient/${masterIdMock}`,
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
            value: memberFamilyIdMock,
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

      expectToHaveBeenCalledOnceOnlyWith(
        createCoverageMock,
        configurationMock,
        expectedCoverage
      );

      expectToHaveBeenCalledOnceOnlyWith(
        buildMemberIdMock,
        memberFamilyIdMock,
        expectedDependentNumber
      );
      expectToHaveBeenCalledOnceOnlyWith(
        formatDependentNumberMock,
        expectedDependentNumber
      );
    }
  );
});

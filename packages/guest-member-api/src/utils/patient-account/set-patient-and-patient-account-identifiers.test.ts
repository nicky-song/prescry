// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { configurationMock } from '../../mock-data/configuration.mock';
import {
  patientAccountPrimaryMock,
  patientAccountPrimaryWithPatientMock,
} from '../../mock-data/patient-account.mock';
import { Identifier } from '../../models/fhir/identifier';
import { IPatient } from '../../models/fhir/patient/patient';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { updatePatientByMasterId } from '../external-api/identity/update-patient-by-master-id';
import { updatePatientAccount } from '../external-api/patient-account/update-patient-account';
import { buildPatientAccountReferences } from './patient-account.helper';
import {
  buildMemberId,
  buildPatientIdentifiers,
} from '../fhir-patient/patient.helper';
import { setPatientAndPatientAccountIdentifiers } from './set-patient-and-patient-account-identifiers';
import { assertHasPatient } from '../../assertions/assert-has-patient';
import { mockPatient } from '../../mock-data/fhir-patient.mock';

jest.mock('../fhir-patient/patient.helper');
const buildPatientIdentifiersMock = buildPatientIdentifiers as jest.Mock;
const buildMemberIdMock = buildMemberId as jest.Mock;

jest.mock('./patient-account.helper');
const buildPatientAccountReferencesMock =
  buildPatientAccountReferences as jest.Mock;

jest.mock('../external-api/identity/update-patient-by-master-id');
const updatePatientByMasterIdMock = updatePatientByMasterId as jest.Mock;

jest.mock('../external-api/patient-account/update-patient-account');
const updatePatientAccountMock = updatePatientAccount as jest.Mock;

jest.mock('../../assertions/assert-has-patient');
const assertHasPatientMock = assertHasPatient as jest.Mock;

describe('setPatientAndPatientAccountIdentifiers', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    updatePatientByMasterIdMock.mockResolvedValue(undefined);
    updatePatientAccountMock.mockResolvedValue(undefined);
  });

  it('asserts patient exists in patient account', async () => {
    const existingPatientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryMock,
      patient: mockPatient,
    };

    await setPatientAndPatientAccountIdentifiers(
      configurationMock,
      existingPatientAccountMock,
      'family-id',
      'master-id',
      'phone-number'
    );

    expectToHaveBeenCalledOnceOnlyWith(assertHasPatientMock, mockPatient);
  });

  it.each([[undefined], [1], [2]])(
    'updates patient identifiers and account references for dependent %p',
    async (dependentNumberMock: number | undefined) => {
      const identifiersMock: Identifier[] = [
        {
          type: {
            coding: [
              {
                code: 'identifier-code',
                display: 'identifier-display',
                system: 'identifier-system',
              },
            ],
          },
          value: 'identifier-value',
        },
      ];
      buildPatientIdentifiersMock.mockReturnValue(identifiersMock);

      const referencesMock: string[] = ['reference-1', 'reference-2'];
      buildPatientAccountReferencesMock.mockReturnValue(referencesMock);

      const memberIdMock = 'member-id';
      buildMemberIdMock.mockReturnValue(memberIdMock);

      const familyIdMock = 'family-id';
      const masterIdMock = 'master-id';
      const phoneNumberMock = 'phone-number';

      await setPatientAndPatientAccountIdentifiers(
        configurationMock,
        patientAccountPrimaryWithPatientMock,
        familyIdMock,
        masterIdMock,
        phoneNumberMock,
        dependentNumberMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        buildMemberIdMock,
        familyIdMock,
        dependentNumberMock ?? 1
      );

      expectToHaveBeenCalledOnceOnlyWith(
        buildPatientIdentifiersMock,
        familyIdMock,
        memberIdMock,
        phoneNumberMock
      );

      const expectedPatientForUpdate: IPatient = {
        ...patientAccountPrimaryWithPatientMock.patient,
        identifier: identifiersMock,
      };
      expectToHaveBeenCalledOnceOnlyWith(
        updatePatientByMasterIdMock,
        masterIdMock,
        expectedPatientForUpdate,
        configurationMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        buildPatientAccountReferencesMock,
        phoneNumberMock,
        memberIdMock,
        false,
        masterIdMock
      );
      const expectedPatientAccountForUpdate: IPatientAccount = {
        ...patientAccountPrimaryWithPatientMock,
        patient: expectedPatientForUpdate,
        reference: referencesMock,
      };
      expectToHaveBeenCalledOnceOnlyWith(
        updatePatientAccountMock,
        configurationMock,
        expectedPatientAccountForUpdate
      );
    }
  );
});

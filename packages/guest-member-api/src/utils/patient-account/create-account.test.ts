// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { configurationMock } from '../../mock-data/configuration.mock';
import { patientAccountPrimaryWithOutAuthMock } from '../../mock-data/patient-account.mock';
import { Identifier } from '../../models/fhir/identifier';
import { IPatient } from '../../models/fhir/patient/patient';
import {
  IPatientAccount,
  PATIENT_ACCOUNT_SOURCE_MYRX,
} from '../../models/platform/patient-account/patient-account';
import { IPatientAccountMetadata } from '../../models/platform/patient-account/properties/patient-account-metadata';
import { createPatientAccount } from '../external-api/patient-account/create-patient-account';
import { splitFirstName } from '../fhir/human-name.helper';
import { createAccount } from './create-account';
import {
  buildPatientAccountMetadata,
  buildPatientAccountReferences,
  getMasterId,
} from './patient-account.helper';
import {
  buildMemberId,
  buildPatientIdentifiers,
} from '../fhir-patient/patient.helper';
import { IIdentity } from '../../models/identity';
import { assertIsIsoDate } from '../../assertions/assert-is-iso-date';

jest.mock('../fhir/human-name.helper');
const splitFirstNameMock = splitFirstName as jest.Mock;

jest.mock('../external-api/patient-account/create-patient-account');
const createPatientAccountMock = createPatientAccount as jest.Mock;

jest.mock('@phx/common/src/utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

jest.mock('../fhir-patient/patient.helper');
const buildMemberIdMock = buildMemberId as jest.Mock;
const buildPatientIdentifiersMock = buildPatientIdentifiers as jest.Mock;

jest.mock('./patient-account.helper');
const buildPatientAccountReferencesMock =
  buildPatientAccountReferences as jest.Mock;
const buildPatientAccountMetadataMock =
  buildPatientAccountMetadata as jest.Mock;
const getMasterIdMock = getMasterId as jest.Mock;

jest.mock('../../assertions/assert-is-iso-date');
const assertIsIsoDateMock = assertIsIsoDate as jest.Mock;

describe('createAccount', () => {
  const identityMock: IIdentity = {
    isoDateOfBirth: '2001-01-01',
    email: 'email@somewhere.com',
    firstName: 'first-name',
    lastName: 'last-name',
    phoneNumber: 'phone-number',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [undefined, false],
    [1, false],
    [2, true],
  ])(
    'calls createPatientAccount for dependent %p',
    async (
      dependentNumberMock: number | undefined,
      isDependentMock: boolean
    ) => {
      const nowMock = new Date();
      getNewDateMock.mockReturnValue(nowMock);

      const memberIdMock = 'member-id';
      buildMemberIdMock.mockReturnValue(memberIdMock);

      const referencesMock: string[] = isDependentMock
        ? [memberIdMock]
        : ['reference-1', 'reference-2'];
      buildPatientAccountReferencesMock.mockReturnValue(referencesMock);

      const metadataMock: IPatientAccountMetadata = {
        PIN: [
          {
            key: 'key',
            value: 'value',
          },
        ],
      };
      buildPatientAccountMetadataMock.mockReturnValue(metadataMock);

      const givenNamesMock = ['first'];
      splitFirstNameMock.mockReturnValue(givenNamesMock);

      createPatientAccountMock.mockResolvedValue(
        patientAccountPrimaryWithOutAuthMock
      );

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

      const masterIdMock = 'patient-id';

      getMasterIdMock.mockReturnValue(masterIdMock);

      const familyIdMock = 'family-id';
      const pinHashMock = 'pin-hash';
      const accountKeyMock = 'account-key';
      const fromIPMock = 'from-ip';
      const browserMock = 'browser';

      const patientMock: IPatient = {
        resourceType: 'Patient',
        active: true,
        birthDate: identityMock.isoDateOfBirth,
        name: [
          {
            use: 'official',
            family: identityMock.lastName,
            given: givenNamesMock,
          },
        ],
        communication: [],
        identifier: identifiersMock,
        telecom: [
          {
            system: 'email',
            value: identityMock.email,
            use: 'home',
          },
          {
            system: 'phone',
            value: identityMock.phoneNumber,
            use: 'mobile',
          },
        ],
        address: [],
      };

      const expectedPatientAccount: IPatientAccount = {
        accountType: 'myrx',
        source: PATIENT_ACCOUNT_SOURCE_MYRX,
        reference: referencesMock,
        patient: patientMock,
        authentication: {
          metadata: metadataMock,
        },
        roles: [],
        status: {
          state: 'VERIFIED',
          lastStateUpdate: nowMock.toISOString(),
        },
        termsAndConditions: {
          hasAccepted: true,
          allowSmsMessages: true,
          allowEmailMessages: true,
          acceptedDateTime: nowMock.toISOString(),
          fromIP: fromIPMock,
          browser: browserMock,
        },
      };

      const expectedDependentTelecom = [
        {
          system: 'phone',
          value: identityMock.phoneNumber,
          use: 'mobile',
        },
      ];

      const expectedPatientAccountForDependent = {
        ...expectedPatientAccount,
        patient: { ...patientMock, telecom: expectedDependentTelecom },
        reference: [memberIdMock],
        status: { ...expectedPatientAccount.status, state: 'UNVERIFIED' },
        termsAndConditions: undefined,
      };

      const result = await createAccount(
        configurationMock,
        identityMock,
        familyIdMock,
        accountKeyMock,
        pinHashMock,
        fromIPMock,
        browserMock,
        dependentNumberMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        buildPatientAccountReferencesMock,
        identityMock.phoneNumber,
        memberIdMock,
        isDependentMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        splitFirstNameMock,
        identityMock.firstName
      );
      expectToHaveBeenCalledOnceOnlyWith(
        assertIsIsoDateMock,
        identityMock.isoDateOfBirth
      );
      expectToHaveBeenCalledOnceOnlyWith(
        buildPatientIdentifiersMock,
        familyIdMock,
        memberIdMock,
        identityMock.phoneNumber
      );
      expectToHaveBeenCalledOnceOnlyWith(
        buildPatientAccountReferencesMock,
        identityMock.phoneNumber,
        memberIdMock,
        isDependentMock
      );
      expectToHaveBeenCalledOnceOnlyWith(
        buildPatientAccountMetadataMock,
        accountKeyMock,
        pinHashMock
      );
      expectToHaveBeenCalledOnceOnlyWith(
        createPatientAccountMock,
        configurationMock,
        dependentNumberMock && dependentNumberMock > 1
          ? expectedPatientAccountForDependent
          : expectedPatientAccount
      );

      const expectedPatientAccountResponse = {
        ...patientAccountPrimaryWithOutAuthMock,
        patient: {
          ...patientMock,
          id: 'patient-id',
          ...(dependentNumberMock &&
            dependentNumberMock > 1 && { telecom: expectedDependentTelecom }),
        },
      };
      expect(result).toEqual(expectedPatientAccountResponse);
    }
  );
});

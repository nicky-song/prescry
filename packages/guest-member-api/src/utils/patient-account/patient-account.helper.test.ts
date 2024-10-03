// Copyright 2022 Prescryptive Health, Inc.

import { generateSHA512Hash } from '@phx/common/src/utils/crypto.helper';
import { patientAccountPrimaryMock } from '../../mock-data/patient-account.mock';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { IPatientAccountMetadata } from '../../models/platform/patient-account/properties/patient-account-metadata';
import { PatientAccountState } from '../../models/platform/patient-account/properties/patient-account-status';
import {
  buildPatientAccountMetadata,
  buildPatientAccountReferences,
  getMasterId,
  isPatientAccountVerified,
  isPhoneNumberInReferences,
} from './patient-account.helper';

describe('patientAccountHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isPatientAccountVerified', () => {
    const unverifiedState: PatientAccountState = 'UNVERIFIED';
    const verifiedState: PatientAccountState = 'VERIFIED';

    it.each([
      [undefined, false],
      [{}, false],
      [
        { status: { state: unverifiedState, lastStateUpdate: '2022-10-03' } },
        false,
      ],
      [
        { status: { state: verifiedState, lastStateUpdate: '2022-10-03' } },
        true,
      ],
    ])(
      'returns true if account verified (patientAccount: %p)',
      (
        patientAccountMock: Partial<IPatientAccount> | undefined,
        expected: boolean
      ) => {
        expect(
          isPatientAccountVerified(patientAccountMock as IPatientAccount)
        ).toEqual(expected);
      }
    );
  });

  describe('buildPatientAccountReferences', () => {
    it.each([[true], [false]])(
      'builds references (is dependent %p)',
      (isDependentMock: boolean) => {
        const phoneNumberMock = 'phone-number';
        const memberIdMock = 'member-id';
        const masterIdMock = 'master-id';

        const references = buildPatientAccountReferences(
          phoneNumberMock,
          memberIdMock,
          isDependentMock,
          masterIdMock
        );

        const expectedReferences: string[] = isDependentMock
          ? [memberIdMock]
          : [generateSHA512Hash(phoneNumberMock), memberIdMock, masterIdMock];
        expect(references).toEqual(expectedReferences);
      }
    );
  });

  describe('isPhoneNumberInReferences', () => {
    it.each([
      [undefined, 'phone-number', false],
      [[], 'phone-number', false],
      [['something'], 'phone-number', false],
      [['something', 'phone-number'], 'phone-number', false],
      [['something', generateSHA512Hash('phone-number')], 'phone-number', true],
    ])(
      'returns true if phone number is in references (%p; phoneNumber: %p)',
      (
        referencesMock: string[] | undefined,
        phoneNumberMock: string,
        isExpected: boolean
      ) => {
        expect(
          isPhoneNumberInReferences(referencesMock, phoneNumberMock)
        ).toEqual(isExpected);
      }
    );
  });

  describe('buildPatientAccountMetadata', () => {
    it.each([
      [undefined, undefined, {}],
      ['pin-hash', undefined, {}],
      [undefined, 'account-key', {}],
      [
        'pin-hash',
        'account-key',
        { PIN: [{ key: 'account-key', value: 'pin-hash' }] },
      ],
    ])(
      'builds metadata (pinHash: %p, accountKey: %p)',
      (
        pinHashMock: string | undefined,
        accountKeyMock: string | undefined,
        expectedMetadata: IPatientAccountMetadata
      ) => {
        const metadata = buildPatientAccountMetadata(
          accountKeyMock,
          pinHashMock
        );

        expect(metadata).toEqual(expectedMetadata);
      }
    );
  });

  describe('getMasterId', () => {
    const patientAccountWithoutPatientProfileMock: IPatientAccount = {
      ...patientAccountPrimaryMock,
      patientProfile: undefined,
    };

    const masterIdMock = 'PINODPD6';
    const patientAccountWithPatientProfileMock: IPatientAccount = {
      ...patientAccountPrimaryMock,
      patientProfile: `https://gears.test.prescryptive.io/identity/patient/${masterIdMock}`,
    };

    it.each([
      [undefined, undefined],
      [patientAccountWithoutPatientProfileMock, undefined],
      [patientAccountWithPatientProfileMock, masterIdMock],
    ])(
      'gets master id from patient account %p',
      (
        patientAccountMock: IPatientAccount | undefined,
        expectedMasterId: string | undefined
      ) => {
        expect(getMasterId(patientAccountMock)).toEqual(expectedMasterId);
      }
    );
  });
});

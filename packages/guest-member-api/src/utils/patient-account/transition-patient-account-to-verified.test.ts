// Copyright 2022 Prescryptive Health, Inc.

import { InternalResponseCode } from '@phx/common/src/errors/error-codes';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { assertHasAccountId } from '../../assertions/assert-has-account-id';
import { assertHasMasterId } from '../../assertions/assert-has-master-id';
import { BadRequestError } from '../../errors/request-errors/bad.request-error';
import { configurationMock } from '../../mock-data/configuration.mock';
import { mockPatient } from '../../mock-data/fhir-patient.mock';
import { patientAccountPrimaryMock } from '../../mock-data/patient-account.mock';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { createCashCoverageRecord } from '../coverage/create-cash-coverage-record';
import { getPatientByMasterId } from '../external-api/identity/get-patient-by-master-id';
import {
  doesPatientBirthDateMatch,
  doPatientFirstNameMatch,
} from '../fhir-patient/patient.helper';
import { getMasterId } from './patient-account.helper';
import { setPatientAccountStatusToVerified } from './set-patient-account-status-to-verified';
import { setPatientAndPatientAccountIdentifiers } from './set-patient-and-patient-account-identifiers';
import { transitionPatientAccountToVerified } from './transition-patient-account-to-verified';

jest.mock('./patient-account.helper');
const getMasterIdMock = getMasterId as jest.Mock;

jest.mock('../external-api/identity/get-patient-by-master-id');
const getPatientByMasterIdMock = getPatientByMasterId as jest.Mock;

jest.mock('../fhir-patient/patient.helper');
const doesPatientBirthDateMatchMock = doesPatientBirthDateMatch as jest.Mock;
const doPatientFirstNameMatchMock = doPatientFirstNameMatch as jest.Mock;

jest.mock('./set-patient-and-patient-account-identifiers');
const setPatientAndPatientAccountIdentifiersMock =
  setPatientAndPatientAccountIdentifiers as jest.Mock;

jest.mock('./set-patient-account-status-to-verified');
const setPatientAccountStatusToVerifiedMock =
  setPatientAccountStatusToVerified as jest.Mock;

jest.mock('../coverage/create-cash-coverage-record');
const createCashCoverageRecordMock = createCashCoverageRecord as jest.Mock;

jest.mock('../../assertions/assert-has-master-id');
const assertHasMasterIdMock = assertHasMasterId as jest.Mock;

jest.mock('../../assertions/assert-has-account-id');
const assertHasAccountIdMock = assertHasAccountId as jest.Mock;

describe('transitionPatientAccountToVerified', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getPatientByMasterIdMock.mockResolvedValue(undefined);
    setPatientAndPatientAccountIdentifiersMock.mockResolvedValue(undefined);
    setPatientAccountStatusToVerifiedMock.mockResolvedValue(undefined);
    createCashCoverageRecordMock.mockResolvedValue(undefined);
  });

  it('throws endpoint error if patient details does not match', async () => {
    const masterIdMock = 'master-id';

    const patientAccountMock: IPatientAccount = patientAccountPrimaryMock;
    const phoneNumberMock = 'phone-number';

    try {
      getMasterIdMock.mockReturnValue(masterIdMock);

      doesPatientBirthDateMatchMock.mockReturnValue(true);
      doPatientFirstNameMatchMock.mockReturnValue(false);

      await transitionPatientAccountToVerified(
        configurationMock,
        patientAccountMock,
        {
          phoneNumber: phoneNumberMock,
          firstName: 'first-name',
          lastName: 'last-name',
          isoDateOfBirth: 'date-of-birth',
        },
        'family-id'
      );
      expect.assertions(1);
      expect(assertHasAccountIdMock).not.toBeCalled();
      expect(setPatientAndPatientAccountIdentifiersMock).not.toBeCalled();
      expect(setPatientAccountStatusToVerifiedMock).not.toBeCalled();
    } catch (ex) {
      const expectedError = new BadRequestError(
        ErrorConstants.ACCOUNT_PERSON_DATA_MISMATCH,
        InternalResponseCode.ACCOUNT_PERSON_DATA_MISMATCH
      );
      expect(ex).toEqual(expectedError);
    }
  });

  it('asserts master id exists in unverified patient account', async () => {
    const masterIdMock = 'master-id';
    getMasterIdMock.mockReturnValue(masterIdMock);

    doesPatientBirthDateMatchMock.mockReturnValue(true);
    doPatientFirstNameMatchMock.mockReturnValue(true);

    const patientAccountMock: IPatientAccount = patientAccountPrimaryMock;
    const phoneNumberMock = 'phone-number';

    await transitionPatientAccountToVerified(
      configurationMock,
      patientAccountMock,
      {
        phoneNumber: phoneNumberMock,
        firstName: 'first-name',
        lastName: 'last-name',
        isoDateOfBirth: 'date-of-birth',
      },
      'family-id'
    );

    expectToHaveBeenCalledOnceOnlyWith(getMasterIdMock, patientAccountMock);
    expectToHaveBeenCalledOnceOnlyWith(
      assertHasMasterIdMock,
      masterIdMock,
      phoneNumberMock
    );
  });

  it('asserts account id exists in unverified patient account with matching details', async () => {
    const masterIdMock = 'master-id';
    getMasterIdMock.mockReturnValue(masterIdMock);

    const accountIdMock = 'account-id';
    const patientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryMock,
      accountId: accountIdMock,
    };
    const phoneNumberMock = 'phone-number';

    getPatientByMasterIdMock.mockResolvedValue(mockPatient);

    doesPatientBirthDateMatchMock.mockReturnValue(true);
    doPatientFirstNameMatchMock.mockReturnValue(true);

    const dateOfBirthMock = 'date-of-birth';
    const firstNameMock = 'first-name';
    const lastNameMock = 'last-name';

    await transitionPatientAccountToVerified(
      configurationMock,
      patientAccountMock,
      {
        phoneNumber: phoneNumberMock,
        firstName: firstNameMock,
        lastName: lastNameMock,
        isoDateOfBirth: dateOfBirthMock,
      },
      'family-id'
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getPatientByMasterIdMock,
      masterIdMock,
      configurationMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      doesPatientBirthDateMatchMock,
      mockPatient,
      dateOfBirthMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      doPatientFirstNameMatchMock,
      mockPatient,
      firstNameMock
    );

    expectToHaveBeenCalledOnceOnlyWith(assertHasAccountIdMock, accountIdMock);
  });

  it('sets identifiers for unverified patient account with matching details', async () => {
    const masterIdMock = 'master-id';
    getMasterIdMock.mockReturnValue(masterIdMock);

    const patientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryMock,
      accountId: 'account-id',
    };
    const phoneNumberMock = 'phone-number';

    getPatientByMasterIdMock.mockResolvedValue(mockPatient);

    doesPatientBirthDateMatchMock.mockReturnValue(true);
    doPatientFirstNameMatchMock.mockReturnValue(true);

    const familyIdMock = 'family-id';

    await transitionPatientAccountToVerified(
      configurationMock,
      patientAccountMock,
      {
        phoneNumber: phoneNumberMock,
        firstName: 'first-name',
        lastName: 'last-name',
        isoDateOfBirth: 'date-of-birth',
      },
      familyIdMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      setPatientAndPatientAccountIdentifiersMock,
      configurationMock,
      patientAccountMock,
      familyIdMock,
      masterIdMock,
      phoneNumberMock
    );
  });

  it('sets status to verified for unverified patient account with matching details', async () => {
    getMasterIdMock.mockReturnValue('master-id');

    const patientAccountIdMock = 'account-id';
    const patientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryMock,
      accountId: patientAccountIdMock,
    };

    getPatientByMasterIdMock.mockResolvedValue(mockPatient);

    doesPatientBirthDateMatchMock.mockReturnValue(true);
    doPatientFirstNameMatchMock.mockReturnValue(true);

    await transitionPatientAccountToVerified(
      configurationMock,
      patientAccountMock,
      {
        phoneNumber: 'phone-number',
        firstName: 'first-name',
        lastName: 'last-name',
        isoDateOfBirth: 'date-of-birth',
      },
      'family-id'
    );

    expectToHaveBeenCalledOnceOnlyWith(
      setPatientAccountStatusToVerifiedMock,
      configurationMock,
      patientAccountIdMock
    );
  });

  it('creates cash coverage record for unverified patient account with matching details', async () => {
    const masterIdMock = 'master-id';
    getMasterIdMock.mockReturnValue(masterIdMock);

    const patientAccountIdMock = 'account-id';
    const patientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryMock,
      accountId: patientAccountIdMock,
    };

    getPatientByMasterIdMock.mockResolvedValue(mockPatient);

    doesPatientBirthDateMatchMock.mockReturnValue(true);
    doPatientFirstNameMatchMock.mockReturnValue(true);

    const familyIdMock = 'family-id';

    await transitionPatientAccountToVerified(
      configurationMock,
      patientAccountMock,
      {
        phoneNumber: 'phone-number',
        firstName: 'first-name',
        lastName: 'last-name',
        isoDateOfBirth: 'date-of-birth',
      },
      familyIdMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      createCashCoverageRecordMock,
      configurationMock,
      masterIdMock,
      familyIdMock,
      undefined
    );
  });
});

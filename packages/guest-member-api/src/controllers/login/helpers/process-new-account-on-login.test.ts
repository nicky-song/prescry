// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { assertHasAccountId } from '../../../assertions/assert-has-account-id';
import { LoginMessages } from '../../../constants/response-messages';
import { ForbiddenRequestError } from '../../../errors/request-errors/forbidden.request-error';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { identityMock } from '../../../mock-data/identity.mock';
import { patientAccountPrimaryMock } from '../../../mock-data/patient-account.mock';
import { IPatientAccount } from '../../../models/platform/patient-account/patient-account';
import { getPatientAccountByAccountId } from '../../../utils/external-api/patient-account/get-patient-account-by-account-id';
import { createPatientAccountWithCoverage } from '../../../utils/patient-account/create-patient-account-with-coverage';
import { isPatientAccountVerified } from '../../../utils/patient-account/patient-account.helper';
import { transitionPatientAccountToVerified } from '../../../utils/patient-account/transition-patient-account-to-verified';
import { processNewAccountOnLogin } from './process-new-account-on-login';

jest.mock('../../../utils/patient-account/patient-account.helper');
const isPatientAccountVerifiedMock = isPatientAccountVerified as jest.Mock;

jest.mock(
  '../../../utils/patient-account/transition-patient-account-to-verified'
);
const transitionPatientAccountToVerifiedMock =
  transitionPatientAccountToVerified as jest.Mock;

jest.mock(
  '../../../utils/patient-account/create-patient-account-with-coverage'
);
const createPatientAccountWithCoverageMock =
  createPatientAccountWithCoverage as jest.Mock;

jest.mock(
  '../../../utils/external-api/patient-account/get-patient-account-by-account-id'
);
const getPatientAccountByAccountIdMock =
  getPatientAccountByAccountId as jest.Mock;

jest.mock('../../../assertions/assert-has-account-id');
const assertHasAccountIdMock = assertHasAccountId as jest.Mock;

describe('processNewAccountOnLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    transitionPatientAccountToVerifiedMock.mockResolvedValue(undefined);
    createPatientAccountWithCoverageMock.mockResolvedValue(undefined);
  });

  it('creates new patient account if not exist', async () => {
    const patientAccountMock = undefined;
    const familyIdMock = 'family-id';
    const fromIPMock = '0.0.0.0';
    const browserMock = 'browser';

    createPatientAccountWithCoverageMock.mockReturnValue(
      patientAccountPrimaryMock
    );

    const actual = await processNewAccountOnLogin(
      configurationMock,
      patientAccountMock,
      identityMock,
      familyIdMock,
      fromIPMock,
      browserMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      createPatientAccountWithCoverageMock,
      configurationMock,
      identityMock,
      familyIdMock,
      fromIPMock,
      browserMock
    );

    expect(assertHasAccountIdMock).not.toBeCalled();
    expect(getPatientAccountByAccountIdMock).not.toBeCalled();
    expect(actual).toEqual(patientAccountPrimaryMock);
  });

  it('throws FORBIDDEN response if existing patient account is verified', async () => {
    isPatientAccountVerifiedMock.mockReturnValue(true);

    const patientAccountMock: IPatientAccount = patientAccountPrimaryMock;

    try {
      await processNewAccountOnLogin(
        configurationMock,
        patientAccountMock,
        identityMock,
        'family-id',
        '0.0.0.0',
        'browser'
      );
      expect.assertions(1);
    } catch (error) {
      expect(assertHasAccountIdMock).not.toBeCalled();
      expect(getPatientAccountByAccountIdMock).not.toBeCalled();
      expectToHaveBeenCalledOnceOnlyWith(
        isPatientAccountVerifiedMock,
        patientAccountMock
      );

      const expectedError = new ForbiddenRequestError(
        LoginMessages.PHONE_NUMBER_EXISTS
      );
      expect(error).toEqual(expectedError);
    }
  });

  it('transitions existing patient account to verified', async () => {
    isPatientAccountVerifiedMock.mockReturnValue(false);

    const patientAccountMock: IPatientAccount = patientAccountPrimaryMock;
    const familyIdMock = 'family-id';

    getPatientAccountByAccountIdMock.mockReturnValueOnce(patientAccountMock);

    const actual = await processNewAccountOnLogin(
      configurationMock,
      patientAccountMock,
      identityMock,
      familyIdMock,
      '0.0.0.0',
      'browser'
    );

    expectToHaveBeenCalledOnceOnlyWith(
      transitionPatientAccountToVerifiedMock,
      configurationMock,
      patientAccountMock,
      identityMock,
      familyIdMock
    );

    expect(assertHasAccountIdMock).toHaveBeenCalledWith(
      patientAccountMock.accountId
    );
    expect(getPatientAccountByAccountIdMock).toHaveBeenCalledWith(
      configurationMock,
      patientAccountMock.accountId,
      true,
      true
    );
    expect(actual).toEqual(patientAccountMock);
  });
});

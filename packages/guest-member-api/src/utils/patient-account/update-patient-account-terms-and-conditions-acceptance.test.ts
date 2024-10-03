// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { configurationMock } from '../../mock-data/configuration.mock';
import { patientAccountPrimaryWithPatientMock } from '../../mock-data/patient-account.mock';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { ITermsAndConditionsAcceptance } from '../../models/platform/patient-account/properties/patient-account-terms-and-conditions';
import { updatePatientAccount } from '../external-api/patient-account/update-patient-account';
import { updatePatientAccountTermsAndConditionsAcceptance } from './update-patient-account-terms-and-conditions-acceptance';

jest.mock('../external-api/patient-account/update-patient-account');
const updatePatientAccountMock = updatePatientAccount as jest.Mock;

describe('updatePatientAccountTermsAndConditionsAcceptance', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    updatePatientAccountMock.mockResolvedValue(undefined);
  });

  it('calls updatePatientAccount', async () => {
    const termsAndConditionsAcceptanceMock = {
      hasAccepted: true,
    } as ITermsAndConditionsAcceptance;

    await updatePatientAccountTermsAndConditionsAcceptance(
      configurationMock,
      patientAccountPrimaryWithPatientMock,
      termsAndConditionsAcceptanceMock as ITermsAndConditionsAcceptance
    );

    const expectedPatientAccountForUpdate: IPatientAccount = {
      ...patientAccountPrimaryWithPatientMock,
      termsAndConditions: termsAndConditionsAcceptanceMock,
    };

    expectToHaveBeenCalledOnceOnlyWith(
      updatePatientAccountMock,
      configurationMock,
      expectedPatientAccountForUpdate
    );
  });

  it('returns updated patient account', async () => {
    const termsAndConditionsAcceptanceMock = {
      hasAccepted: true,
    } as ITermsAndConditionsAcceptance;

    const actual = await updatePatientAccountTermsAndConditionsAcceptance(
      configurationMock,
      patientAccountPrimaryWithPatientMock,
      termsAndConditionsAcceptanceMock as ITermsAndConditionsAcceptance
    );

    const expectedPatientAccountForUpdate: IPatientAccount = {
      ...patientAccountPrimaryWithPatientMock,
      termsAndConditions: termsAndConditionsAcceptanceMock,
    };

    expectToHaveBeenCalledOnceOnlyWith(
      updatePatientAccountMock,
      configurationMock,
      expectedPatientAccountForUpdate
    );
    expect(actual).toEqual(expectedPatientAccountForUpdate);
  });
});

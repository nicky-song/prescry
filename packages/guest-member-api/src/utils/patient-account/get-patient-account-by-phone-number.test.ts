// Copyright 2022 Prescryptive Health, Inc.

import { generateSHA512Hash } from '@phx/common/src/utils/crypto.helper';
import { configurationMock } from '../../mock-data/configuration.mock';
import { patientAccountPrimaryWithPatientMock } from '../../mock-data/patient-account.mock';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { getPatientAccountsByReference } from '../external-api/patient-account/get-patient-accounts-by-reference';
import { getPatientAccountByPhoneNumber } from './get-patient-account-by-phone-number';

jest.mock('@phx/common/src/utils/crypto.helper');
const generateSHA512HashMock = generateSHA512Hash as jest.Mock;

jest.mock('../external-api/patient-account/get-patient-accounts-by-reference');
const getPatientAccountsByReferenceMock =
  getPatientAccountsByReference as jest.Mock;

describe('getPatientAccountByPhoneNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([[undefined], [[]]])(
    'returns undefined if account not found (%#)',
    async (patientAccountResponseMock: IPatientAccount[] | undefined) => {
      const phoneHashMock = 'phone-hash';
      generateSHA512HashMock.mockReturnValue(phoneHashMock);

      getPatientAccountsByReferenceMock.mockResolvedValue(
        patientAccountResponseMock
      );

      const phoneNumberMock = 'phone-number';
      const patientAccount = await getPatientAccountByPhoneNumber(
        configurationMock,
        phoneNumberMock
      );

      expect(generateSHA512HashMock).toHaveBeenCalledTimes(1);
      expect(generateSHA512HashMock).toHaveBeenNthCalledWith(
        1,
        phoneNumberMock
      );

      expect(getPatientAccountsByReferenceMock).toHaveBeenCalledTimes(1);
      expect(getPatientAccountsByReferenceMock).toHaveBeenNthCalledWith(
        1,
        configurationMock,
        phoneHashMock,
        true,
        true
      );

      expect(patientAccount).toBeUndefined();
    }
  );

  it('returns account if found', async () => {
    const phoneHashMock = 'phone-hash';
    generateSHA512HashMock.mockReturnValue(phoneHashMock);

    getPatientAccountsByReferenceMock.mockResolvedValue([
      patientAccountPrimaryWithPatientMock,
    ]);

    const phoneNumberMock = 'phone-number';
    const patientAccount = await getPatientAccountByPhoneNumber(
      configurationMock,
      phoneNumberMock
    );

    expect(generateSHA512HashMock).toHaveBeenCalledTimes(1);
    expect(generateSHA512HashMock).toHaveBeenNthCalledWith(1, phoneNumberMock);

    expect(getPatientAccountsByReferenceMock).toHaveBeenCalledTimes(1);
    expect(getPatientAccountsByReferenceMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      phoneHashMock,
      true,
      true
    );

    expect(patientAccount).toEqual(patientAccountPrimaryWithPatientMock);
  });
});

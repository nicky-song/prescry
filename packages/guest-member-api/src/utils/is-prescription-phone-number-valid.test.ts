// Copyright 2023 Prescryptive Health, Inc.

import { configurationMock } from '../mock-data/configuration.mock';
import { IContactPoint } from '../models/fhir/contact-point';
import { IPatient } from '../models/fhir/patient/patient';
import { getPatientByMasterId } from './external-api/identity/get-patient-by-master-id';
import { isPrescriptionPhoneNumberValid } from './is-prescription-phone-number-valid';

jest.mock('./external-api/identity/get-patient-by-master-id');
const getPatientByMasterIdMock = getPatientByMasterId as jest.Mock;

describe('isPrescriptionPhoneNumberValid', () => {
  describe('failure scenarios', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('returns false when patient does not exist for prescription master id', async () => {
      const prescriptionMasterIdMock = 'master-id-mock';

      const phoneNumberMock = '+11111111112';

      const telecomMock = [
        {
          system: 'phone',
          value: phoneNumberMock,
          use: 'mobile',
        },
      ] as IContactPoint[];

      const loggedInPatientMock: Partial<IPatient> = {
        telecom: telecomMock,
      };

      getPatientByMasterIdMock.mockResolvedValueOnce(undefined);

      const actual = await isPrescriptionPhoneNumberValid(
        prescriptionMasterIdMock,
        loggedInPatientMock,
        configurationMock
      );

      expect(actual).toEqual(false);
    });

    it('returns false when phone number is not found', async () => {
      const prescriptionMasterIdMock = 'master-id-mock';
      const phoneNumberMock = '+11111111112';

      const telecomMock = [
        {
          system: 'phone',
          value: phoneNumberMock,
          use: 'home',
        },
      ] as IContactPoint[];

      const prescriptionPatientMock: Partial<IPatient> = {
        telecom: telecomMock,
      };

      const loggedInPatientMock: Partial<IPatient> = {
        telecom: telecomMock,
      };

      getPatientByMasterIdMock.mockResolvedValueOnce(prescriptionPatientMock);

      const actual = await isPrescriptionPhoneNumberValid(
        prescriptionMasterIdMock,
        loggedInPatientMock,
        configurationMock
      );

      expect(actual).toEqual(false);
    });
  });

  describe('success scenarios', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('if phone number does not have country code, add it and validate with logged in patient phone number', async () => {
      const prescriptionMasterIdMock = 'master-id-mock';
      const phoneNumberMock = '+11111111112';
      const prescriptionPhoneNumberMock = '1111111112';

      const telecomMock = [
        {
          system: 'phone',
          value: phoneNumberMock,
          use: 'mobile',
        },
      ] as IContactPoint[];

      const prescriptionTelecomMock = [
        {
          system: 'phone',
          value: prescriptionPhoneNumberMock,
          use: 'mobile',
        },
      ] as IContactPoint[];

      const prescriptionPatientMock: Partial<IPatient> = {
        telecom: prescriptionTelecomMock,
      };

      const loggedInPatientMock: Partial<IPatient> = {
        telecom: telecomMock,
      };

      getPatientByMasterIdMock.mockResolvedValueOnce(prescriptionPatientMock);

      const actual = await isPrescriptionPhoneNumberValid(
        prescriptionMasterIdMock,
        loggedInPatientMock,
        configurationMock
      );

      expect(actual).toEqual(true);
    });

    it('returns true if phone number from prescription matches with logged in patient phone number', async () => {
      const prescriptionMasterIdMock = 'master-id-mock';
      const phoneNumberMock = '+11111111112';

      const telecomMock = [
        {
          system: 'phone',
          value: phoneNumberMock,
          use: 'mobile',
        },
      ] as IContactPoint[];

      const prescriptionPatientMock: Partial<IPatient> = {
        telecom: telecomMock,
      };

      const loggedInPatientMock: Partial<IPatient> = {
        telecom: telecomMock,
      };

      getPatientByMasterIdMock.mockResolvedValueOnce(prescriptionPatientMock);

      const actual = await isPrescriptionPhoneNumberValid(
        prescriptionMasterIdMock,
        loggedInPatientMock,
        configurationMock
      );

      expect(actual).toEqual(true);
    });
  });
});

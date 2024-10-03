// Copyright 2023 Prescryptive Health, Inc.

import { PhoneData, CashUserType, UserOptions } from '../types';
import { resetAccount } from '../utilities/dangerous-utilities/reset-account';
import { generateCashUser } from '../utilities/generate-cash-user';
import { PatientAccountService, PatientService } from '../services/external';
import { BenefitService, PhoneService } from '.';
import { patientAccountTemplate } from '../test-data';
import { AccountRepository } from '../data-access';

export class UserService {
  public static async getPbmUser(pbmUser: PhoneData) {
    const phoneHash = PhoneService.phoneNumberHash(pbmUser);
    const accounts = await PatientAccountService.getByReference(phoneHash);
    if (accounts?.length === 1) {
      const masterId = accounts[0].accountId;
      if (masterId) {
        const patient = await PatientService.getByMasterId(masterId);
        if (patient) {
          const { name, telecom, identifier } = patient;
          if (name && telecom && identifier) {
            const uniqueId = identifier.find((entry) =>
              entry.value?.startsWith('PBM')
            )?.value;
            const lastName = name[0].family;
            const given = name[0].given;
            const email = telecom.find(
              (entry) => entry.system === 'email'
            )?.value;
            if (lastName && given && email && uniqueId) {
              return {
                firstName: given[0],
                lastName,
                email,
                primaryMemberFamilyId: uniqueId.slice(0, uniqueId.length - 2),
                rxSubGroup: 'CON03',
                primaryMemberPersonCode: uniqueId.slice(uniqueId.length - 2),
                gender: patient.gender,
                phoneNumberDialingCode: pbmUser.countryCode,
                ...pbmUser,
              };
            }
          }
        }
      }
    }
    return null;
  }

  public static async createPbmUser(pbmUser: PhoneData, options?: UserOptions) {
    await resetAccount({
      number: pbmUser.phoneNumber,
      countryCode: pbmUser.countryCode,
    });
    const person = await BenefitService.create(pbmUser, options);
    const withoutAccount =
      options?.withoutAccount || options?.withActivationPhone;
    if (!withoutAccount) {
      const patientId = person.masterId;
      const phoneHash = PhoneService.phoneNumberHash(pbmUser);
      const patientAccount = {
        ...patientAccountTemplate,
        accountId: patientId,
        patientId,
        patientProfile: `patient/${patientId}`,
        reference: [phoneHash, patientId],
      };
      await PatientAccountService.create(patientAccount);
      await AccountRepository.createAccount(pbmUser, person);
    }
    return {
      ...person,
      ...pbmUser,
      phoneNumberDialingCode: pbmUser.countryCode,
    };
  }

  public static async getCashUser(user: CashUserType) {
    const phoneHash = PhoneService.phoneNumberHash({
      phoneNumber: user.phoneNumber,
      countryCode: user.phoneNumberDialingCode,
    });
    const accounts = await PatientAccountService.getByReference(phoneHash);
    if (accounts?.length === 1) {
      const masterId = accounts[0].accountId;
      if (masterId) {
        const patient = await PatientService.getByMasterId(masterId);
        if (patient) {
          const { name, telecom, identifier } = patient;
          if (name && telecom && identifier) {
            const uniqueId = identifier.find((entry) =>
              entry.value?.startsWith('CASH')
            )?.value;
            const lastName = name[0].family;
            const given = name[0].given;
            const email = telecom.find(
              (entry) => entry.system === 'email'
            )?.value;
            if (
              lastName === user.lastName &&
              given &&
              given[0] === user.firstName &&
              email === user.email &&
              uniqueId
            ) {
              return {
                primaryMemberFamilyId: uniqueId.slice(0, uniqueId.length - 2),
                primaryMemberPersonCode: uniqueId.slice(uniqueId.length - 2),
                ...user,
              };
            }
          }
        }
      }
    }
  }

  public static async createCashUser(user: CashUserType) {
    const {
      phoneNumber,
      phoneNumberDialingCode,
      firstName,
      lastName,
      email,
      dateOfBirth,
    } = user;
    await resetAccount({
      number: phoneNumber,
      countryCode: phoneNumberDialingCode,
    });
    const cashUser = {
      firstName,
      lastName,
      email,
      birthDate: dateOfBirth.split('T')[0],
      phoneNumber,
      countryCode: phoneNumberDialingCode,
    };
    await generateCashUser(cashUser);
  }
}

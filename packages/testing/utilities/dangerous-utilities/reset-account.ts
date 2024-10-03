// Copyright 2022 Prescryptive Health, Inc.

import resetAccountInDatabase from './reset-account-in-database';
import { SessionService, PhoneService } from '../../services';
import { PatientService, PatientAccountService } from '../../services/external';
import { removeLocalStorage } from '../local-storage-helper';

async function resetByMasterId(masterId: string) {
  // Getting the object Patient by MasterId
  const patientObject = await PatientService.getByMasterId(masterId);
  if (patientObject) {
    // Resetting the Patient object (Setting phoneNumber 000-000-000 and familyName xxx)
    try {
      await PatientService.reset(masterId, patientObject);
      // Getting the object PatientAccount by MasterId
      const patientAccountObject = await PatientAccountService.getByMasterId(
        masterId
      );
      if (patientAccountObject) {
        // Resetting the PatientAccount object (Setting reference by current timestamp)
        await PatientAccountService.reset(patientAccountObject);
      } else {
        // eslint-disable-next-line no-console
        console.log(
          `Object of ${masterId} does not exist in patient account document`
        );
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Failed reset of ${masterId} with error ${error}`);
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(`Object of ${masterId} does not exist in patient document`);
  }
}

export async function resetAccount(phone: {
  countryCode: string;
  number: string;
}) {
  const phoneNumberWithCountryCode = `${phone.countryCode}${phone.number}`;
  await resetAccountInDatabase(phoneNumberWithCountryCode);
  await removeLocalStorage(phone.countryCode, phone.number);
  await SessionService.clear(phoneNumberWithCountryCode);

  // Getting the MasterId by Phone Number
  const patient = await PatientService.queryByPhoneNumber(
    phoneNumberWithCountryCode
  );
  if (!patient.entry) {
    // eslint-disable-next-line no-console
    console.log(
      `Not found masterId for the phone number: ${phoneNumberWithCountryCode}`
    );
  } else {
    await Promise.all(
      patient.entry.map(async (entry) => {
        const masterId = entry.resource.id;
        if (masterId) {
          await resetByMasterId(masterId);
        } else {
          // eslint-disable-next-line no-console
          console.log(
            `Master Id of ${phoneNumberWithCountryCode} does not exist in patient`
          );
        }
      })
    );
  }
  const reference = PhoneService.phoneNumberHash(phoneNumberWithCountryCode);
  const patientAccountList = await PatientAccountService.getByReference(
    reference
  );
  await Promise.all(
    patientAccountList.map((patientAccount) =>
      PatientAccountService.reset(patientAccount)
    )
  );
}

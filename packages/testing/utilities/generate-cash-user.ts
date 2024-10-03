// Copyright 2023 Prescryptive Health, Inc.

import {
  patientAccountTemplate,
  cashPatientTemplate,
  accountTemplate,
  cashPersonTemplate,
  coverageTemplate,
  cashUserClassMap,
} from '../test-data';
import {
  CoverageService,
  PatientAccountService,
  PatientService,
} from '../services/external';
import DatabaseConnection from '../utilities/database/database-connection';
import RxAssistantDatabase from './database/rx-assistant-database';
import { PhoneService } from '../services';
import { PhoneData } from '../types/phone-data';
import { BenefitPerson } from '../types';

type CashUserData = PhoneData & {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
};

const isIdentifierCode = (identifier, code: string) =>
  identifier.type.coding.some((coding) => coding.code === code);

const patientUrlPrefix = 'https://gears.test.prescryptive.io/identity/Patient/';

function getCoverage(uniqueId: string, masterId: string, familyId: string) {
  const identifier = coverageTemplate.identifier?.map((identifier) => {
    if (isIdentifierCode(identifier, 'MB')) {
      return { ...identifier, value: uniqueId };
    }
    if (isIdentifierCode(identifier, 'masterId')) {
      return {
        ...identifier,
        value: `${patientUrlPrefix}${masterId}`,
      };
    }
    return identifier;
  });

  const classMap = {
    ...cashUserClassMap,
    familyid: familyId,
  };

  const patientClass = coverageTemplate.class?.map((entry) => {
    const coding = entry.type.coding?.find(
      (coding) => coding.code && classMap[coding.code]
    );
    const code = coding?.code;
    if (code) {
      const value = classMap[code];
      return { ...entry, value };
    }
    return entry;
  });

  const reference = `patient/${masterId}`;

  const payor = [
    {
      reference,
      type: 'Patient',
    },
  ];

  const coverage = {
    ...coverageTemplate,
    identifier,
    payor,
    subscriberId: familyId,
    subscriber: { ...coverageTemplate.subscriber, reference },
    beneficiary: { ...coverageTemplate.beneficiary, reference },
    class: patientClass,
  };
  return coverage;
}

export const generateCashUser = async (person: CashUserData) => {
  const phoneNumber = PhoneService.phoneNumberWithCountryCode(person);
  const timestamp = Date.now();
  const primaryMemberFamilyId = `CASH${timestamp}`;
  const primaryMemberRxId = `${primaryMemberFamilyId}01`;
  const telecom = getTelecom(phoneNumber, person.email);
  const identifier = getIdentifier(
    phoneNumber,
    primaryMemberRxId,
    primaryMemberFamilyId
  );
  const patientId = await createCashPatient(identifier, telecom, person);
  const accountId = await createCashPatientAccount(
    phoneNumber,
    patientId,
    primaryMemberRxId
  );
  const coverage = getCoverage(
    primaryMemberRxId,
    patientId,
    primaryMemberFamilyId
  );
  await CoverageService.create(coverage);
  await createInOldStorage({
    person,
    accountId,
    phoneNumber,
    primaryMemberRxId,
    primaryMemberFamilyId,
  });
};

async function createInOldStorage({
  person,
  accountId,
  phoneNumber,
  primaryMemberRxId,
  primaryMemberFamilyId,
}) {
  const connection = await DatabaseConnection.connect();
  try {
    const rxAssistant = connection.getRxAssistant();
    await createPersonInOldStorage(
      connection,
      person,
      phoneNumber,
      primaryMemberRxId,
      primaryMemberFamilyId,
      accountId,
      rxAssistant
    );
    await createAccountInOldStorage(
      accountId,
      phoneNumber,
      person,
      rxAssistant
    );
  } catch (error) {
    throw new Error(`Cash user generation failed with error: ${error}`);
  } finally {
    await connection.close();
  }
}

async function createPersonInOldStorage(
  connection: DatabaseConnection,
  person,
  phoneNumber: string,
  primaryMemberRxId: string,
  primaryMemberFamilyId: string,
  accountId: string,
  rxAssistant: RxAssistantDatabase
) {
  const _id = connection.createObjectId();
  const rxPerson = {
    ...cashPersonTemplate,
    _id,
    identifier: _id.toHexString(),
    firstName: person.firstName,
    lastName: person.lastName,
    dateOfBirth: person.birthDate,
    email: person.email,
    phoneNumber,
    primaryMemberRxId,
    primaryMemberFamilyId,
    masterId: accountId,
    accountId,
  };
  await rxAssistant.createPerson(rxPerson);
}

async function createAccountInOldStorage(
  accountId: string,
  phoneNumber: string,
  person: BenefitPerson,
  rxAssistant: RxAssistantDatabase
) {
  const termsAndConditionsAcceptances = {
    ...accountTemplate.termsAndConditionsAcceptances,
    acceptedDateTime: new Date().toISOString(),
  };
  const dateOfBirth = new Date(`${person.birthDate}T00:00:00Z`);
  const account = {
    ...accountTemplate,
    phoneNumber,
    dateOfBirth,
    termsAndConditionsAcceptances,
    firstName: person.firstName,
    lastName: person.lastName,
    recoveryEmail: person.email,
    masterId: accountId,
    accountId,
  };
  await rxAssistant.createAccount(account);
}

async function createCashPatientAccount(
  phoneNumber: string,
  patientId: string,
  uniqueId: string
) {
  const phoneHash = PhoneService.phoneNumberHash(phoneNumber);
  const patientAccount = {
    ...patientAccountTemplate,
    accountId: patientId,
    patientId,
    patientProfile: `patient/${patientId}`,
    reference: [phoneHash, uniqueId, patientId],
  };
  const patientAccountResponse = await PatientAccountService.create(
    patientAccount
  );
  return patientAccountResponse.accountId;
}

async function createCashPatient(identifier, telecom, person) {
  const cashPatient = {
    ...cashPatientTemplate,
    identifier,
    telecom,
    name: [{ family: person.lastName, given: [person.firstName] }],
    birthDate: person.birthDate,
  };
  const cashPatientResponse = await PatientService.create(cashPatient);
  return cashPatientResponse.id;
}

function getIdentifier(
  phoneNumber: string,
  primaryMemberRxId: string,
  primaryMemberFamilyId: string
) {
  return cashPatientTemplate.identifier?.map((entry) => {
    const coding = entry.type?.coding;
    if (coding) {
      const code = coding[0].code;
      if (code === 'MYRX-PHONE') {
        return { ...entry, value: phoneNumber };
      }
      if (code === 'MYRX') {
        return { ...entry, value: primaryMemberRxId };
      }
      if (code === 'CASH-FAMILY') {
        return { ...entry, value: primaryMemberFamilyId };
      }
    }
  });
}

function getTelecom(phoneNumber: string, email: string) {
  return cashPatientTemplate.telecom?.map((entry) => {
    if (entry.system === 'email') {
      return { ...entry, value: email };
    }
    if (entry.use === 'mobile') {
      return { ...entry, value: phoneNumber };
    }
  });
}

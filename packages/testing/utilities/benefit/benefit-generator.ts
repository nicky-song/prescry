// Copyright 2022 Prescryptive Health, Inc.

import DatabaseConnection from '../database/database-connection';
import { BenefitPerson, PhoneData, UserOptions } from '../../types';
import { pbmPatientTemplate, coverageTemplate, pbmUser } from '../../test-data';
import { PhoneService } from '../../services';
import { CoverageService, PatientService } from '../../services/external';
import * as benefitPersonTemplate from '../../test-data/benefit/person.json';
import * as personCoverageTemplate from '../../test-data/benefit/person-coverage.json';
import * as personTemplate from '../../test-data/rx-assistant/person.json';

const isIdentifierCode = (identifier, code: string) =>
  identifier.type.coding.some((coding) => coding.code === code);

const patientUrlPrefix = 'https://gears.test.prescryptive.io/identity/Patient/';

function getDate(date: string) {
  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
}

function getGenderCodeBlockchain(gender: string): 'male' | 'female' | 'other' {
  switch (gender) {
    case 'F':
      return 'female';
    case 'M':
      return 'male';
    default:
      return 'other';
  }
}

function getPatient({
  uniqueId,
  lastName,
  firstName,
  gender,
  birthDate,
  email,
  phone,
  rank,
}) {
  const telecom = getTelecom(phone, email, rank);
  const identifier = pbmPatientTemplate.identifier?.map((entry) => {
    return entry.type?.text === 'uniqueId'
      ? { ...entry, value: uniqueId }
      : entry;
  });
  const patient = {
    ...pbmPatientTemplate,
    identifier,
    name: [{ family: lastName, given: [firstName] }],
    gender,
    birthDate,
    telecom,
  };
  return patient;
}

function getTelecom(phone: PhoneData, email: string, rank?: number) {
  let telecom = pbmPatientTemplate.telecom;
  if (telecom) {
    const telecomTemplate = telecom[0];
    if (phone) {
      telecom = [
        {
          ...telecomTemplate,
          use: 'mobile',
          value: PhoneService.phoneNumberWithCountryCode(phone),
          rank,
        },
      ];
    }
    if (email) {
      telecom = [
        ...telecom,
        {
          ...telecomTemplate,
          system: 'email',
          value: email,
          use: 'home',
        },
      ];
    }
  }
  return telecom;
}

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

  const patientClass = coverageTemplate.class?.map((entry) => {
    if (isIdentifierCode(entry, 'familyid')) {
      return { ...entry, value: familyId };
    }
    return entry;
  });

  const reference = `patient/${masterId}`;

  const coverage = {
    ...coverageTemplate,
    identifier,
    subscriberId: familyId,
    subscriber: { ...coverageTemplate.subscriber, reference },
    beneficiary: { ...coverageTemplate.beneficiary, reference },
    class: patientClass,
  };
  return coverage;
}

export async function benefitGenerator(
  phone?: PhoneData,
  options?: UserOptions
) {
  const connection = await DatabaseConnection.connect();
  try {
    const benefit = connection.getBenefit();

    const timestamp = Date.now();
    const familyId = `PBM${timestamp}`;
    const { firstName, lastName } = pbmUser;
    const email = `testing-${timestamp}@prescryptive.com`;
    const uniqueId = `${familyId}${benefitPersonTemplate.personCode}`;

    const benefitPerson = {
      ...benefitPersonTemplate,
      familyId,
      firstName,
      lastName,
      uniqueId,
    };
    await benefit.createPerson(benefitPerson);

    const personCoverage = { ...personCoverageTemplate, familyId, uniqueId };
    await benefit.createPersonCoverage(personCoverage);

    const gender = getGenderCodeBlockchain(benefitPersonTemplate.gender);
    const birthDate = getDate(benefitPersonTemplate.birthDate);

    const withActivationPhone = options?.withActivationPhone ?? false;
    const rank = withActivationPhone ? 1 : undefined;
    const patient = getPatient({
      uniqueId,
      lastName,
      firstName,
      gender,
      birthDate,
      email,
      phone,
      rank,
    });
    const patientResponse = await PatientService.create(patient);

    const coverage = getCoverage(uniqueId, patientResponse.id, familyId);
    await CoverageService.create(coverage);

    const rxAssistant = connection.getRxAssistant();
    const _id = connection.createObjectId();
    const phoneNumber = phone
      ? PhoneService.phoneNumberWithCountryCode(phone)
      : '';
    const person = {
      ...personTemplate,
      _id,
      identifier: _id.toHexString(),
      firstName,
      lastName,
      primaryMemberFamilyId: familyId,
      primaryMemberRxId: uniqueId,
      phoneNumber: withActivationPhone ? '' : phoneNumber,
      activationPhoneNumber: withActivationPhone ? phoneNumber : undefined,
      isPhoneNumberVerified: !withActivationPhone && phone !== undefined,
      masterId: patientResponse.id,
      email,
    };
    await rxAssistant.createPerson(person);
    return {
      ...person,
      email,
      masterId: patientResponse.id,
      gender,
      birthDate,
    } as BenefitPerson;
  } catch (error) {
    throw new Error(`Benefit generation failed with error: ${error}`);
  } finally {
    await connection.close();
  }
}

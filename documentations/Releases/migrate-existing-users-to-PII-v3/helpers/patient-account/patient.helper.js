// Copyright 2022 Prescryptive Health, Inc.

import { splitFirstName } from './human-name.helper.js';

export const identifierTypeSystemUrl =
  'http://hl7.org/fhir/ValueSet/identifier-type';

export const PatientIdentifierCodeableConceptCode = {
  FAMILY_ID: 'CASH-FAMILY',
  MEMBER_ID: 'MYRX',
  PHONE_NUMBER: 'MYRX-PHONE',
};

export const buildPatientIdentifiers = (familyId, memberId, phoneNumber) => [
  {
    type: {
      coding: [
        {
          code: PatientIdentifierCodeableConceptCode.PHONE_NUMBER,
          display: "Patient's MyRx Phone Number",
          system: identifierTypeSystemUrl,
        },
      ],
    },
    value: phoneNumber,
  },
  {
    type: {
      coding: [
        {
          code: PatientIdentifierCodeableConceptCode.MEMBER_ID,
          display: 'Unique MyRx ID',
          system: identifierTypeSystemUrl,
        },
      ],
    },
    value: memberId,
  },
  {
    type: {
      coding: [
        {
          code: PatientIdentifierCodeableConceptCode.FAMILY_ID,
          display: "Patient's Cash Family Id",
          system: identifierTypeSystemUrl,
        },
      ],
    },
    value: familyId,
  },
];

export function buildPatientGender(gender) {
  return { F: 'female', M: 'male' }[gender?.[0]?.toUpperCase()];
}

export function buildPatientNames(cashProfile) {
  const { firstName, lastName } = cashProfile;
  const firstNameToUse = firstName.toUpperCase();
  const lastNameToUse = lastName.toUpperCase();

  return [
    {
      use: 'official',
      family: lastNameToUse,
      given: splitFirstName(firstNameToUse),
    },
  ];
}

export function buildPatientTelecom(
  cashProfile,
  account,
  isDependent,
  primaryPhoneNumber
) {
  const phoneContact = {
    system: 'phone',
    value: primaryPhoneNumber ?? cashProfile.phoneNumber,
    use: 'mobile',
  };

  if (isDependent) {
    return [phoneContact];
  }

  const { email } = cashProfile;
  const { recoveryEmail } = account ?? {};
  const emailToUse = recoveryEmail ?? email;

  return [
    {
      system: 'email',
      value: emailToUse,
      use: 'home',
    },
    phoneContact,
  ];
}

export function buildPatientAddress(cashProfile) {
  if (cashProfile.address1) {
    return [
      {
        use: 'home',
        type: 'physical',
        line: cashProfile.address2
          ? [cashProfile.address1, cashProfile.address2]
          : [cashProfile.address1],
        state: cashProfile.state,
        city: cashProfile.city,
        postalCode: cashProfile.zip,
      },
    ];
  }
  return [];
}

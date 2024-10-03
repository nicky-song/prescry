// Copyright 2022 Prescryptive Health, Inc.

import { ApiConstants } from '../../constants/api-constants';
import { IContactPoint } from '../../models/fhir/contact-point';
import { IPatient } from '../../models/fhir/patient/patient';
import { ContactPointSystem, ContactPointUse } from '../../models/fhir/types';

export function compareContactPointPeriod(
  contactPoint1: IContactPoint | undefined,
  contactPoint2: IContactPoint | undefined
): number {
  if (contactPoint1?.period && contactPoint2?.period) {
    if (contactPoint2.period.end && contactPoint1.period.end) {
      if (contactPoint2.period.end === contactPoint1.period.end) {
        return 0;
      } else {
        return contactPoint2.period.end < contactPoint1.period.end ? -1 : 1;
      }
    } else {
      if (!contactPoint1.period.end && !contactPoint2.period.end) {
        if (contactPoint2.period.start && contactPoint1.period.start) {
          if (contactPoint2.period.start === contactPoint1.period.start) {
            return 0;
          } else {
            return contactPoint2.period.start < contactPoint1.period.start
              ? -1
              : 1;
          }
        }
        if (contactPoint2?.period.start) {
          return -1;
        }
        if (contactPoint1?.period.start) {
          return 1;
        }
      }
      if (!contactPoint1.period.end && contactPoint2.period.end) {
        return -1;
      }
      return 1;
    }
  } else {
    if (contactPoint2?.period) {
      return -1;
    }
    if (contactPoint1?.period) {
      return 1;
    }
    return 0;
  }
}

export function getMobileContactPhone(patient?: IPatient, rank?: number) {
  if (!patient || !patient.telecom) {
    return undefined;
  }
  const phone = getMostRecentPreferredContactForSystem(
    patient.telecom,
    'mobile',
    'phone',
    rank
  );
  if (!phone) {
    return undefined;
  }
  if (phone.startsWith(ApiConstants.COUNTRY_CODE)) {
    return phone;
  }
  return `${ApiConstants.COUNTRY_CODE}${phone}`;
}

export function getPreferredContactForSystem(
  contacts: IContactPoint[],
  contactPurpose: string,
  system: ContactPointSystem,
  rank?: number
): string | undefined {
  const patientContact = rank
    ? contacts.find(
        (contact) =>
          contact.system === system &&
          contact.use === contactPurpose &&
          contact.rank === rank
      )
    : contacts.find(
        (contact) => contact.system === system && contact.use === contactPurpose
      );
  return patientContact?.value;
}

export function getPreferredEmailFromPatient(
  patient?: IPatient
): string | undefined {
  return getEmailFromPatientForPurpose('home', patient);
}

export function getMostRecentPreferredContactForSystem(
  contacts: IContactPoint[],
  contactPurpose: ContactPointUse,
  system: ContactPointSystem,
  rank?: number
): string | undefined {
  contacts.sort(compareContactPointPeriod);
  return getPreferredContactForSystem(contacts, contactPurpose, system, rank);
}

export function getEmailFromPatientForPurpose(
  contactPurpose: ContactPointUse,
  patient?: IPatient
): string | undefined {
  if (!patient || !patient.telecom) {
    return undefined;
  }
  const email = getMostRecentPreferredContactForSystem(
    patient.telecom,
    contactPurpose,
    'email'
  );
  if (!email) {
    return undefined;
  }

  return email;
}

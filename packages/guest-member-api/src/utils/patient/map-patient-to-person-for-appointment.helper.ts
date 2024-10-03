// Copyright 2023 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import moment from 'moment';
import { assertHasMasterId } from '../../assertions/assert-has-master-id';
import { assertHasPersonCode } from '../../assertions/assert-has-person-code';
import { assertHasPhoneNumber } from '../../assertions/assert-has-phone-number';
import { IConfiguration } from '../../configuration';
import { IPatient } from '../../models/fhir/patient/patient';
import { getPatientCoverageByBeneficiaryId } from '../coverage/get-patient-coverage-by-beneficiary-id';
import { getActiveCoveragesOfPatient } from '../fhir-patient/get-active-coverages-of-patient';
import { getMobileContactPhone } from '../fhir-patient/get-contact-info-from-patient';
import { getMemberIdFromPatient } from '../fhir-patient/patient-identifier.helper';
import {
  buildFirstName,
  buildLastName,
  getHumanName,
} from '../fhir/human-name.helper';

export const mapPatientToPersonForAppointment = async (
  patient: IPatient,
  configuration: IConfiguration
): Promise<IPerson | undefined> => {
  const phoneNumber = getMobileContactPhone(patient);

  assertHasPhoneNumber(phoneNumber);

  const masterId = patient?.id;

  assertHasMasterId(masterId, phoneNumber);

  const patientCoverages =
    (await getPatientCoverageByBeneficiaryId(configuration, masterId)) ?? [];

  const activeCoverages = getActiveCoveragesOfPatient(patientCoverages);

  if (activeCoverages.length === 1) {
    const dependentCoverage = activeCoverages[0];

    const familyId = dependentCoverage.subscriberId;

    const primaryMemberPersonCode = dependentCoverage.dependent;

    assertHasPersonCode(primaryMemberPersonCode);

    const name = getHumanName(patient.name, 'official');

    const firstName = buildFirstName(name);
    const lastName = buildLastName(name);
    const dateNow = getNewDate();
    const memberId = getMemberIdFromPatient(patient);

    const person = {
      firstName,
      lastName,
      dateOfBirth: patient.birthDate ? UTCDateString(patient.birthDate) : '',
      effectiveDate: moment(dateNow.toUTCString()).format('YYYYMMDD'),
      primaryMemberFamilyId: familyId,
      primaryMemberRxId: memberId,
      primaryMemberPersonCode,
      phoneNumber,
      isPrimary: false,
      masterId: patient.id,
    } as IPerson;

    return person;
  }

  return undefined;
};

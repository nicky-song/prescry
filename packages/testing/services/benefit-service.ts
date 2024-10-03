// Copyright 2023 Prescryptive Health, Inc.

import { PhoneData, UserOptions } from '../types';
import { benefitGenerator } from '../utilities/benefit/benefit-generator';
import { CoverageService, PatientService } from './external';
import { PhoneService } from './phone-service';

export abstract class BenefitService {
  public static async get(phone: PhoneData) {
    const phoneNumber = PhoneService.phoneNumberWithCountryCode(phone);
    const patientResult = await PatientService.queryByPhoneNumber(phoneNumber);
    const lastEntry = patientResult.entry.reduce(
      (previousValue, currentValue) =>
        currentValue.id >= previousValue.id ? currentValue : previousValue
    );
    if (lastEntry) {
      const masterId = lastEntry.id;
      const coverageQuery = `beneficiary=patient/${masterId}`;
      const coverageResult = await CoverageService.search(coverageQuery);
      const coverage = coverageResult.entry?.find(
        (entry) => entry.resource
      )?.resource;
      const { name, telecom, birthDate } = lastEntry.resource;
      if (
        name &&
        name[0] &&
        name[0].given &&
        telecom &&
        birthDate &&
        coverage
      ) {
        const firstName = name[0].given[0];
        const lastName = name[0].family;
        const email = telecom.find((entry) => entry.system === 'email')?.value;
        const coverageClass = coverage.class ?? [];
        const primaryMemberFamilyId = coverageClass.find((entry) =>
          entry.type.coding?.some((coding) => coding.code === 'familyid')
        )?.value;
        const rxSubGroup = coverageClass.find((entry) =>
          entry.type.coding?.some((coding) => coding.code === 'rxsubgroup')
        )?.value;
        const uniqueId = coverage.identifier?.find((entry) =>
          entry.type?.coding?.some((coding) => coding.code === 'MB')
        )?.value;
        const dateOfBirth = new Date(`${birthDate}T00:00:00Z`);
        const primaryMemberPersonCode = coverage.dependent;
        return {
          firstName,
          lastName,
          uniqueId,
          phoneNumber: phone.phoneNumber,
          email,
          masterId,
          dateOfBirth,
          primaryMemberFamilyId,
          rxSubGroup,
          primaryMemberPersonCode,
        };
      }
    }
  }

  public static create(phone: PhoneData, options?: UserOptions) {
    return benefitGenerator(phone, options);
  }
}

// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { ErrorConstants } from '../../constants/response-messages';
import { IPatient } from '../../models/fhir/patient/patient';
import { getPatientCoverageByQuery } from '../external-api/coverage/get-patient-coverage-by-query';
import { getPatientByPatientDetails } from '../external-api/identity/get-patient-by-patient-details';
import { getActiveCoveragesOfPatient } from '../fhir-patient/get-active-coverages-of-patient';
import { getMobileContactPhone } from '../fhir-patient/get-contact-info-from-patient';
import { matchFirstName } from '../fhir/human-name.helper';

export type verifyPatientResponse = {
  isValid: boolean;
  activationPatientMasterId?: string;
  activationPatientMemberId?: string;
  errorDetails?: string;
};
export const verifyPatientsByPhoneNumberAndOrMemberId = async (
  configuration: IConfiguration,
  withinTenant: boolean,
  firstName: string,
  dateOfBirth: string,
  primaryMemberRxId?: string,
  phoneNumber?: string
): Promise<verifyPatientResponse> => {
  const tenantIdCollection = new Set<IPatient>();

  const patients = await getPatientByPatientDetails(
    { phoneNumber },
    configuration
  );

  const verificationResponse: verifyPatientResponse = {
    isValid: false,
  };

  for (const patient of patients) {
    const security = patient.meta?.security;
    if (security?.length) {
      const tenantIdObject = security.filter((sec) =>
        withinTenant
          ? sec.system === 'http://prescryptive.io/tenant' &&
            sec.code === configuration.myrxIdentityTenantId
          : sec.system === 'http://prescryptive.io/tenant' &&
            sec.code !== configuration.myrxIdentityTenantId
      );

      if (tenantIdObject.length && patient.telecom) {
        const telecom = getMobileContactPhone(
          patient,
          withinTenant ? undefined : 1
        );
        if (telecom) {
          const matchedFirstNameObject = patient.name
            ? matchFirstName(firstName, patient.name)
            : undefined;

          const dateMatch = dateOfBirth === patient.birthDate;
          const isDataValid = dateMatch && !!matchedFirstNameObject;
          const phoneNumberMatch = telecom === phoneNumber;

          const addToCollection = withinTenant
            ? phoneNumberMatch && isDataValid
            : true;

          if (withinTenant && !isDataValid && phoneNumberMatch) {
            verificationResponse.isValid = false;
            verificationResponse.errorDetails =
              ErrorConstants.ACTIVATION_PATIENT_USER_DATA_MISMATCH;
          }

          if (withinTenant && isDataValid && !phoneNumberMatch) {
            verificationResponse.isValid = false;
            verificationResponse.errorDetails =
              ErrorConstants.ACTIVATION_PATIENT_PHONE_NUMBER_NOT_FOUND(
                phoneNumber
              );
          }

          if (addToCollection) tenantIdCollection.add(patient);
        }
      }
    }
  }
  const tenantIdCollectionIterator = tenantIdCollection.values();

  if (tenantIdCollection.size === 0) {
    if (!verificationResponse.errorDetails) {
      verificationResponse.isValid = false;
      verificationResponse.errorDetails =
        ErrorConstants.ACTIVATION_PATIENT_PHONE_NUMBER_NOT_FOUND(phoneNumber);
    }

    return verificationResponse;
  }

  if (tenantIdCollection.size === 1) {
    const patientRecord = tenantIdCollectionIterator.next().value;
    const query = `beneficiary=patient/${patientRecord.id}`;
    const patientCoverages = await getPatientCoverageByQuery(
      configuration,
      query
    );
    if (patientCoverages?.length) {
      const activeCoverages = getActiveCoveragesOfPatient(patientCoverages);
      if (
        activeCoverages?.length &&
        activeCoverages[0].subscriberId &&
        activeCoverages[0].dependent
      ) {
        const memberId =
          activeCoverages[0].subscriberId + activeCoverages[0].dependent;

        const matchMemberID =
          primaryMemberRxId && memberId
            ? [activeCoverages[0]?.subscriberId, memberId].includes(
                primaryMemberRxId
              )
            : true;

        const response: verifyPatientResponse = {
          isValid: true,
          activationPatientMasterId: patientRecord.id,
        };

        if (matchMemberID) {
          response.isValid = true;
          response.activationPatientMemberId = memberId;
        } else {
          response.isValid = false;
          response.errorDetails =
            ErrorConstants.ACTIVATION_PATIENT_USER_DATA_MISMATCH;
        }
        return response;
      }
    }
    verificationResponse.errorDetails =
      ErrorConstants.ACTIVATION_PATIENT_COVERAGES_NOT_FOUND(patientRecord.id);
    return verificationResponse;
  }

  verificationResponse.errorDetails =
    ErrorConstants.ACTIVATION_PATIENT_MULTIPLE_PBM_PLANS(phoneNumber);
  return verificationResponse;
};

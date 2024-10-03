// Copyright 2020 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  invalidMemberDetailsResponse,
  invalidMemberRxIdResponse,
} from '../../login/helpers/login-response.helper';
import { IConfiguration } from '../../../configuration';
import { getMasterIdFromCoverage } from '../../../utils/get-master-id-from-coverage.helper';
import { matchFirstName } from '../../../utils/fhir/human-name.helper';
import { getActiveCoveragesOfPatient } from '../../../utils/fhir-patient/get-active-coverages-of-patient';
import { getPatientByMasterId } from '../../../utils/external-api/identity/get-patient-by-master-id';
import { ICoverage } from '../../../models/fhir/patient-coverage/coverage';
import {
  IMembershipVerificationResponse,
  membershipVerificationHelper,
} from './membership-verification.helper';
import { getPatientCoverageByMemberId } from '../../../utils/coverage/get-patient-coverage-by-member-id';
import { getPatientCoverageByFamilyId } from '../../../utils/coverage/get-patient-coverage-by-family-id';
import { getMobileContactPhone } from '../../../utils/fhir-patient/get-contact-info-from-patient';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { verifyActivationRecord } from '../../../utils/verify-activation-record';
import { getCoverageRecordsByFirstName } from '../../../utils/coverage/get-coverage-records-by-first-name';

export const membershipVerificationHelperV2 = async (
  database: IDatabase,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  memberOrFamilyId: string,
  configuration: IConfiguration
): Promise<IMembershipVerificationResponse> => {
  try {
    let patientCoverages: ICoverage[] | undefined;
    let isDataValid = false;

    patientCoverages = await getPatientCoverageByMemberId(
      configuration,
      memberOrFamilyId
    );

    if (!patientCoverages?.length) {
      const familyIdCoverages = await getPatientCoverageByFamilyId(
        configuration,
        memberOrFamilyId
      );

      patientCoverages = familyIdCoverages?.length
        ? await getCoverageRecordsByFirstName(
            familyIdCoverages,
            firstName,
            configuration
          )
        : [];
    }

    if (!patientCoverages?.length) {
      return invalidMemberRxIdResponse(
        firstName,
        lastName,
        dateOfBirth,
        memberOrFamilyId
      );
    }

    const activeCoverages = getActiveCoveragesOfPatient(patientCoverages);

    if (!activeCoverages.length) {
      return {
        isValidMembership: false,
        responseCode: HttpStatusCodes.BAD_REQUEST,
        responseMessage: ErrorConstants.ACTIVE_COVERAGES_NOT_FOUND,
      };
    }

    if (activeCoverages.length > 1) {
      const tenantIdCollection = new Set();
      for (const coverage of activeCoverages) {
        const security = coverage?.meta?.security;
        if (security?.length) {
          const tenantIdObject = security.filter(
            (sec) =>
              sec.system === 'http://prescryptive.io/tenant' &&
              sec.code !== configuration.myrxIdentityTenantId
          );

          if (tenantIdObject.length) {
            tenantIdCollection.add(tenantIdObject[0].code);
          }
        }
      }

      if (tenantIdCollection.size === 0 || tenantIdCollection.size > 1) {
        return {
          isValidMembership: false,
          responseCode: HttpStatusCodes.BAD_REQUEST,
          responseMessage: ErrorConstants.COVERAGE_INVALID_DATA,
        };
      }
    }

    const pbmMasterId = getMasterIdFromCoverage(activeCoverages[0]);

    const pbmMemberId =
      activeCoverages[0].subscriberId && activeCoverages[0].dependent
        ? activeCoverages[0].subscriberId + activeCoverages[0].dependent
        : undefined;

    const patient = pbmMasterId
      ? await getPatientByMasterId(pbmMasterId, configuration)
      : undefined;

    if (!patient || !patient.name) {
      return {
        isValidMembership: false,
        responseCode: HttpStatusCodes.BAD_REQUEST,
        responseMessage: ErrorConstants.INVALID_PATIENT_IDENTITY_DATA,
      };
    }
    const matchedFirstNameObject = matchFirstName(firstName, patient.name);
    const dateMatch = dateOfBirth === patient.birthDate;
    isDataValid = dateMatch && !!matchedFirstNameObject;

    if (!isDataValid) {
      return invalidMemberDetailsResponse(
        firstName,
        lastName,
        dateOfBirth,
        memberOrFamilyId
      );
    }

    if (patient.telecom) {
      const activationPhoneNumber = getMobileContactPhone(patient, 1);

      if (activationPhoneNumber) {
        if (activationPhoneNumber !== phoneNumber) {
          return {
            isValidMembership: false,
            responseCode: HttpStatusCodes.BAD_REQUEST,
            responseMessage:
              ErrorConstants.ACTIVATION_PATIENT_USER_DATA_MISMATCH,
          };
        }
      } else {
        const verifyActivationRecordStatus = await verifyActivationRecord(
          database,
          phoneNumber,
          firstName,
          dateOfBirth,
          pbmMemberId,
          configuration,
          'v2'
        );

        if (!verifyActivationRecordStatus.isValid) {
          return {
            isValidMembership: false,
            responseCode: HttpStatusCodes.BAD_REQUEST,
            responseMessage:
              ErrorConstants.ACTIVATION_PATIENT_USER_DATA_MISMATCH,
          };
        }
      }
    }

    const v1Response = await membershipVerificationHelper(
      database,
      phoneNumber,
      firstName,
      lastName,
      dateOfBirth,
      memberOrFamilyId
    );

    if (v1Response.isValidMembership) {
      return {
        isValidMembership: true,
        masterId: pbmMasterId,
        memberId: pbmMemberId,
        member: v1Response.member,
      };
    }
    return v1Response;
  } catch (error) {
    return {
      isValidMembership: false,
      responseCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      responseMessage: ErrorConstants.INTERNAL_SERVER_ERROR,
    };
  }
};

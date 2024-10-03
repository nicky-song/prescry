// Copyright 2022 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { IConfiguration } from '../configuration';
import { ErrorConstants } from '../constants/response-messages';
import { searchPersonByActivationPhoneNumber } from '../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../databases/mongo-database/v1/setup/setup-database';
import { EndpointVersion } from '../models/endpoint-version';
import { IDataToValidate, isLoginDataValid } from './login-helper';
import { verifyPatientsByPhoneNumberAndOrMemberId } from './patient/verify-patients-by-phone-number';

export type ActivationRecord = {
  isValid: boolean;
  activationPatientMasterId?: string;
  activationPatientMemberId?: string;
  activationRecord?: IPerson;
};
export const verifyActivationRecord = async (
  database: IDatabase,
  phoneNumber: string,
  firstName: string,
  dateOfBirth: string,
  primaryMemberRxId?: string,
  configuration?: IConfiguration,
  version: EndpointVersion = 'v1'
): Promise<ActivationRecord> => {
  const isV2Endpoint = version === 'v2';
  const activationRecordStatus: ActivationRecord = {
    isValid: true,
  };
  if (isV2Endpoint && configuration) {
    const verifyPatientsResponse =
      await verifyPatientsByPhoneNumberAndOrMemberId(
        configuration,
        false,
        firstName,
        dateOfBirth,
        primaryMemberRxId,
        phoneNumber
      );

    activationRecordStatus.activationPatientMasterId =
      verifyPatientsResponse.activationPatientMasterId;
    if (
      verifyPatientsResponse.isValid &&
      verifyPatientsResponse.activationPatientMemberId
    ) {
      activationRecordStatus.activationPatientMemberId =
        verifyPatientsResponse.activationPatientMemberId;
    }

    if (
      !verifyPatientsResponse.isValid &&
      verifyPatientsResponse.errorDetails ===
        ErrorConstants.ACTIVATION_PATIENT_USER_DATA_MISMATCH
    ) {
      activationRecordStatus.isValid = false;
    }
  }
  const activationPersonRecord = await searchPersonByActivationPhoneNumber(
    database,
    phoneNumber
  );
  if (activationPersonRecord) {
    const userData: IDataToValidate = {
      firstName,
      dateOfBirth,
    };
    const activationData: IDataToValidate = {
      firstName: activationPersonRecord.firstName,
      dateOfBirth: activationPersonRecord.dateOfBirth,
    };

    const matchMemberID = primaryMemberRxId
      ? [
          activationPersonRecord.primaryMemberFamilyId,
          activationPersonRecord.primaryMemberRxId,
        ].includes(primaryMemberRxId)
      : true;
    activationRecordStatus.isValid = false;
    activationRecordStatus.activationRecord = activationPersonRecord;

    if (isLoginDataValid(userData, activationData) && matchMemberID) {
      activationRecordStatus.isValid = true;
    }
  }
  return activationRecordStatus;
};

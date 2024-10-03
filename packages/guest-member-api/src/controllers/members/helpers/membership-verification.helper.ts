// Copyright 2020 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  LoginMessages as responseMessage,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IDataToValidate, isLoginDataValid } from '../../../utils/login-helper';
import {
  invalidMemberRxIdResponse,
  invalidMemberResponse,
  invalidMemberDetailsResponse,
} from '../../login/helpers/login-response.helper';
import {
  findPersonByPrimaryMemberRxId,
  findPersonByFamilyId,
} from '../../../utils/person/find-matching-person.helper';
import { searchPersonByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import DateFormatter from '@phx/common/src/utils/formatters/date.formatter';
import { trackActivationPersonFailureEvent } from '../../../utils/custom-event-helper';
import { verifyActivationRecord } from '../../../utils/verify-activation-record';
export interface IMembershipVerificationResponse {
  member?: IPerson;
  isValidMembership: boolean;
  responseCode?: number;
  responseMessage?: string;
  masterId?: string;
  beneficiaryReference?: string;
  memberId?: string;
}

export const membershipVerificationHelper = async (
  database: IDatabase,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  memberOrFamilyId: string
): Promise<IMembershipVerificationResponse> => {
  let modelFound: IPerson | null = await findPersonByPrimaryMemberRxId(
    database,
    memberOrFamilyId
  );
  if (!modelFound) {
    modelFound = await findPersonByFamilyId(
      database,
      firstName,
      dateOfBirth,
      memberOrFamilyId
    );
  }
  if (!modelFound) {
    return invalidMemberRxIdResponse(
      firstName,
      lastName,
      dateOfBirth,
      memberOrFamilyId
    );
  }
  if (!modelFound.identifier) {
    return invalidMemberResponse(memberOrFamilyId);
  }
  const comparator: IDataToValidate = {
    firstName: modelFound.firstName,
    dateOfBirth: modelFound.dateOfBirth,
  };
  const userData: IDataToValidate = {
    firstName,
    dateOfBirth,
  };
  if (!isLoginDataValid(userData, comparator)) {
    return invalidMemberDetailsResponse(
      firstName,
      lastName,
      dateOfBirth,
      memberOrFamilyId
    );
  }

  if (
    modelFound.activationPhoneNumber &&
    modelFound.activationPhoneNumber.length &&
    modelFound.activationPhoneNumber !== phoneNumber
  ) {
    return {
      isValidMembership: false,
      responseCode: HttpStatusCodes.NOT_FOUND,
      responseMessage:
        ErrorConstants.ACCOUNT_CREATION_ACTIVATION_PERSON_RECORD_DATA_MISMATCH,
    };
  }
  const activationRecordStatus = await verifyActivationRecord(
    database,
    phoneNumber,
    firstName,
    dateOfBirth,
    memberOrFamilyId
  );

  if (!activationRecordStatus.isValid) {
    trackActivationPersonFailureEvent(
      'MEMBER_VERIFICATION_FAILURE',
      activationRecordStatus.activationRecord?.firstName ?? '',
      activationRecordStatus.activationRecord?.dateOfBirth ?? '',
      phoneNumber,
      firstName,
      dateOfBirth,
      memberOrFamilyId
    );
    return {
      isValidMembership: false,
      responseCode: HttpStatusCodes.NOT_FOUND,
      responseMessage:
        ErrorConstants.ACCOUNT_CREATION_ACTIVATION_PERSON_RECORD_DATA_MISMATCH,
    };
  }
  if (!modelFound.phoneNumber) {
    const personList = await searchPersonByPhoneNumber(database, phoneNumber);
    if (personList && personList.length > 0) {
      const siePersonIndex = personList.findIndex(
        (p) => p.rxGroupType === 'SIE'
      );
      if (siePersonIndex >= 0) {
        return {
          isValidMembership: false,
          responseCode: HttpStatusCodes.BAD_REQUEST,
          responseMessage: responseMessage.PHONE_NUMBER_INVALID,
        };
      }
    }
  }

  if (modelFound.phoneNumber && modelFound.phoneNumber !== phoneNumber) {
    return {
      isValidMembership: false,
      responseCode: HttpStatusCodes.UNAUTHORIZED_REQUEST,
      responseMessage: responseMessage.PHONE_NUMBER_EXISTS,
    };
  }

  const account = await searchAccountByPhoneNumber(database, phoneNumber);
  if (account && account.firstName && account.dateOfBirth) {
    const accountData: IDataToValidate = {
      firstName: account.firstName,
      dateOfBirth: DateFormatter.formatToYMD(account.dateOfBirth),
    };
    if (!isLoginDataValid(accountData, comparator)) {
      return {
        isValidMembership: false,
        responseCode: HttpStatusCodes.NOT_FOUND,
        responseMessage: ErrorConstants.ACCOUNT_PERSON_DATA_MISMATCH,
      };
    }
  }
  return {
    isValidMembership: true,
    member: modelFound,
  };
};

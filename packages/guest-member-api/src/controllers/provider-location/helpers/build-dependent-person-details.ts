// Copyright 2020 Prescryptive Health, Inc.

import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { IPerson } from '@phx/common/src/models/person';
import { publishPersonCreateMessage } from '../../../utils/service-bus/person-update-helper';
import moment from 'moment';
import { IDependentInformation } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { getNextAvailablePersonCode } from '../../../utils/person/get-dependent-person.helper';
import {
  addPersonCreationKeyInRedis,
  getPersonCreationDataFromRedis,
} from '../../../databases/redis/redis-query-helper';
import { ApiConstants } from '../../../constants/api-constants';
import { ErrorConstants } from '../../../constants/response-messages';
import { assertHasPersonCode } from '../../../assertions/assert-has-person-code';
import { formatDependentNumber } from '../../../utils/fhir-patient/patient.helper';
import { assertHasFamilyId } from '../../../assertions/assert-has-family-id';

export async function buildDependentPersonDetails(
  dependentInfo: IDependentInformation,
  database: IDatabase,
  parentInfo: IPerson,
  redisExpiryTime: number,
  existingDependent?: IPerson,
  masterId?: string,
  accountId?: string,
  personCodeNum?: number
): Promise<IPerson> {
  if (existingDependent) {
    return existingDependent;
  }

  const dateNow = new Date();
  const primaryMemberFamilyId = parentInfo.primaryMemberFamilyId;

  let nextAvailablepersonCodeNum = personCodeNum;
  let personCode;

  if (!nextAvailablepersonCodeNum) {
    personCode = await getNextAvailablePersonCode(
      database,
      primaryMemberFamilyId || ''
    );
    nextAvailablepersonCodeNum = parseInt(personCode, 10);
  }

  personCode = formatDependentNumber(nextAvailablepersonCodeNum);

  if (nextAvailablepersonCodeNum > 999) {
    throw new Error(ErrorConstants.MAX_DEPENDENT_LIMIT_REACHED);
  }

  assertHasFamilyId(primaryMemberFamilyId);
  assertHasPersonCode(personCode);

  const dependentPerson: IPerson = {
    firstName: (dependentInfo.firstName?.trim() ?? '').toUpperCase(),
    lastName: (dependentInfo.lastName?.trim() ?? '').toUpperCase(),
    dateOfBirth: dependentInfo.dateOfBirth
      ? UTCDateString(dependentInfo.dateOfBirth)
      : '',
    effectiveDate: moment(dateNow.toUTCString()).format('YYYYMMDD'),
    identifier: '',
    rxSubGroup: ApiConstants.CASH_USER_RX_SUB_GROUP,
    rxGroup: ApiConstants.CASH_USER_RX_GROUP,
    primaryMemberFamilyId,
    primaryMemberRxId: primaryMemberFamilyId + personCode,
    rxGroupType: ApiConstants.CASH_USER_RX_GROUP_TYPE,
    rxBin: ApiConstants.CASH_USER_RX_BIN,
    carrierPCN: ApiConstants.CASH_USER_CARRIER_PCN,
    isPhoneNumberVerified: false,
    phoneNumber: '',
    isPrimary: false,
    email: '',
    primaryMemberPersonCode: personCode,
    address1: dependentInfo.addressSameAsParent
      ? (parentInfo.address1?.trim() || '').toUpperCase()
      : dependentInfo.address?.address1.trim().toUpperCase(),
    address2: dependentInfo.addressSameAsParent
      ? (parentInfo.address2?.trim() || '').toUpperCase()
      : (dependentInfo.address?.address2?.trim() || '').toUpperCase(),
    county: dependentInfo.addressSameAsParent
      ? (parentInfo.county?.trim() || '').toUpperCase()
      : (dependentInfo.address?.county?.trim() || '').toUpperCase(),
    city: dependentInfo.addressSameAsParent
      ? (parentInfo.city?.trim() || '').toUpperCase()
      : dependentInfo.address?.city?.trim().toUpperCase(),
    state: dependentInfo.addressSameAsParent
      ? (parentInfo.state || '').toUpperCase()
      : dependentInfo.address?.state?.trim().toUpperCase(),
    zip: dependentInfo.addressSameAsParent
      ? parentInfo.zip
      : dependentInfo.address?.zip,
    isTestMembership: false,
    masterId,
    accountId,
  };

  await publishPersonCreateMessage(dependentPerson);
  const existingCreatePersonInRedis: IPerson[] | undefined =
    await getPersonCreationDataFromRedis(parentInfo.phoneNumber);
  if (existingCreatePersonInRedis) {
    existingCreatePersonInRedis.push(dependentPerson);
    await addPersonCreationKeyInRedis(
      parentInfo.phoneNumber,
      existingCreatePersonInRedis,
      redisExpiryTime
    );
  } else {
    await addPersonCreationKeyInRedis(
      parentInfo.phoneNumber,
      [dependentPerson],
      redisExpiryTime
    );
  }
  return dependentPerson;
}

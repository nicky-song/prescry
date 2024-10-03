// Copyright 2021 Prescryptive Health, Inc.

import moment from 'moment';
import { IPerson } from '@phx/common/src/models/person';
import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { IConfiguration } from '../../configuration';
import { ApiConstants } from '../../constants/api-constants';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { getNext } from '../../utils/redis/redis-order-number.helper';

export const createPersonHelper = (
  primaryMemberFamilyId: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  phoneNumber: string,
  recoveryEmail?: string,
  memberAddress?: IMemberAddress,
  masterId?: string,
  patientAccountId?: string
): IPerson => {
  const dateNow = new Date();

  const person: IPerson = {
    firstName: (firstName?.trim() ?? '').toUpperCase(),
    lastName: (lastName?.trim() ?? '').toUpperCase(),
    dateOfBirth: dateOfBirth ? UTCDateString(dateOfBirth) : '',
    effectiveDate: moment(dateNow.toUTCString()).format('YYYYMMDD'),
    identifier: '',
    rxSubGroup: ApiConstants.CASH_USER_RX_SUB_GROUP,
    rxGroup: ApiConstants.CASH_USER_RX_GROUP,
    primaryMemberFamilyId,
    primaryMemberRxId:
      primaryMemberFamilyId + ApiConstants.PRIMARY_MEMBER_PERSON_CODE,
    rxGroupType: ApiConstants.CASH_USER_RX_GROUP_TYPE,
    rxBin: ApiConstants.CASH_USER_RX_BIN,
    carrierPCN: ApiConstants.CASH_USER_CARRIER_PCN,
    isPhoneNumberVerified: true,
    phoneNumber,
    isPrimary: true,
    email: recoveryEmail ?? '',
    primaryMemberPersonCode: ApiConstants.PRIMARY_MEMBER_PERSON_CODE,
    address1: memberAddress?.address1
      ? (memberAddress?.address1?.trim() ?? '').toUpperCase()
      : undefined,
    address2: memberAddress?.address2
      ? (memberAddress?.address2?.trim() ?? '').toUpperCase()
      : undefined,
    county: memberAddress?.county
      ? (memberAddress?.county?.trim() ?? '').toUpperCase()
      : undefined,
    city: memberAddress?.city
      ? (memberAddress?.city?.trim() ?? '').toUpperCase()
      : undefined,
    state: memberAddress?.state
      ? (memberAddress?.state?.trim() ?? '').toUpperCase()
      : undefined,
    zip: memberAddress?.zip
      ? (memberAddress?.zip?.trim() ?? '').toUpperCase()
      : undefined,
    isTestMembership: false,
    masterId,
    accountId: patientAccountId,
  };
  return person;
};

export const generatePrimaryMemberFamilyId = async (
  database: IDatabase,
  configuration: IConfiguration
): Promise<string> => {
  const memberNumber = await getNext(
    database,
    configuration.orderNumberBlockLength
  );

  return `CA${parseInt(memberNumber, 10).toString(35).toUpperCase()}`;
};

// Copyright 2020 Prescryptive Health, Inc.

import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { IPerson } from '@phx/common/src/models/person';
import moment from 'moment';
import { ISmartPriceRegistration } from '../handlers/register-smart-price.handler';
import { RxGroupTypes } from '@phx/common/src/models/member-profile/member-profile-info';
import {
  KnownPersonCode,
  KnownRxGroup,
  KnownRxBin,
  KnownPlanId,
  KnownProcessorControllerNumber,
} from '../../../configuration';

export function buildSmartPriceRegistration(
  payload: ISmartPriceRegistration,
  memberNumber: string,
  personCode: KnownPersonCode = '01',
  rxGroup: KnownRxGroup = '200P32F',
  rxGroupType: RxGroupTypes = 'CASH',
  rxBin: KnownRxBin = '610749',
  rxSubGroup: KnownPlanId = 'SMARTPRICE',
  carrierPCN: KnownProcessorControllerNumber = 'X01'
): IPerson {
  const dateNow = new Date();
  const memberCode = parseInt(memberNumber, 10).toString(35).toUpperCase();
  const primaryMemberFamilyId = `SM${memberCode}`;

  const person: IPerson = {
    identifier: '',
    firstName: payload.firstName.trim().toUpperCase(),
    lastName: payload.lastName.trim().toUpperCase(),
    dateOfBirth: payload.dateOfBirth ? UTCDateString(payload.dateOfBirth) : '',
    effectiveDate: moment(dateNow.toUTCString()).format('YYYYMMDD'),
    rxSubGroup,
    rxGroup,
    primaryMemberFamilyId,
    primaryMemberRxId: primaryMemberFamilyId + personCode,
    rxGroupType,
    rxBin,
    carrierPCN,
    isPhoneNumberVerified: true,
    phoneNumber: payload.phoneNumber,
    isPrimary: true,
    email: payload.email.toLowerCase(),
    primaryMemberPersonCode: personCode,
    address1: '',
    address2: undefined,
    county: '',
    city: '',
    state: '',
    zip: '',
    isTestMembership: false,
    source: payload.source,
  };
  return person;
}

// Copyright 2021 Prescryptive Health, Inc.

import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { IPerson } from '@phx/common/src/models/person';
import { buildSmartPriceRegistration } from './build-smart-price-registration';
import moment from 'moment';
import { ISmartPriceRegistration } from '../handlers/register-smart-price.handler';
import {
  KnownPersonCode,
  KnownPlanId,
  KnownProcessorControllerNumber,
  KnownRxBin,
  KnownRxGroup,
} from '../../../configuration';
import { RxGroupTypes } from '@phx/common/src/models/member-profile/member-profile-info';

jest.mock('@phx/common/src/utils/date-time-helper');
const utcDateStringMock = UTCDateString as jest.Mock;

jest.mock('../../../utils/service-bus/person-update-helper');
describe('buildSmartPriceRegistration', () => {
  beforeEach(() => {
    utcDateStringMock.mockReset();
    utcDateStringMock.mockReturnValue('2000-02-02');
  });

  it('creates expected person object and publish it to person topic if person info does not have person', () => {
    const payload = {
      verifyCode: '1234',
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '2000-02-02',
      phoneNumber: '+1111111111',
      email: 'user@test.com',
      source: '',
    } as ISmartPriceRegistration;
    const memberNumber = '11111111';
    const personCode: KnownPersonCode = '01';
    const rxGroup: KnownRxGroup = '200P32F';
    const rxGroupType: RxGroupTypes = 'CASH';
    const rxBin: KnownRxBin = '610749';
    const rxSubGroup: KnownPlanId = 'SMARTPRICE';
    const carrierPCN: KnownProcessorControllerNumber = 'X01';
    const dateNow = new Date();
    const memberCode = parseInt(memberNumber, 10).toString(35).toUpperCase();
    const primaryMemberFamilyId = `SM${memberCode}`;
    const person: IPerson = {
      identifier: '',
      firstName: 'FIRST',
      lastName: 'LAST',
      dateOfBirth: UTCDateString('2000-02-02'),
      effectiveDate: moment(dateNow.toUTCString()).format('YYYYMMDD'),
      rxSubGroup,
      rxGroup,
      primaryMemberFamilyId,
      primaryMemberRxId: primaryMemberFamilyId + personCode,
      rxGroupType,
      rxBin,
      carrierPCN,
      isPhoneNumberVerified: true,
      phoneNumber: '+1111111111',
      isPrimary: true,
      email: 'user@test.com',
      primaryMemberPersonCode: personCode,
      address1: '',
      address2: undefined,
      county: '',
      city: '',
      state: '',
      zip: '',
      isTestMembership: false,
      source: '',
    };

    const response = buildSmartPriceRegistration(payload, memberNumber);
    expect(response).toEqual(person);
  });
});

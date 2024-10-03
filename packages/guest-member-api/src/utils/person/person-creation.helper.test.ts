// Copyright 2021 Prescryptive Health, Inc.

import moment from 'moment';
import { IPerson } from '@phx/common/src/models/person';
import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { ApiConstants } from '../../constants/api-constants';
import { getNext } from '../redis/redis-order-number.helper';
import {
  createPersonHelper,
  generatePrimaryMemberFamilyId,
} from './person-creation.helper';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { databaseMock } from '../../mock-data/database.mock';
import { configurationMock } from '../../mock-data/configuration.mock';

jest.mock('../redis/redis-order-number.helper');
const getNextMock = getNext as jest.Mock;

jest.mock('@phx/common/src/utils/date-time-helper');
const UTCDateStringMock = UTCDateString as jest.Mock;

describe('personCreationHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPersonHelper', () => {
    it('creates person with valid fields and address info', () => {
      const firstNameMock = 'Test';
      const lastNameMock = 'Testing';
      const dateOfBirthMock = '01/01/1999';
      const phoneNumberMock = '+12223334444';
      const recoveryEmailMock = 'test@test.com';
      UTCDateStringMock.mockReturnValue('1999-01-01');
      const memberAddress: IMemberAddress = {
        address1: 'address1',
        address2: 'address2',
        county: 'county',
        city: 'city',
        state: 'state',
        zip: 'zip',
      };

      const familyIdMock = 'family-id';
      const masterIdMock = 'master-id';
      const patientAccountIdMock = 'patient-account-id';

      const person = createPersonHelper(
        familyIdMock,
        firstNameMock,
        lastNameMock,
        dateOfBirthMock,
        phoneNumberMock,
        recoveryEmailMock,
        memberAddress,
        masterIdMock,
        patientAccountIdMock
      );
      expectToHaveBeenCalledOnceOnlyWith(UTCDateStringMock, dateOfBirthMock);

      const expectedPerson: IPerson = {
        firstName: 'TEST',
        lastName: 'TESTING',
        dateOfBirth: '1999-01-01',
        effectiveDate: moment(new Date().toUTCString()).format('YYYYMMDD'),
        identifier: '',
        rxSubGroup: ApiConstants.CASH_USER_RX_SUB_GROUP,
        rxGroup: ApiConstants.CASH_USER_RX_GROUP,
        primaryMemberFamilyId: familyIdMock,
        primaryMemberRxId:
          familyIdMock + ApiConstants.PRIMARY_MEMBER_PERSON_CODE,
        rxGroupType: ApiConstants.CASH_USER_RX_GROUP_TYPE,
        rxBin: ApiConstants.CASH_USER_RX_BIN,
        carrierPCN: ApiConstants.CASH_USER_CARRIER_PCN,
        isPhoneNumberVerified: true,
        phoneNumber: '+12223334444',
        isPrimary: true,
        email: 'test@test.com',
        primaryMemberPersonCode: ApiConstants.PRIMARY_MEMBER_PERSON_CODE,
        isTestMembership: false,
        address1: 'ADDRESS1',
        address2: 'ADDRESS2',
        county: 'COUNTY',
        city: 'CITY',
        state: 'STATE',
        zip: 'ZIP',
        masterId: masterIdMock,
        accountId: patientAccountIdMock,
      };
      expect(person).toEqual(expectedPerson);
    });
  });

  describe('generatePrimaryMemberFamilyId', () => {
    it.each([
      ['1', 'CA1'],
      ['10', 'CAA'],
      ['16', 'CAG'],
      ['34', 'CAY'],
      ['35', 'CA10'],
    ])(
      'generates id for next id %p',
      async (nextIdMock: string, expectedId: string) => {
        getNextMock.mockResolvedValue(nextIdMock);

        const actualId = await generatePrimaryMemberFamilyId(
          databaseMock,
          configurationMock
        );

        expect(actualId).toEqual(expectedId);
        expectToHaveBeenCalledOnceOnlyWith(
          getNextMock,
          databaseMock,
          configurationMock.orderNumberBlockLength
        );
      }
    );
  });
});

// Copyright 2020 Prescryptive Health, Inc.

import { Request } from 'express';
import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { IPerson } from '@phx/common/src/models/person';
import { publishPersonUpdateAddressMessage } from '../../../utils/service-bus/person-update-helper';

import { updatePersonDetailsIfNecessary } from './update-person-details-if-necessary';

jest.mock('@phx/common/src/utils/date-time-helper');
const utcDateStringMock = UTCDateString as jest.Mock;

jest.mock('../../../utils/service-bus/person-update-helper');
const publishPersonUpdateAddressMessageMock =
  publishPersonUpdateAddressMessage as jest.Mock;

describe('updatePersonDetailsIfNecessary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    utcDateStringMock.mockReturnValue('2000-02-02');
  });

  it('updates person object and publish it to person topic for when if personinfo is present but missing address information', async () => {
    const cashPersonInfoInvalidAddress = {
      address1: ' ',
      county: ' s',
      city: 'city',
      state: 'state',
      zip: 'zip',
      rxGroupType: 'CASH',
      identifier: 'id-1',
    } as IPerson;
    const request = {
      body: {
        memberAddress: {
          address1: 'personaddr1',
          address2: 'personaddr2',
          county: 'fakecounty',
          state: 'wa',
          zip: '11111',
          city: 'fakecity',
        },
      },
    } as Request;
    const expected = {
      address1: 'PERSONADDR1',
      address2: 'PERSONADDR2',
      county: 'FAKECOUNTY',
      city: 'FAKECITY',
      state: 'WA',
      zip: '11111',
      rxGroupType: 'CASH',
      identifier: 'id-1',
    } as IPerson;
    const actual = await updatePersonDetailsIfNecessary(
      request,
      cashPersonInfoInvalidAddress
    );
    expect(actual).toEqual(expected);
    expect(publishPersonUpdateAddressMessageMock).toBeCalledWith(
      'id-1',
      'PERSONADDR1',
      'PERSONADDR2',
      'FAKECITY',
      'WA',
      '11111',
      'FAKECOUNTY'
    );
  });

  it('Trims name and address fields before publishing to the topic', async () => {
    const cashPersonInfoInvalidAddress = {
      address1: ' ',
      county: 'c',
      city: 'city',
      state: 'state',
      zip: 'zip',
      rxGroupType: 'CASH',
      identifier: 'id-1',
    } as IPerson;
    const request = {
      body: {
        memberAddress: {
          address1: 'persona  ddr1   ',
          address2: '  personaddr2   ',
          county: '  fakecounty',
          state: 'wa',
          zip: '11111',
          city: 'fakecity',
        },
      },
    } as Request;
    const expected = {
      address1: 'PERSONA  DDR1',
      address2: 'PERSONADDR2',
      county: 'FAKECOUNTY',
      city: 'FAKECITY',
      state: 'WA',
      zip: '11111',
      rxGroupType: 'CASH',
      identifier: 'id-1',
    } as IPerson;
    const actual = await updatePersonDetailsIfNecessary(
      request,
      cashPersonInfoInvalidAddress
    );
    expect(actual).toEqual(expected);
    expect(publishPersonUpdateAddressMessageMock).toBeCalledWith(
      'id-1',
      'PERSONA  DDR1',
      'PERSONADDR2',
      'FAKECITY',
      'WA',
      '11111',
      'FAKECOUNTY'
    );
  });
});

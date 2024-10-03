// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { getLoggedInUserPatientForRxGroupType } from '../../../utils/person/get-dependent-person.helper';
import { buildPatientDetails } from './build-patient-details';
import { IPatient } from '../../../models/fhir/patient/patient';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { updatePatientByMasterId } from '../../../utils/external-api/identity/update-patient-by-master-id';

jest.mock('@phx/common/src/utils/date-time-helper');
const utcDateStringMock = UTCDateString as jest.Mock;

jest.mock('../../../utils/external-api/identity/update-patient-by-master-id');
const updatePatientByMasterIdMock = updatePatientByMasterId as jest.Mock;

jest.mock('../../../utils/person/get-dependent-person.helper');
const getLoggedInUserPatientForRxGroupTypeMock =
  getLoggedInUserPatientForRxGroupType as jest.Mock;

describe('buildPatientDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    utcDateStringMock.mockReturnValue('2000-02-02');
  });

  it('updates patient object and publishes changes if patientInfo is present but missing address information', async () => {
    const cashPatientInfoInvalidAddress = {
      address: [
        {
          line: [' '],
          city: 'city',
          state: 'state',
          postalCode: 'zip',
          use: 'home',
          type: 'physical',
        },
      ],
      id: 'test',
    } as IPatient;
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
    const response = {} as Response;
    getLoggedInUserPatientForRxGroupTypeMock.mockReturnValueOnce(
      cashPatientInfoInvalidAddress
    );
    const expected = {
      address: [
        {
          line: ['PERSONADDR1', 'PERSONADDR2'],
          city: 'FAKECITY',
          state: 'WA',
          postalCode: '11111',
          use: 'home',
          type: 'physical',
        },
      ],
      id: 'test',
    } as IPatient;
    const actual = await buildPatientDetails(
      request,
      response,
      configurationMock
    );
    expect(actual).toEqual(expected);
    expect(getLoggedInUserPatientForRxGroupTypeMock).toHaveBeenLastCalledWith(
      response,
      'CASH'
    );
    expect(updatePatientByMasterIdMock).toBeCalledWith(
      expected.id,
      expected,
      configurationMock
    );
  });

  it('Trims name and address fields before publishing to the topic', async () => {
    const cashPatientInfoInvalidAddress = {
      address: [
        {
          line: [' '],
          city: 'city',
          state: 'state',
          postalCode: 'zip',
          use: 'home',
          type: 'physical',
        },
      ],
      id: 'test',
    } as IPatient;
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
    const response = {} as Response;
    getLoggedInUserPatientForRxGroupTypeMock.mockReturnValueOnce(
      cashPatientInfoInvalidAddress
    );
    const expected = {
      address: [
        {
          line: ['PERSONA  DDR1', 'PERSONADDR2'],
          city: 'FAKECITY',
          state: 'WA',
          postalCode: '11111',
          use: 'home',
          type: 'physical',
        },
      ],
      id: 'test',
    } as IPatient;
    const actual = await buildPatientDetails(
      request,
      response,
      configurationMock
    );
    expect(actual).toEqual(expected);
    expect(getLoggedInUserPatientForRxGroupTypeMock).toHaveBeenLastCalledWith(
      response,
      'CASH'
    );
    expect(updatePatientByMasterIdMock).toBeCalledWith(
      expected.id,
      expected,
      configurationMock
    );
  });
});

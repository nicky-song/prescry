// Copyright 2020 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { getAppointmentEventByOrderNumber } from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { searchPersonByPrimaryMemberRxId } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IAppointmentEvent } from '../../../models/appointment-event';
import {
  IImmunizationRecordEvent,
  IProtocolApplied,
  IVaccineCode,
} from '../../../models/immunization-record';

import { buildPastProcedureFromImmunizationRecord } from './build-past-procedure-from-immunization-record';

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper'
);
jest.mock(
  '../../../databases/mongo-database/v1/query-helper/person-collection-helper'
);

const getAppointmentEventByOrderNumberMock =
  getAppointmentEventByOrderNumber as jest.Mock;
const searchPersonByPrimaryMemberRxIdMock =
  searchPersonByPrimaryMemberRxId as jest.Mock;

const databaseMock = {} as IDatabase;
const patientImmunizationRecordEventMock: IImmunizationRecordEvent = {
  identifiers: [
    {
      type: 'memberRxId',
      value: '2020052501',
    },
  ],
  createdOn: 1594235032,
  createdBy: 'patientTestResultProcessor',
  tags: [],
  eventType: 'observation',
  eventData: {
    orderNumber: '1234',
    immunizationId: '12345',
    manufacturer: 'Test',
    lotNumber: '1',
    protocolApplied: {} as unknown as IProtocolApplied,
    memberRxId: '2020052501',
    vaccineCodes: [] as IVaccineCode[],
  },
};

const personInfo = {
  firstName: 'First',
  lastName: 'Last',
  dateOfBirth: '01/01/2000',
} as unknown as IPerson;

beforeEach(() => {
  jest.clearAllMocks();
});
describe('buildPatientImmmunizationRecord', () => {
  it('returns patient immunization record with appointment data if there is appointment in database', async () => {
    const appointment = {
      eventType: 'appointment/confirmation',
      eventData: {
        appointment: {
          start: new Date('2020-06-23T13:00:00+0000'),
          serviceDescription: 'COVID-19 Immunization',
        },
        orderNumber: '1234',
        primaryMemberRxId: '2020052501',
        serviceType: 'c19-vaccine-dose-1',
      },
    } as unknown as IAppointmentEvent;

    searchPersonByPrimaryMemberRxIdMock.mockReturnValueOnce(personInfo);
    getAppointmentEventByOrderNumberMock.mockReturnValueOnce(appointment);
    const expectedPastProcedure = {
      orderNumber: '1234',
      memberFirstName: 'First',
      memberLastName: 'Last',
      date: 'June 23, 2020',
      time: '1:00 PM',
      serviceDescription: 'COVID-19 Immunization',
      serviceType: 'c19-vaccine-dose-1',
      procedureType: 'immunization',
    };
    const pastProcedure = await buildPastProcedureFromImmunizationRecord(
      patientImmunizationRecordEventMock,
      databaseMock
    );
    expect(pastProcedure).toEqual(expectedPastProcedure);
    expect(getAppointmentEventByOrderNumberMock).toBeCalledTimes(1);
    expect(getAppointmentEventByOrderNumberMock).toHaveBeenCalledWith(
      '2020052501',
      '1234',
      databaseMock
    );
  });
  it('returns undefined if there is no appointment in database', async () => {
    searchPersonByPrimaryMemberRxIdMock.mockReturnValueOnce(personInfo);
    getAppointmentEventByOrderNumberMock.mockReturnValueOnce(null);
    const pastProcedure = await buildPastProcedureFromImmunizationRecord(
      patientImmunizationRecordEventMock,
      databaseMock
    );
    expect(pastProcedure).toEqual(undefined);
    expect(getAppointmentEventByOrderNumberMock).toBeCalledTimes(1);
    expect(getAppointmentEventByOrderNumberMock).toHaveBeenCalledWith(
      '2020052501',
      '1234',
      databaseMock
    );
  });
});

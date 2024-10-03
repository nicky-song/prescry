// Copyright 2020 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { IPatientTestResultEvent } from '../../../databases/mongo-database/v1/definitions/patient-test-result-event.definition';
import { getAppointmentEventByOrderNumber } from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { searchPersonByPrimaryMemberRxId } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IAppointmentEvent } from '../../../models/appointment-event';
import { buildPastProcedureFromTestResults } from './build-past-procedure-from-test-results';

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
const patientTestResultEventMock: IPatientTestResultEvent = {
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
    icd10: ['U07.D'],
    primaryMemberRxId: '2020052501',
    productOrService: '00000190000',
    fillDate: new Date('2020-05-15'),
    provider: '1881701167',
    orderNumber: '1234',
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
describe('buildPatientTestResult', () => {
  it('returns patient test result with appointment data if there is appointment in database', async () => {
    const appointment = {
      eventType: 'appointment/confirmation',
      eventData: {
        appointment: {
          start: new Date('2020-06-23T13:00:00+0000'),
          serviceDescription: 'COVID-19 Rapid Antigen Test',
        },
        orderNumber: '1234',
        primaryMemberRxId: '2020052501',
        serviceType: 'abbott_antigen',
      },
    } as unknown as IAppointmentEvent;
    searchPersonByPrimaryMemberRxIdMock.mockReturnValueOnce(personInfo);
    getAppointmentEventByOrderNumberMock.mockReturnValueOnce(appointment);
    const expectedTestResult = {
      orderNumber: '1234',
      memberFirstName: 'First',
      memberLastName: 'Last',
      date: 'June 23, 2020',
      time: '1:00 PM',
      serviceDescription: 'COVID-19 Rapid Antigen Test',
      serviceType: 'abbott_antigen',
      procedureType: 'observation',
    };
    const testResult = await buildPastProcedureFromTestResults(
      patientTestResultEventMock,
      databaseMock
    );
    expect(testResult).toEqual(expectedTestResult);
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
    const testResult = await buildPastProcedureFromTestResults(
      patientTestResultEventMock,
      databaseMock
    );
    expect(testResult).toEqual(undefined);
    expect(getAppointmentEventByOrderNumberMock).toBeCalledTimes(1);
    expect(getAppointmentEventByOrderNumberMock).toHaveBeenCalledWith(
      '2020052501',
      '1234',
      databaseMock
    );
  });
});

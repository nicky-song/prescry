// Copyright 2020 Prescryptive Health, Inc.

import { IPastProcedure } from '@phx/common/src/models/api-response/past-procedure-response';
import { sortPastProceduresByAppointmentDate } from './sort-past-procedure-by-appointment-date';

describe('sortPastProceduresByAppointmentDate', () => {
  it('returns sorting by the appointment date', () => {
    const testResults: IPastProcedure[] = [
      {
        memberFirstName: 'FirstName',
        memberLastName: 'LastName',
        orderNumber: '1234',
        date: 'October 31, 2020',
        serviceDescription: 'test-service',
        serviceType: 'test-type',
        procedureType: 'observation',
      },
      {
        memberFirstName: 'FirstName',
        memberLastName: 'LastName',
        orderNumber: '1235',
        date: 'October 30, 2020',
        serviceDescription: 'test-service',
        serviceType: 'test-type',
        procedureType: 'observation',
      },
      {
        memberFirstName: 'FirstName',
        memberLastName: 'LastName',
        orderNumber: '1236',
        date: 'December 11, 2020',
        serviceDescription: 'test-service',
        serviceType: 'test-type',
        procedureType: 'observation',
      },
    ];
    expect(sortPastProceduresByAppointmentDate(testResults)).toEqual([
      {
        memberFirstName: 'FirstName',
        memberLastName: 'LastName',
        orderNumber: '1236',
        date: 'December 11, 2020',
        serviceDescription: 'test-service',
        serviceType: 'test-type',
        procedureType: 'observation',
      },
      {
        memberFirstName: 'FirstName',
        memberLastName: 'LastName',
        orderNumber: '1234',
        date: 'October 31, 2020',
        serviceDescription: 'test-service',
        serviceType: 'test-type',
        procedureType: 'observation',
      },
      {
        memberFirstName: 'FirstName',
        memberLastName: 'LastName',
        orderNumber: '1235',
        date: 'October 30, 2020',
        serviceDescription: 'test-service',
        serviceType: 'test-type',
        procedureType: 'observation',
      },
    ]);
  });
});

// Copyright 2021 Prescryptive Health, Inc.

import { IPastProcedure } from '../../../models/api-response/past-procedure-response';

export const pastProceduresListMock: IPastProcedure[] = [
  {
    orderNumber: '0000',
    time: '1:00 AM',
    date: 'December 31, 1999',
    serviceDescription: 'COVID-19 Abbott Antigen Testing',
    memberFirstName: 'TEST',
    memberLastName: 'TESTER',
    procedureType: 'observation',
  },
  {
    orderNumber: '0001',
    time: '2:00 PM',
    date: 'January 1, 2000',
    serviceDescription: 'COVID-19 Abbott Antigen Medicaid Testing',
    memberFirstName: 'TEST1',
    memberLastName: 'TESTER1',
    procedureType: 'observation',
  },
  {
    orderNumber: '0002',
    time: '3:30 PM',
    date: 'June 4, 2039',
    serviceDescription: 'COVID-19 Vaccine Record',
    memberFirstName: 'TEST2',
    memberLastName: 'TESTER2',
    procedureType: 'observation',
  },
];

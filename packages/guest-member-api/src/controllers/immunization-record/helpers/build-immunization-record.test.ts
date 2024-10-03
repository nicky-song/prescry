// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';

import { buildImmunizationRecord } from './build-immunization-record';
import { IProviderLocation } from '@phx/common/src/models/provider-location';
import { getAppointmentEventByOrderNumber } from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { IAppointmentEvent } from '../../../models/appointment-event';
import {
  IImmunizationRecordEvent,
  IProtocolApplied,
  IVaccineCode,
} from '../../../models/immunization-record';
import { searchPersonByPrimaryMemberRxId } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IPerson } from '@phx/common/src/models/person';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { getProviderLocationByIdAndServiceType } from '../../provider-location/helpers/get-provider-location-by-id-and-service-type.helper';

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper'
);

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/person-collection-helper'
);
jest.mock(
  '../../provider-location/helpers/get-provider-location-by-id-and-service-type.helper'
);

const getProviderLocationByIdAndServiceTypeMock =
  getProviderLocationByIdAndServiceType as jest.Mock;
const getAppointmentEventByOrderNumberMock =
  getAppointmentEventByOrderNumber as jest.Mock;
const searchPersonByPrimaryMemberRxIdMock =
  searchPersonByPrimaryMemberRxId as jest.Mock;
const databaseMock = {} as IDatabase;

const personInfo = {
  firstName: 'first-name',
  lastName: 'last-name',
  dateOfBirth: '01/01/2000',
} as unknown as IPerson;

const mockLocation = {
  address1: 'mock-addr1',
  address2: 'mock-addr2',
  city: 'fake-city',
  zip: 'fake-zip',
  state: 'fake-state',
  providerInfo: {
    providerName: 'Rx Pharmacy',
  },
} as unknown as IProviderLocation;

const mockAppointment = {
  eventType: 'appointment/confirmation',
  eventData: {
    appointment: {
      serviceName: 'COVID-19 Vaccination',
      start: new Date('2021-02-23T09:40:00+0000'),
      locationId: 'loc-1',
      serviceDescription: 'COVID-19 Vaccination',
    },
    serviceType: 'service-type',
    orderNumber: '12345',
  },
} as IAppointmentEvent;

const immunizationRecordEventMock = {
  eventType: 'immunization',
  eventData: {
    orderNumber: '1234',
    manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
    lotNumber: '12221',
    vaccineCodes: [
      {
        code: '91300',
      } as IVaccineCode,
    ],
    protocolApplied: {
      series: '1-dose',
      doseNumber: 1,
      seriesDoses: 2,
    } as IProtocolApplied,
    memberRxId: 'member-id1',
  },
} as unknown as IImmunizationRecordEvent;

describe('buildImmunizationRecord', () => {
  beforeEach(() => {
    getProviderLocationByIdAndServiceTypeMock.mockReset();
    getAppointmentEventByOrderNumberMock.mockReset();
    searchPersonByPrimaryMemberRxIdMock.mockReset();
  });

  it('returns complete immunization record details if there is both appointment and person info exists in the database', async () => {
    getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce({
      location: mockLocation,
      service: {
        claimOptions: [
          {
            cptCode: { code: '91300' },
            factSheetLinks: [
              '(This is a test link)[https://www.fda.gov/media/144414/download]',
            ],
          },
        ],
        serviceDescription: 'COVID-19 Vaccination',
      },
    });
    getAppointmentEventByOrderNumberMock.mockReturnValueOnce(mockAppointment);
    searchPersonByPrimaryMemberRxIdMock.mockReturnValueOnce(personInfo);

    const result = await buildImmunizationRecord(
      immunizationRecordEventMock,
      databaseMock,
      configurationMock
    );
    const immunizationRecordMock = {
      orderNumber: '1234',
      manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
      lotNumber: '12221',
      doseNumber: 1,
      memberId: 'member-id1',
      vaccineCode: '91300',
      locationName: 'Rx Pharmacy',
      address1: 'mock-addr1',
      address2: 'mock-addr2',
      city: 'fake-city',
      zip: 'fake-zip',
      state: 'fake-state',
      date: 'February 23, 2021',
      time: '9:40 AM',
      serviceDescription: 'COVID-19 Vaccination',
      memberFirstName: 'first-name',
      memberLastName: 'last-name',
      memberDateOfBirth: '01/01/2000',
      factSheetLinks: [
        '(This is a test link)[https://www.fda.gov/media/144414/download]',
      ],
    };
    expect(result).toEqual(immunizationRecordMock);
    expect(getAppointmentEventByOrderNumberMock).toBeCalledTimes(1);
    expect(getAppointmentEventByOrderNumberMock).toHaveBeenCalledWith(
      'member-id1',
      '1234',
      databaseMock
    );
  });

  it('returns immunization record details without appointment data if there is no appointment in database', async () => {
    getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce({
      location: mockLocation,
      service: null,
    });
    searchPersonByPrimaryMemberRxIdMock.mockReturnValueOnce(personInfo);
    getAppointmentEventByOrderNumberMock.mockReturnValueOnce(null);
    const expectedImmunizationRecordResult = {
      orderNumber: '1234',
      manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
      lotNumber: '12221',
      doseNumber: 1,
      memberId: 'member-id1',
      vaccineCode: '91300',
      memberFirstName: 'first-name',
      memberLastName: 'last-name',
      memberDateOfBirth: '01/01/2000',
    };
    const procedureDetails = await buildImmunizationRecord(
      immunizationRecordEventMock,
      databaseMock,
      configurationMock
    );
    expect(procedureDetails).toEqual(expectedImmunizationRecordResult);
    expect(getAppointmentEventByOrderNumberMock).toBeCalledTimes(1);
    expect(getAppointmentEventByOrderNumberMock).toHaveBeenCalledWith(
      'member-id1',
      '1234',
      databaseMock
    );
  });

  it('returns immunization record details without person info if only appointment details are available in the database', async () => {
    searchPersonByPrimaryMemberRxIdMock.mockReturnValueOnce(null);
    getAppointmentEventByOrderNumberMock.mockReturnValueOnce(mockAppointment);
    getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce({
      location: mockLocation,
      service: {
        claimOptions: [
          {
            cptCode: { code: '91300' },
            factSheetLinks: [
              '(This is a test link)[https://www.fda.gov/media/144414/download]',
            ],
          },
        ],
        serviceDescription: 'COVID-19 Vaccination',
      },
    });
    const expectedImmunizationRecordResult = {
      orderNumber: '1234',
      manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
      lotNumber: '12221',
      doseNumber: 1,
      memberId: 'member-id1',
      vaccineCode: '91300',
      address1: 'mock-addr1',
      address2: 'mock-addr2',
      city: 'fake-city',
      zip: 'fake-zip',
      state: 'fake-state',
      date: 'February 23, 2021',
      time: '9:40 AM',
      serviceDescription: 'COVID-19 Vaccination',
      locationName: 'Rx Pharmacy',
      factSheetLinks: [
        '(This is a test link)[https://www.fda.gov/media/144414/download]',
      ],
    };
    const procedureDetails = await buildImmunizationRecord(
      immunizationRecordEventMock,
      databaseMock,
      configurationMock
    );
    expect(procedureDetails).toEqual(expectedImmunizationRecordResult);
    expect(getAppointmentEventByOrderNumberMock).toBeCalledTimes(1);
    expect(getAppointmentEventByOrderNumberMock).toHaveBeenCalledWith(
      'member-id1',
      '1234',
      databaseMock
    );
  });

  it('returns immunization record details with information links if exist', async () => {
    searchPersonByPrimaryMemberRxIdMock.mockReturnValueOnce(null);
    getAppointmentEventByOrderNumberMock.mockReturnValueOnce(mockAppointment);
    getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce({
      location: null,
      service: {
        claimOptions: [
          {
            cptCode: { code: '91300' },
            factSheetLinks: [
              '(This is a test link)[https://www.fda.gov/media/144414/download]',
            ],
          },
        ],
      },
    });

    const expectedImmunizationRecordResult = {
      date: 'February 23, 2021',
      serviceDescription: 'COVID-19 Vaccination',
      time: '9:40 AM',
      orderNumber: '1234',
      manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
      lotNumber: '12221',
      doseNumber: 1,
      memberId: 'member-id1',
      vaccineCode: '91300',
      factSheetLinks: [
        '(This is a test link)[https://www.fda.gov/media/144414/download]',
      ],
    };
    const procedureDetails = await buildImmunizationRecord(
      immunizationRecordEventMock,
      databaseMock,
      configurationMock
    );
    expect(procedureDetails).toEqual(expectedImmunizationRecordResult);
  });

  it('returns immunization record details without information links if they do not exist', async () => {
    searchPersonByPrimaryMemberRxIdMock.mockReturnValueOnce(null);
    getAppointmentEventByOrderNumberMock.mockReturnValueOnce(null);
    getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce({
      location: null,
      service: undefined,
    });

    const immunizationEventRecord = {
      ...immunizationRecordEventMock,
      eventData: {
        ...immunizationRecordEventMock.eventData,
        vaccineCodes: [
          {
            code: '91323',
          } as IVaccineCode,
        ],
      },
    } as IImmunizationRecordEvent;

    const expectedImmunizationRecordResult = {
      orderNumber: '1234',
      manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
      lotNumber: '12221',
      doseNumber: 1,
      memberId: 'member-id1',
      vaccineCode: '91323',
    };
    const procedureDetails = await buildImmunizationRecord(
      immunizationEventRecord,
      databaseMock,
      configurationMock
    );
    expect(procedureDetails).toEqual(expectedImmunizationRecordResult);
  });
});

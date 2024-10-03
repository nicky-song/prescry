// Copyright 2020 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { IProviderLocation } from '@phx/common/src/models/provider-location';
import { ITestResult } from '@phx/common/src/models/api-response/test-result-response';
import { IPatientTestResultEvent } from '../../../databases/mongo-database/v1/definitions/patient-test-result-event.definition';
import { getAppointmentEventByOrderNumber } from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { searchPersonByPrimaryMemberRxId } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IAppointmentEvent } from '../../../models/appointment-event';

import { buildPatientTestResult } from './build-patient-test-results';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { getServiceDetailsByServiceType } from '../../../utils/external-api/get-service-details-by-service-type';
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

jest.mock('../../../utils/external-api/get-service-details-by-service-type');

const getAppointmentEventByOrderNumberMock =
  getAppointmentEventByOrderNumber as jest.Mock;
const searchPersonByPrimaryMemberRxIdMock =
  searchPersonByPrimaryMemberRxId as jest.Mock;
const getProviderLocationByIdAndServiceTypeMock =
  getProviderLocationByIdAndServiceType as jest.Mock;
const getServiceDetailsByServiceTypeMock =
  getServiceDetailsByServiceType as jest.Mock;

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
    claimOptionId: '87833b25-bac2-443c-9bc4-aa3c837c9950',
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

const appointment = {
  eventType: 'appointment/confirmation',
  eventData: {
    appointment: {
      start: new Date('2020-06-23T13:00:00+0000'),
      serviceDescription: 'COVID-19 Rapid Antigen Test',
      locationId: '12345',
    },
    orderNumber: '1234',
    primaryMemberRxId: '2020052501',
    serviceType: 'test-service',
  },
} as unknown as IAppointmentEvent;

const providerLocation = {
  providerInfo: { providerName: 'Test Provider' },
  address1: '123 E Main St',
  address2: 'Suite 200',
  city: 'Seattle',
  state: 'WA',
  zip: '55555',
  phoneNumber: '123',
  cliaNumber: '12345',
} as unknown as IProviderLocation;

const service = {
  claimOptions: [
    {
      claimOptionId: '87833b25-bac2-443c-9bc4-aa3c837c9950',
      icd10Code: {
        code: 'U07.D',
        colorMyRx: '#000000',
        textColorMyRx: '#FFFFFF',
        descriptionMyRx: 'Test description',
        valueMyRx: 'POSITIVE',
      },
      serviceType: 'abbott_antigen',
      manufacturer: 'test1',
      factSheetLinks: ['(This is a test link)[https://prescryptive.com/]'],
    },
    {
      claimOptionId: '87833b25-bac2-443c-9bc4-aa3c837c9951',
      icd10Code: {
        code: 'U07.D',
        colorMyRx: '#000000',
        textColorMyRx: '#FFFFFF',
        descriptionMyRx: 'Test description',
        valueMyRx: 'POSITIVE',
      },
      serviceType: 'c19-pcr-test',
      manufacturer: 'test2',
      factSheetLinks: ['(This is a test link)[https://prescryptive.com/]'],
    },
  ],
  administrationMethod: 'Nasal Swab',
  testType: 'Viral – COVID-19 Antigen',
};

beforeEach(() => {
  jest.clearAllMocks();
});
describe('buildPatientTestResult', () => {
  it('returns patient test result with appointment data and location data if there is appointment and location in database', async () => {
    searchPersonByPrimaryMemberRxIdMock.mockResolvedValueOnce(personInfo);
    getAppointmentEventByOrderNumberMock.mockResolvedValueOnce(appointment);
    getProviderLocationByIdAndServiceTypeMock.mockResolvedValueOnce({
      location: providerLocation,
      message: 'success',
    });
    getServiceDetailsByServiceTypeMock.mockResolvedValueOnce({
      service,
    });
    const expectedTestResult = {
      icd10: ['U07.D'],
      memberId: '2020052501',
      fillDate: new Date('2020-05-15'),
      orderNumber: '1234',
      memberFirstName: 'First',
      memberLastName: 'Last',
      memberDateOfBirth: '01/01/2000',
      date: 'June 23, 2020',
      time: '1:00 PM',
      productOrService: '00000190000',
      providerName: 'Test Provider',
      providerAddress: {
        address1: '123 E Main St',
        address2: 'Suite 200',
        city: 'Seattle',
        state: 'WA',
        zip: '55555',
      },
      factSheetLinks: ['(This is a test link)[https://prescryptive.com/]'],
      colorMyRx: '#000000',
      textColorMyRx: '#FFFFFF',
      descriptionMyRx: 'Test description',
      valueMyRx: 'POSITIVE',
      providerPhoneNumber: '123',
      providerCliaNumber: '12345',
      serviceDescription: 'COVID-19 Rapid Antigen Test',
      manufacturer: 'test1',
      administrationMethod: 'Nasal Swab',
      testType: 'Viral – COVID-19 Antigen',
    } as ITestResult;
    const testResult = await buildPatientTestResult(
      patientTestResultEventMock,
      databaseMock,
      configurationMock
    );
    expect(testResult).toEqual(expectedTestResult);
    expect(getAppointmentEventByOrderNumberMock).toBeCalledTimes(1);
    expect(getAppointmentEventByOrderNumberMock).toHaveBeenCalledWith(
      '2020052501',
      '1234',
      databaseMock
    );
    expect(getServiceDetailsByServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      'test-service'
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toBeCalledTimes(1);
    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      '12345'
    );
  });
  it('returns patient test result without appointment data if there is no appointment in database', async () => {
    searchPersonByPrimaryMemberRxIdMock.mockResolvedValueOnce(personInfo);
    getAppointmentEventByOrderNumberMock.mockResolvedValueOnce(null);
    const expectedTestResult = {
      icd10: ['U07.D'],
      memberId: '2020052501',
      fillDate: new Date('2020-05-15'),
      orderNumber: '1234',
      memberFirstName: 'First',
      memberLastName: 'Last',
      memberDateOfBirth: '01/01/2000',
      productOrService: '00000190000',
    };
    const testResult = await buildPatientTestResult(
      patientTestResultEventMock,
      databaseMock,
      configurationMock
    );
    expect(testResult).toEqual(expectedTestResult);
    expect(getAppointmentEventByOrderNumberMock).toBeCalledTimes(1);
    expect(getAppointmentEventByOrderNumberMock).toHaveBeenCalledWith(
      '2020052501',
      '1234',
      databaseMock
    );
    expect(getProviderLocationByIdAndServiceTypeMock).not.toBeCalled();
  });
  it('returns patient test result without service data if there is no service in database', async () => {
    searchPersonByPrimaryMemberRxIdMock.mockResolvedValueOnce(personInfo);
    getAppointmentEventByOrderNumberMock.mockResolvedValueOnce(appointment);
    getProviderLocationByIdAndServiceTypeMock.mockResolvedValueOnce({
      location: providerLocation,
      message: 'success',
    });
    getServiceDetailsByServiceTypeMock.mockResolvedValueOnce({
      service: undefined,
    });
    const expectedTestResult = {
      icd10: ['U07.D'],
      memberId: '2020052501',
      fillDate: new Date('2020-05-15'),
      orderNumber: '1234',
      memberFirstName: 'First',
      memberLastName: 'Last',
      memberDateOfBirth: '01/01/2000',
      date: 'June 23, 2020',
      time: '1:00 PM',
      productOrService: '00000190000',
      providerName: 'Test Provider',
      providerAddress: {
        address1: '123 E Main St',
        address2: 'Suite 200',
        city: 'Seattle',
        state: 'WA',
        zip: '55555',
      },
      providerPhoneNumber: '123',
      providerCliaNumber: '12345',
      serviceDescription: 'COVID-19 Rapid Antigen Test',
    };
    const testResult = await buildPatientTestResult(
      patientTestResultEventMock,
      databaseMock,
      configurationMock
    );
    expect(testResult).toEqual(expectedTestResult);

    expect(getAppointmentEventByOrderNumberMock).toBeCalledTimes(1);
    expect(getAppointmentEventByOrderNumberMock).toHaveBeenCalledWith(
      '2020052501',
      '1234',
      databaseMock
    );
    expect(getServiceDetailsByServiceTypeMock).toBeCalledTimes(1);
    expect(getServiceDetailsByServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      'test-service'
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toBeCalledTimes(1);
    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      '12345'
    );
  });
  it('returns patient test result without service data if there is no matching claim option in service', async () => {
    searchPersonByPrimaryMemberRxIdMock.mockResolvedValueOnce(personInfo);
    getAppointmentEventByOrderNumberMock.mockResolvedValueOnce(appointment);
    getProviderLocationByIdAndServiceTypeMock.mockResolvedValueOnce({
      location: providerLocation,
      message: 'success',
    });
    getServiceDetailsByServiceTypeMock.mockResolvedValueOnce({
      service: {
        ...service,
        administrationMethod: 'Nasal Swab',
        testType: 'Viral – COVID-19 Antigen',
        claimOptions: [],
      },
    });
    const expectedTestResult = {
      icd10: ['U07.D'],
      memberId: '2020052501',
      fillDate: new Date('2020-05-15'),
      orderNumber: '1234',
      memberFirstName: 'First',
      memberLastName: 'Last',
      memberDateOfBirth: '01/01/2000',
      date: 'June 23, 2020',
      time: '1:00 PM',
      productOrService: '00000190000',
      serviceDescription: 'COVID-19 Rapid Antigen Test',
      providerName: 'Test Provider',
      providerAddress: {
        address1: '123 E Main St',
        address2: 'Suite 200',
        city: 'Seattle',
        state: 'WA',
        zip: '55555',
      },
      factSheetLinks: undefined,
      colorMyRx: undefined,
      textColorMyRx: undefined,
      descriptionMyRx: undefined,
      valueMyRx: undefined,
      providerPhoneNumber: '123',
      providerCliaNumber: '12345',
      manufacturer: undefined,
      administrationMethod: 'Nasal Swab',
      testType: 'Viral – COVID-19 Antigen',
    };
    const testResult = await buildPatientTestResult(
      {
        ...patientTestResultEventMock,
        eventData: {
          ...patientTestResultEventMock.eventData,
          claimOptionId: undefined,
        },
      },
      databaseMock,
      configurationMock
    );
    expect(testResult).toEqual(expectedTestResult);

    expect(getAppointmentEventByOrderNumberMock).toBeCalledTimes(1);
    expect(getAppointmentEventByOrderNumberMock).toHaveBeenCalledWith(
      '2020052501',
      '1234',
      databaseMock
    );
    expect(getServiceDetailsByServiceTypeMock).toBeCalledTimes(1);
    expect(getServiceDetailsByServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      'test-service'
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toBeCalledTimes(1);
    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      '12345'
    );
  });
  it('find correct claimOptions for test result when eventData has claimOptionId', async () => {
    searchPersonByPrimaryMemberRxIdMock.mockResolvedValueOnce(personInfo);
    getAppointmentEventByOrderNumberMock.mockResolvedValueOnce(appointment);
    getServiceDetailsByServiceTypeMock.mockResolvedValueOnce({ service });
    getProviderLocationByIdAndServiceTypeMock.mockResolvedValueOnce({
      location: providerLocation,
      message: 'success',
    });
    const expectedTestResult = {
      icd10: ['U07.D'],
      memberId: '2020052501',
      fillDate: new Date('2020-05-15'),
      orderNumber: '1234',
      memberFirstName: 'First',
      memberLastName: 'Last',
      memberDateOfBirth: '01/01/2000',
      date: 'June 23, 2020',
      time: '1:00 PM',
      productOrService: '00000190000',
      providerName: 'Test Provider',
      providerAddress: {
        address1: '123 E Main St',
        address2: 'Suite 200',
        city: 'Seattle',
        state: 'WA',
        zip: '55555',
      },
      factSheetLinks: ['(This is a test link)[https://prescryptive.com/]'],
      colorMyRx: '#000000',
      textColorMyRx: '#FFFFFF',
      descriptionMyRx: 'Test description',
      valueMyRx: 'POSITIVE',
      providerPhoneNumber: '123',
      providerCliaNumber: '12345',
      serviceDescription: 'COVID-19 Rapid Antigen Test',
      manufacturer: 'test1',
      administrationMethod: 'Nasal Swab',
      testType: 'Viral – COVID-19 Antigen',
    };
    const testResult = await buildPatientTestResult(
      patientTestResultEventMock,
      databaseMock,
      configurationMock
    );
    expect(testResult).toEqual(expectedTestResult);

    expect(getAppointmentEventByOrderNumberMock).toBeCalledTimes(1);
    expect(getAppointmentEventByOrderNumberMock).toHaveBeenCalledWith(
      '2020052501',
      '1234',
      databaseMock
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toBeCalledTimes(1);
    expect(getServiceDetailsByServiceTypeMock).toBeCalledTimes(1);
    expect(getServiceDetailsByServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      'test-service'
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      '12345'
    );
  });
  it('find correct claimOptions for test result when claimOptionId in eventData is undefined', async () => {
    searchPersonByPrimaryMemberRxIdMock.mockResolvedValueOnce(personInfo);
    getAppointmentEventByOrderNumberMock.mockResolvedValueOnce(appointment);
    getServiceDetailsByServiceTypeMock.mockResolvedValueOnce({ service });
    getProviderLocationByIdAndServiceTypeMock.mockResolvedValueOnce({
      location: providerLocation,
      message: 'success',
    });
    const expectedTestResult = {
      icd10: ['U07.D'],
      memberId: '2020052501',
      fillDate: new Date('2020-05-15'),
      orderNumber: '1234',
      memberFirstName: 'First',
      memberLastName: 'Last',
      memberDateOfBirth: '01/01/2000',
      date: 'June 23, 2020',
      time: '1:00 PM',
      productOrService: '00000190000',
      providerName: 'Test Provider',
      providerAddress: {
        address1: '123 E Main St',
        address2: 'Suite 200',
        city: 'Seattle',
        state: 'WA',
        zip: '55555',
      },
      factSheetLinks: ['(This is a test link)[https://prescryptive.com/]'],
      colorMyRx: '#000000',
      textColorMyRx: '#FFFFFF',
      descriptionMyRx: 'Test description',
      valueMyRx: 'POSITIVE',
      providerPhoneNumber: '123',
      providerCliaNumber: '12345',
      serviceDescription: 'COVID-19 Rapid Antigen Test',
      manufacturer: 'test1',
      administrationMethod: 'Nasal Swab',
      testType: 'Viral – COVID-19 Antigen',
    };
    const testResult = await buildPatientTestResult(
      {
        ...patientTestResultEventMock,
        eventData: {
          ...patientTestResultEventMock.eventData,
          claimOptionId: undefined,
        },
      },
      databaseMock,
      configurationMock
    );
    expect(testResult).toEqual(expectedTestResult);

    expect(getAppointmentEventByOrderNumberMock).toBeCalledTimes(1);
    expect(getAppointmentEventByOrderNumberMock).toHaveBeenCalledWith(
      '2020052501',
      '1234',
      databaseMock
    );
    expect(getServiceDetailsByServiceTypeMock).toBeCalledTimes(1);
    expect(getServiceDetailsByServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      'test-service'
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toBeCalledTimes(1);
    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      '12345'
    );
  });
  it('returns patient test result without location data if there is no location in database', async () => {
    searchPersonByPrimaryMemberRxIdMock.mockResolvedValueOnce(personInfo);
    getAppointmentEventByOrderNumberMock.mockResolvedValueOnce(appointment);
    getServiceDetailsByServiceTypeMock.mockResolvedValueOnce({
      service,
    });
    getProviderLocationByIdAndServiceTypeMock.mockResolvedValueOnce({
      errorCode: 404,
      message: 'error',
    });
    const expectedTestResult = {
      icd10: ['U07.D'],
      memberId: '2020052501',
      fillDate: new Date('2020-05-15'),
      orderNumber: '1234',
      memberFirstName: 'First',
      memberLastName: 'Last',
      memberDateOfBirth: '01/01/2000',
      date: 'June 23, 2020',
      time: '1:00 PM',
      productOrService: '00000190000',
      serviceDescription: 'COVID-19 Rapid Antigen Test',
      factSheetLinks: ['(This is a test link)[https://prescryptive.com/]'],
      colorMyRx: '#000000',
      textColorMyRx: '#FFFFFF',
      descriptionMyRx: 'Test description',
      valueMyRx: 'POSITIVE',
      manufacturer: 'test1',
      administrationMethod: 'Nasal Swab',
      testType: 'Viral – COVID-19 Antigen',
    };
    const testResult = await buildPatientTestResult(
      patientTestResultEventMock,
      databaseMock,
      configurationMock
    );
    expect(testResult).toEqual(expectedTestResult);
    expect(getAppointmentEventByOrderNumberMock).toBeCalledTimes(1);
    expect(getAppointmentEventByOrderNumberMock).toHaveBeenCalledWith(
      '2020052501',
      '1234',
      databaseMock
    );
    expect(getServiceDetailsByServiceTypeMock).toBeCalledTimes(1);
    expect(getServiceDetailsByServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      'test-service'
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toBeCalledTimes(1);
    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      '12345'
    );
  });
});

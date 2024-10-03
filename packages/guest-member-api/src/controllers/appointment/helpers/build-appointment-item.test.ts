// Copyright 2020 Prescryptive Health, Inc.

import { IAppointmentEvent } from '../../../models/appointment-event';
import { buildAppointmentItem } from './build-appointment-item';
import {
  IService,
  IProviderLocation,
} from '@phx/common/src/models/provider-location';
import { getPatientTestResultForOrderNumber } from '../../../databases/mongo-database/v1/query-helper/patient-test-result-event.query-helper';
import { IServices } from '../../../models/services';
import { getImmunizationRecordByOrderNumberForMembers } from '../../../databases/mongo-database/v1/query-helper/immunization-record-event.query-helper';
import {
  IVaccineCode,
  IProtocolApplied,
  IImmunizationRecordEvent,
} from '../../../models/immunization-record';
import { IProviderLocationResponse } from '../../../models/pharmacy-portal/get-provider-location.response';
import { getProviderLocationByIdAndServiceType } from '../../provider-location/helpers/get-provider-location-by-id-and-service-type.helper';
import { IAppointmentItem } from '@phx/common/src/models/api-response/appointment.response';
import { encodeAscii } from '@phx/common/src/utils/base-64-helper';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { databaseMock } from '../../../mock-data/database.mock';

jest.mock('@phx/common/src/utils/base-64-helper');

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/patient-test-result-event.query-helper'
);
jest.mock(
  '../../../databases/mongo-database/v1/query-helper/immunization-record-event.query-helper'
);
jest.mock(
  '../../provider-location/helpers/get-provider-location-by-id-and-service-type.helper'
);

const getPatientTestResultForOrderNumberMock =
  getPatientTestResultForOrderNumber as jest.Mock;
const getImmunizationRecordByOrderNumberForMembersMock =
  getImmunizationRecordByOrderNumberForMembers as jest.Mock;
const getProviderLocationByIdAndServiceTypeMock =
  getProviderLocationByIdAndServiceType as jest.Mock;
const encodeAsciiMock = encodeAscii as jest.Mock;

const appointmentLinkMock = 'appointmentLinkMock';
const mockService: IService = {
  serviceName: 'mock-name',
  serviceType: 'mock-service-type',
  confirmationAdditionalInfo: 'Additional Info for patients',
} as unknown as IService;

const mockServiceTypeDetails = {
  serviceType: 'abbott_antigen',
  procedureCode: '87811',
  serviceDescription: 'COVID-19 Rapid Antigen Test',
  serviceName: 'Antigen',
  serviceNameMyRx: 'mock-service name',
  confirmationDescriptionMyRx: 'mock-conf-desc',
  aboutDependentDescriptionMyRx: 'mock-dependent-desc',
  aboutQuestionsDescriptionMyRx: 'mock-question-desc',
  cancellationPolicyMyRx: 'mock-cancel',
  minimumAge: 10,
} as IServices;
const mockLocation = {
  identifier: 'loc-1',
  address1: 'mock-addr1',
  address2: 'mock-addr2',
  city: 'fake-city',
  zip: 'fake-zip',
  state: 'fake-state',
  providerInfo: {
    providerName: 'provider-name',
    npiNumber: 'fake-npi',
  },
  serviceList: [mockService],
  providerTaxId: 'dummy Tax Id',
} as unknown as IProviderLocation;

const mockProviderLocationResponse = {
  location: mockLocation,
  service: mockServiceTypeDetails,
  message: 'test-message',
} as unknown as IProviderLocationResponse;

const mockAppointment = {
  eventType: 'appointment/confirmation',
  eventData: {
    appointment: {
      serviceName: 'mock-name',
      customerName: 'name',
      start: new Date('2020-06-23T13:00:00+0000'),
      startInUtc: new Date('2020-06-23T13:00:00+0000'),
      locationId: 'loc-1',
      status: 'Accepted',
      procedureCode: 'procedure-code',
      serviceDescription: 'service-description',
    },
    payment: {
      paymentStatus: 'paid',
      unitAmount: 15000,
    },
    claimInformation: {
      prescriberNationalProviderId: 'provider NPI',
      productOrServiceId: 'product or service Id',
      providerLegalName: 'provider legal Name',
    },
    orderNumber: 'ordernumber',
    bookingStatus: 'Confirmed',
    serviceType: 'mock-service-type',
  },
} as IAppointmentEvent;

const appointmentItemMock = {
  serviceName: 'mock-name',
  customerName: 'name',
  customerDateOfBirth: '01/01/2000',
  status: 'Accepted',
  orderNumber: 'ordernumber',
  locationName: 'provider-name',
  address1: 'mock-addr1',
  address2: 'mock-addr2',
  city: 'fake-city',
  zip: 'fake-zip',
  state: 'fake-state',
  additionalInfo: 'Additional Info for patients',
  date: 'June 23, 2020',
  time: '1:00 PM',
  providerTaxId: 'dummy Tax Id',
  totalCost: '150',
  providerLegalName: 'provider legal Name',
  providerNpi: 'fake-npi',
  diagnosticCode: 'POSITIVE',
  paymentStatus: 'paid',
  procedureCode: 'procedure-code',
  serviceDescription: 'service-description',
  startInUtc: new Date('2020-06-23T13:00:00+0000'),
  bookingStatus: 'Confirmed',
  serviceType: 'mock-service-type',
  confirmationDescription: 'mock-conf-desc',
  cancellationPolicy: 'mock-cancel',
  appointmentLink: appointmentLinkMock,
} as IAppointmentItem;

const immunizationRecordEventMock = {
  eventType: 'immunization',
  eventData: {
    orderNumber: '1234',
    immunizationId: '561bf978-c4c2-4c14-a889-599348f7fef2',
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

describe('buildAppointmentItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    encodeAsciiMock.mockReturnValue(appointmentLinkMock);
    getProviderLocationByIdAndServiceTypeMock.mockResolvedValue({
      ...mockProviderLocationResponse,
      location: {
        ...mockLocation,
        npiNumber: 'fake-npi',
      },
    });
  });

  const testResults = {
    _id: 'event-id',
    identifiers: [],
    eventData: {
      primaryMemberRxId: 'id1',
      productOrService: 'test-service',
      fillDate: 'test-date',
      provider: 'rxpharmacy',
      icd10: ['POSITIVE'],
    },
    tags: [],
    eventType: 'observation',
  };

  it('Create expected item with location and appointment details', async () => {
    getPatientTestResultForOrderNumberMock.mockReturnValueOnce(testResults);
    getProviderLocationByIdAndServiceTypeMock.mockResolvedValue({
      ...mockProviderLocationResponse,
      location: {
        ...mockLocation,
        phoneNumber: 'fake-phone-number',
        cliaNumber: 'fake-clia',
        npiNumber: 'fake-npi',
      },
    });

    const result = await buildAppointmentItem(
      mockAppointment,
      databaseMock,
      configurationMock,
      '2000-01-01'
    );
    const appointmentItemWithLocationMock = {
      ...appointmentItemMock,
      providerPhoneNumber: 'fake-phone-number',
      providerClia: 'fake-clia',
    };
    expect(result).toEqual(appointmentItemWithLocationMock);
  });
  it('returns undefined if location is not found', async () => {
    getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce({
      ...mockProviderLocationResponse,
      location: null,
    });
    const result = await buildAppointmentItem(
      mockAppointment,
      databaseMock,
      configurationMock,
      '2000-01-01'
    );
    expect(result).toEqual(undefined);
  });
  it('Not add service additional info if service not found', async () => {
    getPatientTestResultForOrderNumberMock.mockReturnValueOnce(testResults);
    const result = await buildAppointmentItem(
      mockAppointment,
      databaseMock,
      configurationMock,
      '2000-01-01'
    );
    expect(result).toEqual(appointmentItemMock);
  });
  it('"provider NPI" and "Provider Legal Name" will be undefined if claimInformation is null in database', async () => {
    getPatientTestResultForOrderNumberMock.mockReturnValueOnce(testResults);
    const mockAppointmentWithOutClaimInfo = {
      ...mockAppointment,
      claimInformation: undefined,
    } as IAppointmentEvent;
    const result = await buildAppointmentItem(
      mockAppointmentWithOutClaimInfo,
      databaseMock,
      configurationMock,
      '2000-01-01'
    );
    expect(result).toEqual(appointmentItemMock);
  });

  it('"Diagnostic code" will be undefined if patientTestResults for particular order number is null in the database', async () => {
    getPatientTestResultForOrderNumberMock.mockReturnValueOnce(null);
    const appointmentItemMockWithoutDiagnosticCode = {
      ...appointmentItemMock,
      diagnosticCode: undefined,
    };
    const result = await buildAppointmentItem(
      mockAppointment,
      databaseMock,
      configurationMock,
      '2000-01-01'
    );
    expect(result).toEqual(appointmentItemMockWithoutDiagnosticCode);
  });
  it('"Total Cost" will be undefined and "PaymentStatus" will be "no_payment_Required" if payment is null in the database', async () => {
    getPatientTestResultForOrderNumberMock.mockReturnValueOnce(testResults);
    const mockAppointmentWithNoPayment = {
      ...mockAppointment,
      eventData: { ...mockAppointment.eventData, payment: undefined },
    };
    const appointmentItemMockWithoutTotalCostAndPayment = {
      ...appointmentItemMock,
      totalCost: undefined,
      paymentStatus: 'no_payment_required',
    };
    const result = await buildAppointmentItem(
      mockAppointmentWithNoPayment,
      databaseMock,
      configurationMock,
      '2000-01-01'
    );
    expect(result).toEqual(appointmentItemMockWithoutTotalCostAndPayment);
  });
  it('"Diagnostic code" will be undefined if patientTestResults contains empty array of icd10 code in the database', async () => {
    const testResultsWithEmptyIcd10 = {
      ...testResults,
      eventData: {
        ...testResults.eventData,
        icd10: [],
      },
    };
    getPatientTestResultForOrderNumberMock.mockReturnValueOnce(
      testResultsWithEmptyIcd10
    );
    const appointmentItemMockWithoutDiagnosticCode = {
      ...appointmentItemMock,
      diagnosticCode: undefined,
    };
    const result = await buildAppointmentItem(
      mockAppointment,
      databaseMock,
      configurationMock,
      '2000-01-01'
    );
    expect(result).toEqual(appointmentItemMockWithoutDiagnosticCode);
  });
  it('"Diagnostic code" will be undefined if patientTestResults doesnt contain icd10 code in the database', async () => {
    const testResultsWithNoIcd10 = {
      ...testResults,
      eventData: {
        primaryMemberRxId: 'id1',
        productOrService: 'test-service',
        fillDate: 'test-date',
        provider: 'rxpharmacy',
      },
    };
    getPatientTestResultForOrderNumberMock.mockReturnValueOnce(
      testResultsWithNoIcd10
    );
    const appointmentItemMockWithoutDiagnosticCode = {
      ...appointmentItemMock,
      diagnosticCode: undefined,
    };
    const result = await buildAppointmentItem(
      mockAppointment,
      databaseMock,
      configurationMock,
      '2000-01-01'
    );
    expect(result).toEqual(appointmentItemMockWithoutDiagnosticCode);
  });
  it('Return procedureCode if bookingStatus is Completed && we dont have test results', async () => {
    getPatientTestResultForOrderNumberMock.mockReturnValueOnce(undefined);
    getImmunizationRecordByOrderNumberForMembersMock.mockReturnValueOnce(
      immunizationRecordEventMock
    );

    const appointment = {
      eventType: 'appointment/confirmation',
      eventData: {
        appointment: {
          serviceName: 'mock-name',
          customerName: 'name',
          start: new Date('2020-06-23T13:00:00+0000'),
          startInUtc: new Date('2020-06-23T13:00:00+0000'),
          locationId: 'loc-1',
          status: 'Accepted',
          serviceDescription: 'service-description',
        },
        payment: {
          paymentStatus: 'paid',
          unitAmount: 15000,
        },
        claimInformation: {
          prescriberNationalProviderId: 'provider NPI',
          productOrServiceId: 'product or service Id',
          providerLegalName: 'provider legal Name',
        },
        orderNumber: 'ordernumber',
        bookingStatus: 'Completed',
        serviceType: 'mock-service-type',
      },
    } as IAppointmentEvent;

    const appointmentItemMockWithoutServiceTypeDetails = {
      ...{
        ...appointmentItemMock,
        diagnosticCode: undefined,
        procedureCode: '91300',
        bookingStatus: 'Completed',
      },
      confirmationDescription: 'mock-conf-desc',
      cancellationPolicy: 'mock-cancel',
    };
    const result = await buildAppointmentItem(
      appointment,
      databaseMock,
      configurationMock,
      '2000-01-01'
    );
    expect(result).toEqual(appointmentItemMockWithoutServiceTypeDetails);
  });

  it('renders contractFee if exists in the database', async () => {
    getPatientTestResultForOrderNumberMock.mockReturnValueOnce(undefined);
    getImmunizationRecordByOrderNumberForMembersMock.mockReturnValueOnce(
      immunizationRecordEventMock
    );

    const appointment = {
      eventType: 'appointment/confirmation',
      eventData: {
        appointment: {
          serviceName: 'mock-name',
          customerName: 'name',
          start: new Date('2020-06-23T13:00:00+0000'),
          startInUtc: new Date('2020-06-23T13:00:00+0000'),
          locationId: 'loc-1',
          status: 'Accepted',
          serviceDescription: 'service-description',
        },
        payment: {
          paymentStatus: 'paid',
          unitAmount: 15000,
        },
        claimInformation: {
          prescriberNationalProviderId: 'provider NPI',
          productOrServiceId: 'product or service Id',
          providerLegalName: 'provider legal Name',
        },
        orderNumber: 'ordernumber',
        bookingStatus: 'Completed',
        serviceType: 'mock-service-type',
        contractFee: 7,
      },
    } as IAppointmentEvent;

    const appointmentItemMockWithoutServiceTypeDetails = {
      ...{
        ...appointmentItemMock,
        diagnosticCode: undefined,
        procedureCode: '91300',
        bookingStatus: 'Completed',
      },
      confirmationDescription: 'mock-conf-desc',
      cancellationPolicy: 'mock-cancel',
      contractFee: 7,
    };
    const result = await buildAppointmentItem(
      appointment,
      databaseMock,
      configurationMock,
      '2000-01-01'
    );
    expect(result).toEqual(appointmentItemMockWithoutServiceTypeDetails);
  });
});

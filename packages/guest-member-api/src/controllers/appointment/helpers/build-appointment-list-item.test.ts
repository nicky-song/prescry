// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentEvent } from '../../../models/appointment-event';
import {
  IService,
  IProviderLocation,
} from '@phx/common/src/models/provider-location';
import { IAppointmentListItem } from '@phx/common/src/models/api-response/appointment.response';
import { buildAppointmentListItem } from './build-appointment-list-item';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { IProviderLocationResponse } from '../../../models/pharmacy-portal/get-provider-location.response';
import { getProviderLocationByIdAndServiceType } from '../../provider-location/helpers/get-provider-location-by-id-and-service-type.helper';
import { encodeAscii } from '@phx/common/src/utils/base-64-helper';

jest.mock(
  '../../provider-location/helpers/get-provider-location-by-id-and-service-type.helper'
);

const getProviderLocationByIdAndServiceTypeMock =
  getProviderLocationByIdAndServiceType as jest.Mock;

const mockService: IService = {
  serviceName: 'mock-name',
  serviceType: 'mock-service-type',
  confirmationAdditionalInfo: 'Additional Info for patients',
} as unknown as IService;

const mockLocation = {
  identifier: 'loc-1',
  address1: 'mock-addr1',
  address2: 'mock-addr2',
  city: 'fake-city',
  zip: 'fake-zip',
  state: 'fake-state',
  providerInfo: {
    providerName: 'provider-name',
  },
  serviceList: [mockService],
  providerTaxId: 'dummy Tax Id',
} as unknown as IProviderLocation;

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
const appointmentListItemMock: IAppointmentListItem = {
  customerName: 'name',
  orderNumber: 'ordernumber',
  locationName: 'provider-name',
  date: 'June 23, 2020',
  time: '1:00 PM',
  serviceDescription: 'service-description',
  startInUtc: new Date('2020-06-23T13:00:00+0000'),
  bookingStatus: 'Confirmed',
  serviceType: 'mock-service-type',
  appointmentLink: encodeAscii(`${mockAppointment.eventData.orderNumber} ${mockAppointment.eventData.appointment.customerPhone}`),
};

describe('buildAppointmentItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getProviderLocationByIdAndServiceTypeMock.mockResolvedValue({
      location: mockLocation,
    } as unknown as IProviderLocationResponse);
  });

  it('Create expected item with with location and appointment details', async () => {
    const result = await buildAppointmentListItem(
      mockAppointment,
      configurationMock
    );
    expect(result).toEqual(appointmentListItemMock);
  });
  it('returns undefined if location is not found', async () => {
    getProviderLocationByIdAndServiceTypeMock.mockResolvedValueOnce({
      location: null,
    } as unknown as IProviderLocationResponse);
    const result = await buildAppointmentListItem(
      mockAppointment,
      configurationMock
    );
    expect(result).toEqual(undefined);
  });
});

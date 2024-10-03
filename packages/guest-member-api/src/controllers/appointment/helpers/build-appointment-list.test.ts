// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentEvent } from '../../../models/appointment-event';
import { IAppointmentListItem } from '@phx/common/src/models/api-response/appointment.response';
import { buildAppointmentListItem } from './build-appointment-list-item';
import { buildAppointmentList } from './build-appointment-list';
import { configurationMock } from '../../../mock-data/configuration.mock';

jest.mock('./build-appointment-list-item');
const buildAppointmentListItemMock = buildAppointmentListItem as jest.Mock;

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
  appointmentLink: 'mock-appointment-link',
};

describe('buildAppointmentItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Creates expected list with existing appointments', async () => {
    buildAppointmentListItemMock.mockReturnValueOnce(appointmentListItemMock);
    const result = await buildAppointmentList(configurationMock, [
      mockAppointment,
    ]);
    expect(buildAppointmentListItemMock).toHaveBeenCalledTimes(1);
    expect(buildAppointmentListItemMock).toHaveBeenCalledWith(
      mockAppointment,
      configurationMock
    );
    expect(result).toEqual([appointmentListItemMock]);
  });
  it('returns empty list when input list is empty', async () => {
    const result = await buildAppointmentList(configurationMock, []);
    expect(buildAppointmentListItemMock).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
  it('returns empty list when response from buildAppointmentList is undefined for all appointments', async () => {
    buildAppointmentListItemMock.mockReturnValueOnce(undefined);
    const result = await buildAppointmentList(configurationMock, [
      mockAppointment,
    ]);
    expect(buildAppointmentListItemMock).toHaveBeenCalledTimes(1);
    expect(buildAppointmentListItemMock).toHaveBeenCalledWith(
      mockAppointment,
      configurationMock
    );
    expect(result).toEqual([]);
  });
});

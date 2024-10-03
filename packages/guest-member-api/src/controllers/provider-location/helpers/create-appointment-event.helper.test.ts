// Copyright 2020 Prescryptive Health, Inc.

import { UTCDate } from '@phx/common/src/utils/date-time-helper';
import { getSessionIdFromRequest } from '../../../utils/health-record-event/get-sessionid-from-request';

import { createAcceptanceTextMessage } from './create-appointment-event.helper';
import { IProviderLocation } from '@phx/common/src/models/provider-location';
import { IServices } from '../../../models/services';
import { IAppointmentDateTime } from './appointment-time.helper';

jest.mock('@phx/common/src/utils/date-time-helper');
const UTCDateMock = UTCDate as jest.Mock;

jest.mock('../../../utils/health-record-event/get-sessionid-from-request');
const getSessionIdFromRequestMock = getSessionIdFromRequest as jest.Mock;

beforeEach(() => {
  getSessionIdFromRequestMock.mockReset();
  UTCDateMock.mockReset();
});

const mockServiceTypeDetails = {
  serviceType: 'abbott_antigen',
  procedureCode: 'procedureCode',
  serviceDescription: 'serviceDescription',
  cancellationPolicyMyRx:
    'Cancellations must be submitted at least {cancel-window-hours} hours in advance of your appointment to avoid any charges.',
} as IServices;
const location = {
  identifier: 'loc-1',
  address1: 'mock-addr1',
  city: 'fake-city',
  zip: 'fake-zip',
  state: 'fake-state',
  providerInfo: {
    providerName: 'provider-name',
  },
} as unknown as IProviderLocation;

describe('createAcceptanceTextMessage', () => {
  const appointmentTimeMock: IAppointmentDateTime = {
    date: '10/03/2020',
    time: '11:00 AM',
  };
  const mockOrderNumber = 'mock-order';
  const mockPhone = 'mock-phone';
  const mockExperienceUrl = 'https://test.myrx.io/';
  const mockCancelHours = 5;
  it('should create text message using cancellation policy in services', () => {
    const expected = `Prescryptive: Your appointment with provider-name on 10/03/2020 at 11:00 AM is confirmed.
Address: mock-addr1, fake-city, fake-state fake-zip

Cancellations must be submitted at least 5 hours in advance of your appointment to avoid any charges. To cancel, visit \n https://test.myrx.io//appointment/bW9jay1vcmRlciBtb2NrLXBob25l`;
    const actual = createAcceptanceTextMessage(
      appointmentTimeMock,
      location,
      mockOrderNumber,
      mockPhone,
      mockCancelHours,
      mockExperienceUrl,
      mockServiceTypeDetails
    );
    expect(actual).toBe(expected);
  });
  it('should ignore cancel hours if cancellation policy does not have it', () => {
    const serviceWithOutCancellationPolicy = {
      ...mockServiceTypeDetails,
      cancellationPolicyMyRx: undefined,
    } as IServices;
    const expected = `Prescryptive: Your appointment with provider-name on 10/03/2020 at 11:00 AM is confirmed.
Address: mock-addr1, fake-city, fake-state fake-zip

 To cancel, visit \n https://test.myrx.io//appointment/bW9jay1vcmRlciBtb2NrLXBob25l`;

    const actual = createAcceptanceTextMessage(
      appointmentTimeMock,
      location,
      mockOrderNumber,
      mockPhone,
      mockCancelHours,
      mockExperienceUrl,
      serviceWithOutCancellationPolicy
    );
    expect(actual).toBe(expected);
  });
  it('should not add cancellation policy if its not there in services', () => {
    const serviceWithDifferentCancellationPolicy = {
      ...mockServiceTypeDetails,
      cancellationPolicyMyRx: 'This is new cancellation policy.',
    } as IServices;
    const expected = `Prescryptive: Your appointment with provider-name on 10/03/2020 at 11:00 AM is confirmed.
Address: mock-addr1, fake-city, fake-state fake-zip

This is new cancellation policy. To cancel, visit \n https://test.myrx.io//appointment/bW9jay1vcmRlciBtb2NrLXBob25l`;

    const actual = createAcceptanceTextMessage(
      appointmentTimeMock,
      location,
      mockOrderNumber,
      mockPhone,
      mockCancelHours,
      mockExperienceUrl,
      serviceWithDifferentCancellationPolicy
    );
    expect(actual).toBe(expected);
  });
});

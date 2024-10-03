// Copyright 2021 Prescryptive Health, Inc.

import { AppointmentItemContent } from './appointment-item.content';

describe('AppointmentsListScreenContent', () => {
  it('has expected content', () => {
    expect(AppointmentItemContent.dateFieldLabel).toEqual('Date');
    expect(AppointmentItemContent.serviceFieldLabel).toEqual('Service');
    expect(AppointmentItemContent.providerFieldLabel).toEqual('Provider');
  });
});

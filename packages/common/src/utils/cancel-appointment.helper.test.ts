// Copyright 2021 Prescryptive Health, Inc.

import moment from 'moment';
import { checkCancellableAppointment } from './cancel-appointment.helper';

const cancelWindowHours = 6;
let savedDateNow: () => number;

describe('checkCancellableAppointment', () => {
  beforeEach(() => {
    savedDateNow = Date.now;
    Date.now = jest.fn().mockReturnValue(new Date('2021-06-20T13:00:00+0000'));
  });

  afterEach(() => {
    Date.now = savedDateNow;
  });

  it('should return true when current time is before start time before window hours', () => {
    const appointmentTime = moment.utc().toDate();
    const appointmentDateChange = new Date(
      appointmentTime.setMonth(appointmentTime.getMonth() + 1)
    );

    expect(
      checkCancellableAppointment(cancelWindowHours, appointmentDateChange)
    ).toBe(true);
  });

  it('should return false when current time is after window hours', () => {
    const appointmentTime = moment.utc().toDate();
    const appointmentDateChange = new Date(
      appointmentTime.setHours(appointmentTime.getHours() + 1)
    );

    expect(
      checkCancellableAppointment(cancelWindowHours, appointmentDateChange)
    ).toBe(false);
  });

  it('should return true when current time is a couple seconds before window hours', () => {
    const appointmentTime = moment.utc().toDate();
    const appointmentSecondsChange = new Date(
      appointmentTime.setSeconds(appointmentTime.getSeconds() + 5)
    );
    const appointmentDateChange = new Date(
      appointmentSecondsChange.setHours(appointmentSecondsChange.getHours() + 6)
    );

    expect(
      checkCancellableAppointment(cancelWindowHours, appointmentDateChange)
    ).toBe(true);
  });

  it('should return undefined when startInUtc is undefined', () => {
    expect(checkCancellableAppointment(cancelWindowHours, undefined)).toBe(
      undefined
    );
  });
});

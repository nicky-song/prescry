// Copyright 2020 Prescryptive Health, Inc.

import { AppointmentsFeedItemContent } from './appointments-feed-item.content';

describe('AppointmentsFeedItemContent', () => {
  it('has expected content', () => {
    expect(AppointmentsFeedItemContent.caption()).toEqual(`Appointments`);
    expect(AppointmentsFeedItemContent.description()).toEqual(
      `View all of your appointments`
    );
  });
});

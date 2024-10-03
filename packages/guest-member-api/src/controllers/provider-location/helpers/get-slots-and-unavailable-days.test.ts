// Copyright 2020 Prescryptive Health, Inc.

import { IBookingAvailability } from '@phx/common/src/models/booking/booking-availability.response';
import { getSlotsAndUnavailableDays } from './get-slots-and-unavailable-days';

const mockGetAvailabilityResponse: IBookingAvailability[] = [
  {
    date: new Date('2020-06-20T00:00:00'),
    slots: [
      new Date('2020-06-20T08:00:00'),
      new Date('2020-06-20T08:15:00'),
      new Date('2020-06-20T08:30:00'),
    ],
  },
  {
    date: new Date('2020-06-21T00:00:00'),
    slots: [],
  },
  {
    date: new Date('2020-06-22T00:00:00'),
    slots: [new Date('2020-06-22T15:00:00'), new Date('2020-06-22T16:15:00')],
  },
  {
    date: new Date('2020-06-23T00:00:00'),
    slots: [],
  },
  {
    date: new Date('2020-06-24T00:00:00'),
    slots: [],
  },
];

describe('getSlotsAndUnavailableDays', () => {
  it('returns expected number of slots and unavailable days', () => {
    const expectedResult = {
      slots: [
        {
          start: '2020-06-20T08:00:00',
          day: '2020-06-20',
          slotName: '8:00 am',
        },
        {
          start: '2020-06-20T08:15:00',
          day: '2020-06-20',
          slotName: '8:15 am',
        },
        {
          start: '2020-06-20T08:30:00',
          day: '2020-06-20',
          slotName: '8:30 am',
        },
        {
          start: '2020-06-22T15:00:00',
          day: '2020-06-22',
          slotName: '3:00 pm',
        },
        {
          start: '2020-06-22T16:15:00',
          day: '2020-06-22',
          slotName: '4:15 pm',
        },
      ],
      unAvailableDays: ['2020-06-21', '2020-06-23', '2020-06-24'],
    };
    const result = getSlotsAndUnavailableDays(mockGetAvailabilityResponse);
    expect(result).toEqual(expectedResult);
  });
});

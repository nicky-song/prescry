// Copyright 2020 Prescryptive Health, Inc.

import moment from 'moment-timezone';
import { IBookingAvailability } from '@phx/common/src/models/booking/booking-availability.response';
import {
  IAvailableSlot,
  IAvailableSlotsData,
} from '@phx/common/src/models/api-response/available-slots-response';
import { ApiConstants } from '../../../constants/api-constants';

export function getSlotsAndUnavailableDays(
  bookingResponse: IBookingAvailability[]
): IAvailableSlotsData {
  const slots: IAvailableSlot[] = [];
  const unAvailableDays: string[] = [];
  bookingResponse.forEach((availability) => {
    const day = moment(availability.date).format(
      ApiConstants.SHORT_DATE_FORMAT
    );
    if (availability.slots.length === 0) {
      unAvailableDays.push(day);
    } else {
      availability.slots.forEach((slot) => {
        const startMoment = moment(slot);
        const slotName = startMoment.format(ApiConstants.SLOT_NAME_FORMAT);
        const start = startMoment.format(ApiConstants.LONG_DATE_FORMAT);
        slots.push({ start, slotName, day });
      });
    }
  });
  return { slots, unAvailableDays };
}

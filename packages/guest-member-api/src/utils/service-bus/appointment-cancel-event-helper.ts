// Copyright 2020 Prescryptive Health, Inc.

import { SendableMessageInfo } from '@azure/service-bus';
import { ICancelBookingRequestBody } from '@phx/common/src/models/api-request-body/cancel-booking.request-body';
import { senderForAppointmentCancelEvent } from './service-bus-helper';

export const publishAppointmentCancelledEventMessage = async (
  data: ICancelBookingRequestBody
) => {
  const { locationId, orderNumber, eventId, reason } = data;
  const msgBody: SendableMessageInfo = {
    body: {
      locationId,
      eventId,
      orderNumber,
      reason,
    },
  };
  await senderForAppointmentCancelEvent.send(msgBody);
};

// Copyright 2020 Prescryptive Health, Inc.

export interface ICancelBookingRequestBody {
  locationId?: string;
  eventId?: string;
  orderNumber: string;
  reason?: string;
}

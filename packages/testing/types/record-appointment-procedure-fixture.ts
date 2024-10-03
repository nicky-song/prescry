// Copyright 2023 Prescryptive Health, Inc.

export interface RecordAppointmentProcedure {
  appointment: {
    bookingId: string;
    startDate: string;
  };
  claimOption: {
    id: string;
    text: string;
  };
  providerNpi: string;
  prescriber: {
    firstName: string;
    lastName: string;
  };
}

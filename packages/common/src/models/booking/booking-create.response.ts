// Copyright 2020 Prescryptive Health, Inc.

export interface ICreateBookingResponse {
  statusCode: number;
  message: string;
  eventInformation: IAppointmentEventInfo;
}
export interface IAppointmentEventInfo {
  eventId: string;
  eventDateTime: Date;
  room: string;
  eventDateTimeInUTC: Date;
  timezone: string;
}

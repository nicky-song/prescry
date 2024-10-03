// Copyright 2023 Prescryptive Health, Inc.

import fetch, { Response } from 'node-fetch';

export class AppointmentService {
  public static createForFreeService = async (
    localStorageToken: string,
    localStorageDeviceToken: string,
    bookingId: string,
    providerIdentifier: string,
    providerServiceType: string,
    startDate: string,
    memberAddress: {
      address1: string;
      county: string;
      city: string;
      state: string;
      zip: string;
    },
    questionAnswers: {
      questionId: string;
      questionText: string;
      answer: string;
      required?: boolean;
    }[],
    experienceBaseUrl: string,
    requestId: string
  ): Promise<string> => {
    const apiUrl = process.env.MY_PRESCRYPTIVE_URL;
    if (apiUrl === undefined)
      throw new Error('My Prescryptive API Url is not defined');

    const apiResponse: Response = await fetch(
      `https://${apiUrl}/api/provider-location/create-booking`,
      {
        method: 'POST',
        headers: {
          authorization: localStorageToken,
          'x-prescryptive-device-token': localStorageDeviceToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'request-id': requestId,
        },
        body: JSON.stringify({
          bookingId,
          locationId: providerIdentifier,
          serviceType: providerServiceType,
          start: startDate,
          questions: questionAnswers,
          experienceBaseUrl,
          memberAddress,
        }),
      }
    );

    if (apiResponse.ok) {
      const jsonResponse = await apiResponse.json();
      const orderNumber: string = jsonResponse.data.appointment.orderNumber;
      return orderNumber;
    }

    throw new Error(`Failed to create the Appointment`);
  };
}

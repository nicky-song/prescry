// Copyright 2023 Prescryptive Health, Inc.

import {
  AppointmentAvailableSlot,
  ProviderService as ProviderServiceType,
} from '../types';

import fetch, { Response } from 'node-fetch';

export abstract class ProviderService {
  public static getProviderWithServiceByIdentifier = async (
    localStorageToken: string,
    localStorageDeviceToken: string,
    providerIdentifier: string,
    providerServiceType: string
  ): Promise<ProviderServiceType> => {
    const apiUrl = process.env.MY_PRESCRYPTIVE_URL;
    if (apiUrl === undefined)
      throw new Error('My Prescryptive API Url is not defined');

    const url = new URL(
      `https://${apiUrl}/api/provider-location/${providerIdentifier}`
    );
    url.searchParams.append('servicetype', providerServiceType);

    const apiResponse: Response = await fetch(url, {
      method: 'GET',
      headers: {
        authorization: localStorageToken,
        'x-prescryptive-device-token': localStorageDeviceToken,
      },
    });

    if (apiResponse.ok) {
      const jsonResponse = await apiResponse.json();
      const providerWithService: ProviderServiceType =
        jsonResponse.data.location;
      return providerWithService;
    }

    throw new Error(`Failed to get Provider`);
  };

  public static getStaffAvailability = async (
    localStorageToken: string,
    localStorageDeviceToken: string,
    providerIdentifier: string,
    providerServiceType: string,
    startDate: string,
    endDate: string
  ): Promise<AppointmentAvailableSlot[]> => {
    const apiUrl = process.env.MY_PRESCRYPTIVE_URL;
    if (apiUrl === undefined)
      throw new Error('My Prescryptive API Url is not defined');

    const apiResponse: Response = await fetch(
      `https://${apiUrl}/api/provider-location/get-availability`,
      {
        method: 'POST',
        headers: {
          authorization: localStorageToken,
          'x-prescryptive-device-token': localStorageDeviceToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId: providerIdentifier,
          serviceType: providerServiceType,
          start: startDate,
          end: endDate,
        }),
      }
    );

    if (apiResponse.ok) {
      const jsonResponse = await apiResponse.json();
      const availableSlots: AppointmentAvailableSlot[] =
        jsonResponse.data.slots;
      return availableSlots;
    }

    throw new Error(`Failed to get Staff Availability`);
  };
}

// Copyright 2023 Prescryptive Health, Inc.

import fetch, { Response } from 'node-fetch';
import { AppointmentLockSlot } from '../../types/appointment-lock-slot';
import { PharmacyPortalTokenHandler } from './tokens/pharmacy-portal-token-handler';

export abstract class AppointmentServiceExternal {
  public static lockSlot = async (
    providerIdentifier: string,
    startDate: string,
    serviceType: string,
    phoneNumber: string
  ): Promise<AppointmentLockSlot> => {
    const accessToken = await PharmacyPortalTokenHandler.getToken();
    if (accessToken === undefined) {
      throw new Error(`Cannot generate Booking, Access Token was not acquired`);
    }

    const baseUrl = process.env.PHARMACY_PORTAL_BASE_API_URL;
    if (baseUrl === undefined)
      throw new Error('Pharmacy Portal URL is not defined');

    const bodyString = JSON.stringify({
      locationId: providerIdentifier,
      startDate,
      serviceType,
      customerPhoneNumber: phoneNumber,
    });

    const apiResponse: Response = await fetch(
      `${baseUrl}/api/v1/provider/lock-slots`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: bodyString,
      }
    );

    if (apiResponse.ok) {
      const jsonResponse = await apiResponse.json();
      const appointmentLock: AppointmentLockSlot = jsonResponse;
      return appointmentLock;
    } else {
      const { message } = await apiResponse.json();
      throw new Error(
        `Booking generation failed. HTTP Error Response: ${apiResponse.status} - Error Message: ${message}`
      );
    }
  };
}

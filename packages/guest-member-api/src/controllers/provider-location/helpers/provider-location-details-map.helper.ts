// Copyright 2020 Prescryptive Health, Inc.

import {
  IProviderLocation,
  IService,
} from '@phx/common/src/models/provider-location';
import { convertOutlookTimezoneToIANATimezone } from './appointment-timezone.helper';

export function buildProviderLocationDetails(
  providerLocation: IProviderLocation,
  service: IService,
  inputDistance?: number
) {
  return {
    id: providerLocation.identifier,
    providerName: providerLocation.providerInfo.providerName,
    locationName: providerLocation.locationName,
    address1: providerLocation.address1,
    address2: providerLocation.address2,
    city: providerLocation.city,
    state: providerLocation.state,
    zip: providerLocation.zip,
    distance: inputDistance ?? 0,
    phoneNumber: providerLocation.phoneNumber,
    timezone: convertOutlookTimezoneToIANATimezone(providerLocation.timezone),
    serviceInfo: [
      {
        serviceName: service.serviceName,
        serviceType: service.serviceType,
        questions: [...service.questions],
        screenTitle: service.screenTitle,
        screenDescription: service.screenDescription,
        confirmationAdditionalInfo: service.confirmationAdditionalInfo,
        minLeadDays: service.minLeadDays,
        maxLeadDays: service.maxLeadDays,
        paymentRequired: !!service.payment,
      },
    ],
  };
}

// Copyright 2020 Prescryptive Health, Inc.

import { IProviderLocationDetails } from '@phx/common/src/models/api-response/provider-location-response';
import { IProviderLocationListItem } from '../../../models/pharmacy-portal/get-provider-location.response';

export function buildProviderLocation(
  providerLocation: IProviderLocationListItem
) {
  const distance = providerLocation.distanceMiles
    ? parseFloat(providerLocation.distanceMiles?.toFixed(2))
    : 0;
  return {
    id: providerLocation.id,
    providerName: providerLocation.providerName,
    locationName: providerLocation.locationName,
    address1: providerLocation.address.line1,
    address2: providerLocation.address.line2,
    city: providerLocation.address.city,
    state: providerLocation.address.state,
    zip: providerLocation.address.zipCode,
    distance,
    phoneNumber: providerLocation.phoneNumber,
    price: providerLocation.priceCents,
  } as IProviderLocationDetails;
}

// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { searchNearByPharmaciesForCoordinates } from './search-nearby-pharmacies-for-coordinates';
import { getNearbyPharmaciesFromRedis } from '../../databases/redis/get-nearby-pharmacies-from-redis';
import { addNearbyPharmaciesInRedis } from '../../databases/redis/add-nearby-pharmacies-to-redis';
import { convertPrescriptionPharmacyToPharmacy } from '../convert-prescription-pharmacy-to-pharmacy';
import { ApiConstants } from '../../constants/api-constants';

export interface IPharmacySearchAndCacheResponse {
  pharmacies?: IPharmacy[];
  errorCode?: number;
  message?: string;
}

export async function searchAndCacheNearbyPharmaciesForCoordinates(
  configuration: IConfiguration,
  latitude: number,
  longitude: number,
  distance: number,
  limit?: number
): Promise<IPharmacySearchAndCacheResponse> {
  const existingPharmaciesInRedis = await getNearbyPharmaciesFromRedis(
    latitude,
    longitude,
    distance,
    limit || ApiConstants.MAX_NUM_PHARMACY_LIMIT
  );
  if (existingPharmaciesInRedis)
    return {
      pharmacies: existingPharmaciesInRedis,
    };
  const pharmacySearchResponse = await searchNearByPharmaciesForCoordinates(
    configuration,
    latitude,
    longitude,
    distance,
    limit
  );
  if (pharmacySearchResponse.pharmacies) {
    const pharmacies = pharmacySearchResponse.pharmacies?.map(
      (prescriptionPharmacy) => {
        return convertPrescriptionPharmacyToPharmacy(prescriptionPharmacy);
      }
    );
    if (pharmacies.length > 0) {
      addNearbyPharmaciesInRedis(
        latitude,
        longitude,
        distance,
        pharmacies,
        configuration.redisNearbyPharmaciesKeyExpiryTime,
        limit || ApiConstants.MAX_NUM_PHARMACY_LIMIT
      );
    }
    return {
      ...pharmacySearchResponse,
      pharmacies,
    };
  }
  return { ...pharmacySearchResponse, pharmacies: undefined };
}

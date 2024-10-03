// Copyright 2022 Prescryptive Health, Inc.

import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { getValueFromRedis, RedisKeys } from '../../utils/redis/redis.helper';

export const getNearbyPharmaciesFromRedis = (
  latitude: number,
  longitude: number,
  distance: number,
  limit: number
): Promise<IPharmacy[] | undefined> =>
  getValueFromRedis<IPharmacy[] | undefined>(
    `${latitude}_${longitude}_${distance}_${limit}`,
    RedisKeys.NEARBY_PHARMACIES_KEY
  );

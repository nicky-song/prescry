// Copyright 2022 Prescryptive Health, Inc.

import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { ApiConstants } from '../../constants/api-constants';
import { addKeyInRedis, RedisKeys } from '../../utils/redis/redis.helper';

export const addNearbyPharmaciesInRedis = (
  latitude: number,
  longitude: number,
  distance: number,
  data: IPharmacy[],
  expiryTime: number,
  limit: number
) =>
  addKeyInRedis<IPharmacy[]>(
    `${latitude}_${longitude}_${distance}_${
      limit || ApiConstants.MAX_NUM_PHARMACY_LIMIT
    }`,
    data,
    expiryTime,
    RedisKeys.NEARBY_PHARMACIES_KEY
  );

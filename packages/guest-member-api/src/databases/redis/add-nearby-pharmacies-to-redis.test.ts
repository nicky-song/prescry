// Copyright 2022 Prescryptive Health, Inc.

import { IAddress } from '@phx/common/src/models/address';
import { IHours } from '@phx/common/src/models/date-time/hours';
import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { addKeyInRedis, RedisKeys } from '../../utils/redis/redis.helper';
import { addNearbyPharmaciesInRedis } from './add-nearby-pharmacies-to-redis';

jest.mock('../../utils/redis/redis.helper');
const addKeyInRedisMock = addKeyInRedis as jest.Mock;

describe('addNearbyPharmaciesInRedis', () => {
  it('should call addKeyInRedis with correct parameters for getting nearby pharmacies', async () => {
    const mockExpiryTime = 1800;
    const mockPharmacy = {
      address: {} as IAddress,
      isMailOrderOnly: false,
      name: 'test-name',
      ncpdp: 'test-ncpdp',
      hours: [] as IHours[],
      twentyFourHours: false,
    } as IPharmacy;
    const location = { latitude: 0, longitude: 1, distance: 10, limit: 20 };
    await addNearbyPharmaciesInRedis(
      location.latitude,
      location.longitude,
      location.distance,
      [mockPharmacy],
      mockExpiryTime,
      location.limit
    );
    expect(addKeyInRedisMock).toHaveBeenCalledWith(
      `${location.latitude}_${location.longitude}_${location.distance}_${location.limit}`,
      [mockPharmacy],
      mockExpiryTime,
      RedisKeys.NEARBY_PHARMACIES_KEY
    );
  });
});

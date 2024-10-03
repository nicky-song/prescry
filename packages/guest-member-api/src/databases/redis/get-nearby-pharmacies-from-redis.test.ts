// Copyright 2022 Prescryptive Health, Inc.

import { IAddress } from '@phx/common/src/models/address';
import { IHours } from '@phx/common/src/models/date-time/hours';
import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { getValueFromRedis, RedisKeys } from '../../utils/redis/redis.helper';
import { getNearbyPharmaciesFromRedis } from './get-nearby-pharmacies-from-redis';

jest.mock('../../utils/redis/redis.helper');
const getValueFromRedisMock = getValueFromRedis as jest.Mock;

describe('getNearbyPharmaciesFromRedis', () => {
  it('should call getValueFromRedis with correct parameters for getting nearby pharmacies', async () => {
    const mockPharmacy = {
      address: {} as IAddress,
      isMailOrderOnly: false,
      name: 'test-name',
      ncpdp: 'test-ncpdp',
      hours: [] as IHours[],
      twentyFourHours: false,
    } as IPharmacy;
    getValueFromRedisMock.mockResolvedValueOnce([mockPharmacy]);
    const location = { latitude: 0, longitude: 1, distance: 10, limit: 20 };
    const pharmacies = await getNearbyPharmaciesFromRedis(
      location.latitude,
      location.longitude,
      location.distance,
      location.limit
    );
    expect(getValueFromRedisMock).toHaveBeenCalledWith(
      `${location.latitude}_${location.longitude}_${location.distance}_${location.limit}`,
      RedisKeys.NEARBY_PHARMACIES_KEY
    );
    expect(pharmacies).toEqual([mockPharmacy]);
  });
});

// Copyright 2021 Prescryptive Health, Inc.

import {
  prescriptionPharmacyMock1,
  prescriptionPharmacyMock2,
} from '../../mock-data/prescription-pharmacy.mock';
import { configurationMock } from '../../mock-data/configuration.mock';
import { searchAndCacheNearbyPharmaciesForCoordinates } from './search-and-cache-nearby-pharmacies-for-coordinates';
import { searchNearByPharmaciesForCoordinates } from './search-nearby-pharmacies-for-coordinates';
import { pharmacyMock5, pharmacyMock6 } from '../../mock-data/pharmacy.mock';
import { getNearbyPharmaciesFromRedis } from '../../databases/redis/get-nearby-pharmacies-from-redis';
import { addNearbyPharmaciesInRedis } from '../../databases/redis/add-nearby-pharmacies-to-redis';
import { ApiConstants } from '../../constants/api-constants';
import { IPrescriptionPharmacy } from '../../models/platform/pharmacy-lookup.response';
import { IPharmacy } from '@phx/common/src/models/pharmacy';

jest.mock('./search-nearby-pharmacies-for-coordinates');
const searchNearByPharmaciesForCoordinatesMock =
  searchNearByPharmaciesForCoordinates as jest.Mock;

jest.mock('../../databases/redis/get-nearby-pharmacies-from-redis');
const getNearbyPharmaciesFromRedisMock =
  getNearbyPharmaciesFromRedis as jest.Mock;

jest.mock('../../databases/redis/add-nearby-pharmacies-to-redis');
const addNearbyPharmaciesInRedisMock = addNearbyPharmaciesInRedis as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

const latitudeMock = 10;
const longitudeMock = -20;

const radiusMileMock = 100;
describe('searchAndCacheNearbyPharmaciesForCoordinates', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('Return error if api return error', async () => {
    const mockErrorMessage = 'error';
    const expectedNearbyPharmaciesResponse = {
      errorCode: 400,
      message: mockErrorMessage,
    };
    searchNearByPharmaciesForCoordinatesMock.mockResolvedValueOnce(
      expectedNearbyPharmaciesResponse
    );
    const nearbyPharmaciesResponse =
      await searchAndCacheNearbyPharmaciesForCoordinates(
        configurationMock,
        latitudeMock,
        longitudeMock,
        radiusMileMock
      );
    expect(searchNearByPharmaciesForCoordinatesMock).toHaveBeenCalledWith(
      configurationMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      undefined
    );

    expect(nearbyPharmaciesResponse).toEqual(expectedNearbyPharmaciesResponse);
  });

  it('Stores information in redis and returns pharmacy information if api return success', async () => {
    const mockPrescriptionPharmacies = [
      prescriptionPharmacyMock1,
      prescriptionPharmacyMock2,
    ];
    const mockPharmacies = [pharmacyMock5, pharmacyMock6];
    const nearbyPharmaciesResponse = { pharmacies: mockPrescriptionPharmacies };
    const expectedNearbyPharmaciesResponse = {
      pharmacies: mockPharmacies,
    };
    searchNearByPharmaciesForCoordinatesMock.mockResolvedValueOnce(
      nearbyPharmaciesResponse
    );
    const foundAndCachedNearbyPharmaciesResponse =
      await searchAndCacheNearbyPharmaciesForCoordinates(
        configurationMock,
        latitudeMock,
        longitudeMock,
        radiusMileMock
      );
    expect(getNearbyPharmaciesFromRedisMock).toHaveBeenCalledWith(
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      ApiConstants.MAX_NUM_PHARMACY_LIMIT
    );
    expect(searchNearByPharmaciesForCoordinatesMock).toHaveBeenCalledWith(
      configurationMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      undefined
    );
    expect(addNearbyPharmaciesInRedisMock).toHaveBeenCalledWith(
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      [pharmacyMock5, pharmacyMock6],
      configurationMock.redisNearbyPharmaciesKeyExpiryTime,
      ApiConstants.MAX_NUM_PHARMACY_LIMIT
    );

    expect(foundAndCachedNearbyPharmaciesResponse).toEqual(
      expectedNearbyPharmaciesResponse
    );
  });

  it('only stores pharmacies in redis if there are pharmacies returned', async () => {
    const mockPrescriptionPharmacies = [] as IPrescriptionPharmacy[];
    const mockPharmacies = [] as IPharmacy[];
    const nearbyPharmaciesResponse = { pharmacies: mockPrescriptionPharmacies };
    const expectedNearbyPharmaciesResponse = {
      pharmacies: mockPharmacies,
    };
    searchNearByPharmaciesForCoordinatesMock.mockResolvedValueOnce(
      nearbyPharmaciesResponse
    );
    const foundAndCachedNearbyPharmaciesResponse =
      await searchAndCacheNearbyPharmaciesForCoordinates(
        configurationMock,
        latitudeMock,
        longitudeMock,
        radiusMileMock
      );
    expect(getNearbyPharmaciesFromRedisMock).toHaveBeenCalledWith(
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      ApiConstants.MAX_NUM_PHARMACY_LIMIT
    );
    expect(searchNearByPharmaciesForCoordinatesMock).toHaveBeenCalledWith(
      configurationMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      undefined
    );
    expect(addNearbyPharmaciesInRedisMock).not.toHaveBeenCalled();

    expect(foundAndCachedNearbyPharmaciesResponse).toEqual(
      expectedNearbyPharmaciesResponse
    );
  });

  it('gets and returns pharmacy information from redis if it exists', async () => {
    const mockPharmacies = [pharmacyMock5, pharmacyMock6];
    getNearbyPharmaciesFromRedisMock.mockResolvedValueOnce(mockPharmacies);
    const pharmaciesFromRedis =
      await searchAndCacheNearbyPharmaciesForCoordinates(
        configurationMock,
        latitudeMock,
        longitudeMock,
        radiusMileMock
      );
    expect(searchNearByPharmaciesForCoordinatesMock).not.toHaveBeenCalled();
    expect(pharmaciesFromRedis).toEqual({ pharmacies: mockPharmacies });
  });

  it('use limit value if passed in request instead of usign default limit', async () => {
    const mockPrescriptionPharmacies = [
      prescriptionPharmacyMock1,
      prescriptionPharmacyMock2,
    ];
    const mockPharmacies = [pharmacyMock5, pharmacyMock6];
    const nearbyPharmaciesResponse = { pharmacies: mockPrescriptionPharmacies };
    const expectedNearbyPharmaciesResponse = {
      pharmacies: mockPharmacies,
    };
    const limitMock = 15;
    searchNearByPharmaciesForCoordinatesMock.mockResolvedValueOnce(
      nearbyPharmaciesResponse
    );
    const foundAndCachedNearbyPharmaciesResponse =
      await searchAndCacheNearbyPharmaciesForCoordinates(
        configurationMock,
        latitudeMock,
        longitudeMock,
        radiusMileMock,
        limitMock
      );
    expect(getNearbyPharmaciesFromRedisMock).toHaveBeenCalledWith(
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      limitMock
    );
    expect(searchNearByPharmaciesForCoordinatesMock).toHaveBeenCalledWith(
      configurationMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      limitMock
    );
    expect(addNearbyPharmaciesInRedisMock).toHaveBeenCalledWith(
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      [pharmacyMock5, pharmacyMock6],
      configurationMock.redisNearbyPharmaciesKeyExpiryTime,
      limitMock
    );

    expect(foundAndCachedNearbyPharmaciesResponse).toEqual(
      expectedNearbyPharmaciesResponse
    );
  });
});

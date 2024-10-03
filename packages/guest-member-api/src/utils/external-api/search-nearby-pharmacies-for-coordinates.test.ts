// Copyright 2021 Prescryptive Health, Inc.

import { getDataFromUrl } from '../get-data-from-url';
import { searchNearByPharmaciesForCoordinates } from './search-nearby-pharmacies-for-coordinates';
import {
  prescriptionPharmacyMock1,
  prescriptionPharmacyMock2,
} from '../../mock-data/prescription-pharmacy.mock';
import { configurationMock } from '../../mock-data/configuration.mock';

jest.mock('../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

const latitudeMock = 10;
const longitudeMock = -20;

const radiusMileMock = 100;
describe('searchNearByPharmaciesForCoordinates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return error if api return error', async () => {
    const mockErrorMessage = 'error';
    const mockError = {
      title: mockErrorMessage,
      status: 400,
    };
    getDataFromUrlMock.mockResolvedValueOnce({
      json: () => mockError,
      ok: false,
      status: 400,
    });
    const expected = { errorCode: 400, message: mockErrorMessage };
    const actual = await searchNearByPharmaciesForCoordinates(
      configurationMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock
    );
    expect(getDataFromUrlMock).toHaveBeenCalledWith(
      'platform-gears-url/pharmacies/1.0/pharmacies/coordinates?latitude=10&longitude=-20&radiusMiles=100&maxResults=150&excludeClosedDoorFacilities=true',
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    expect(actual).toEqual(expected);
  });

  it('Return pharmacy information if api return success', async () => {
    const mockPharmacies = [
      prescriptionPharmacyMock1,
      prescriptionPharmacyMock2,
    ];
    const expected = { pharmacies: mockPharmacies };
    getDataFromUrlMock.mockResolvedValueOnce({
      json: () => mockPharmacies,
      ok: true,
      status: 200,
    });
    const actual = await searchNearByPharmaciesForCoordinates(
      configurationMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock
    );
    expect(actual).toEqual(expected);
  });

  it('use limit value if passed in request instead of usign default limit', async () => {
    const limitMock = 30;
    const mockPharmacies = [
      prescriptionPharmacyMock1,
      prescriptionPharmacyMock2,
    ];
    const expected = { pharmacies: mockPharmacies };
    getDataFromUrlMock.mockResolvedValueOnce({
      json: () => mockPharmacies,
      ok: true,
      status: 200,
    });
    const actual = await searchNearByPharmaciesForCoordinates(
      configurationMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      limitMock
    );
    expect(getDataFromUrlMock).toHaveBeenCalledWith(
      'platform-gears-url/pharmacies/1.0/pharmacies/coordinates?latitude=10&longitude=-20&radiusMiles=100&maxResults=30&excludeClosedDoorFacilities=true',
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual(expected);
  });
});

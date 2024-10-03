// Copyright 2022 Prescryptive Health, Inc.

import { IAddress } from '@phx/common/src/models/address';
import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { IConfiguration } from '../../../configuration';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import { getPharmacyDetailsByNcpdp } from '../../prescription/helpers/get-pharmacy-details-by-ncpdp';
import { getFavoritedPharmaciesByNcpdpList } from './get-favorited-pharmacies-by-ncpdp-list';

jest.mock('../../prescription/helpers/get-pharmacy-details-by-ncpdp');
const getPharmacyDetailsByNcpdpMock = getPharmacyDetailsByNcpdp as jest.Mock;

describe('getFavoritedPharmaciesByNcpdpList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getPharmacyDetailsByNcpdpMock.mockImplementation(
      (ncpdp: string, _configuration: IConfiguration) => {
        const addressMock: IAddress = {
          city: `city-mock-for-${ncpdp}`,
          lineOne: `line-one-mock-for-${ncpdp}`,
          state: `state-mock-for-${ncpdp}`,
          zip: `zip-mock-for-${ncpdp}`,
        };
        const pharmacyDetailsMock: IPrescriptionPharmacy = {
          address: addressMock,
          hours: [],
          name: `name-mock-for-${ncpdp}`,
          ncpdp,
          type: `type-mock-for-${ncpdp}`,
          isMailOrderOnly: false,
          twentyFourHours: true,
        };
        return pharmacyDetailsMock;
      }
    );
  });

  it('returns list of pharmacy details', async () => {
    const ncpdpMock1 = 'ncpdp-mock-1';
    const ncpdpMock2 = 'ncpdp-mock-2';
    const ncpdpMock3 = 'ncpdp-mock-3';
    const ncpdpListMock = [ncpdpMock1, ncpdpMock2, ncpdpMock3];
    const configurationMock = {
      platformGearsApiUrl: 'platform-gears-api-url-mock',
      gearsApiSubscriptionKey: 'gears-api-subscription-key-mock',
    } as IConfiguration;

    const pharmacyDetailsList = await getFavoritedPharmaciesByNcpdpList(
      ncpdpListMock,
      configurationMock
    );

    expect(getPharmacyDetailsByNcpdpMock.mock.calls).toEqual([
      [ncpdpMock1, configurationMock],
      [ncpdpMock2, configurationMock],
      [ncpdpMock3, configurationMock],
    ]);

    const expectedPharmacyDetailsList = ncpdpListMock.map((ncpdp: string) => {
      const expectedAddress: IAddress = {
        city: `city-mock-for-${ncpdp}`,
        lineOne: `line-one-mock-for-${ncpdp}`,
        state: `state-mock-for-${ncpdp}`,
        zip: `zip-mock-for-${ncpdp}`,
      };
      const expectedPharmacyDetails: IPharmacy = {
        isMailOrderOnly: false,
        twentyFourHours: true,
        address: expectedAddress,
        hours: [],
        name: `name-mock-for-${ncpdp}`,
        ncpdp,
        type: `type-mock-for-${ncpdp}`,
      };
      return expectedPharmacyDetails;
    });

    expect(pharmacyDetailsList).toEqual(expectedPharmacyDetailsList);
  });
});

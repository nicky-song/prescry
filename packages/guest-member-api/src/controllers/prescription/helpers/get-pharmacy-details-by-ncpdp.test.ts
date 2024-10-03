// Copyright 2021 Prescryptive Health, Inc.

import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { getPharmacyDetailsByNcpdp } from './get-pharmacy-details-by-ncpdp';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import { configurationMock } from '../../../mock-data/configuration.mock';

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

const ncpdpMock = '12345';
describe('getPharmacyDetailsHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns undefined if ncpdp is an empty string', async () => {
    const actual = await getPharmacyDetailsByNcpdp('', configurationMock);
    expect(getDataFromUrlMock).not.toHaveBeenCalled();
    expect(actual).toEqual(undefined);
  });
  it('Return undefined if api return error', async () => {
    const mockError = {
      title: 'One or more validation errors occurred.',
      status: 400,
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: 400,
    });

    const actual = await getPharmacyDetailsByNcpdp(
      ncpdpMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'platform-gears-url/pharmacies/1.0/pharmacy?ncpdp=12345',
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual(undefined);
  });
  it('Returns undefined if api is not available', async () => {
    const error = { message: 'internal error' };

    getDataFromUrlMock.mockImplementation(() => {
      throw error;
    });
    const actual = await getPharmacyDetailsByNcpdp(
      ncpdpMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'platform-gears-url/pharmacies/1.0/pharmacy?ncpdp=12345',
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual(undefined);
  });
  it('makes expected api request and return response if success', async () => {
    const mockPharmacyResponse: IPrescriptionPharmacy = {
      address: {
        city: 'BELLEVUE',
        distance: '5',
        lineOne: '10116 NE 8TH STREET',
        lineTwo: '',
        state: 'WA',
        zip: '98004',
      },
      email: 'RX40@BARTELLDRUGS.COM',
      hasDriveThru: false,
      hours: [
        {
          closes: {
            hours: 7,
            minutes: 0,
            pm: true,
          },
          day: 'Sun',
          opens: {
            hours: 9,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 10,
            minutes: 0,
            pm: true,
          },
          day: 'Mon',
          opens: {
            hours: 8,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 10,
            minutes: 0,
            pm: true,
          },
          day: 'Tue',
          opens: {
            hours: 8,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 10,
            minutes: 0,
            pm: true,
          },
          day: 'Wed',
          opens: {
            hours: 8,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 10,
            minutes: 0,
            pm: true,
          },
          day: 'Thu',
          opens: {
            hours: 8,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 10,
            minutes: 0,
            pm: true,
          },
          day: 'Fri',
          opens: {
            hours: 8,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 7,
            minutes: 0,
            pm: true,
          },
          day: 'Sat',
          opens: {
            hours: 9,
            minutes: 0,
            pm: false,
          },
        },
      ],

      name: 'BARTELL DRUGS #40',

      ncpdp: '12345',

      phone: '4254542468',
      type: 'retail',
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockPharmacyResponse,
      ok: true,
    });

    const actual = await getPharmacyDetailsByNcpdp(
      ncpdpMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'platform-gears-url/pharmacies/1.0/pharmacy?ncpdp=12345',
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual(mockPharmacyResponse);
  });
});

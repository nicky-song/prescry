// Copyright 2021 Prescryptive Health, Inc.

import { configurationMock } from '../../../mock-data/configuration.mock';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { getDrugInfoByNdc } from './get-prescription-drug-info-by-ndc';

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

const ndc = 'ndc';

describe('getDrugInfoByNdc', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes expected api request and return response if success', async () => {
    const responseMock = {
      name: 'LiProZonePak',
      genericName: 'Lidocaine-Prilocaine',
      ndc: '69665061001',
      formCode: 'KIT',
      strength: '2.5-2.5',
      strengthUnit: '%',
      multiSourceCode: 'Y',
      brandNameCode: 'T',
      packageTypeCode: 'BX',
      packageQuantity: 1,
      isGeneric: true,
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => responseMock,
      ok: true,
    });

    const actual = await getDrugInfoByNdc(ndc, configurationMock);
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'platform-gears-url/dds/1.0/drugs/ndc',
      undefined,
      'GET',
      { 'Ocp-Apim-Subscription-Key': 'mock-key' },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual({ ...responseMock, success: true });
  });
  it('returns error if drugData API returns error', async () => {
    const mockError = {
      errorCode: 404,
      message: 'error',
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: 404,
    });

    const actual = await getDrugInfoByNdc(ndc, configurationMock);
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'platform-gears-url/dds/1.0/drugs/ndc',
      undefined,
      'GET',
      { 'Ocp-Apim-Subscription-Key': 'mock-key' },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual({
      success: false,
      errorCode: 404,
      message: 'error',
    });
  });
});

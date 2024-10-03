// Copyright 2021 Prescryptive Health, Inc.

import { getDataFromUrl } from '../get-data-from-url';
import { getCouponById } from './get-coupon-by-id';
import { configurationMock } from '../../mock-data/configuration.mock';
import { couponMock } from '../../mock-data/coupon.mock';

jest.mock('../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

const couponIdMock = '00000000001?quantity=30';

describe('getCouponById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    const actual = await getCouponById(couponIdMock, configurationMock);
    const expectedResponse = {
      errorCode: 400,
      message: 'One or more validation errors occurred.',
    };
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'content-api-url/coupons/00000000001?quantity=30',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual(expectedResponse);
  });

  it('Return pharmacy prices if api return success', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => couponMock,
      ok: true,
      status: 200,
    });
    const actual = await getCouponById(couponIdMock, configurationMock);
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'content-api-url/coupons/00000000001?quantity=30',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual(couponMock);
  });
});

// Copyright 2021 Prescryptive Health, Inc.

import { getDataFromUrl } from '../get-data-from-url';
import { IPlatformApiError } from '../../models/platform/platform-api-error.response';
import {
  getCouponByNdcAndQuantity,
  ICouponResponse,
} from './get-coupon-by-ndc-and-quantity';
import { configurationMock } from '../../mock-data/configuration.mock';
import { couponMock } from '../../mock-data/coupon.mock';

jest.mock('../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

const ndcMock = '52427081599';
const quantityMock = 90;

describe('getCouponByNdcAndQuantity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return expected error code if api return error', async () => {
    const mockError: IPlatformApiError = {
      title: 'One or more validation errors occurred.',
      status: 400,
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: 400,
    });
    const actual = await getCouponByNdcAndQuantity(
      ndcMock,
      quantityMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'content-api-url/coupons/52427081599?quantity=90',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    const expectedResponse: ICouponResponse = {
      errorCode: 400,
      message: 'One or more validation errors occurred.',
    };
    expect(actual).toEqual(expectedResponse);
  });

  it('Return coupon if api return success', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => couponMock,
      ok: true,
      status: 200,
    });
    const actual = await getCouponByNdcAndQuantity(
      ndcMock,
      quantityMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'content-api-url/coupons/52427081599?quantity=90',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual({
      coupon: couponMock,
    });
  });

  it('Return empty object if coupon does not exist', async () => {
    const noCouponMock = {};
    getDataFromUrlMock.mockResolvedValue({
      json: () => noCouponMock,
      ok: true,
      status: 200,
    });
    const actual = await getCouponByNdcAndQuantity(
      ndcMock,
      quantityMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'content-api-url/coupons/52427081599?quantity=90',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual(noCouponMock);
  });
});

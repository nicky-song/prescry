// Copyright 2020 Prescryptive Health, Inc.

import { getCheckoutSessionRedirectUrls } from './get-checkout-session-redirect-urls';
import { ApiConstants } from '../../constants/api-constants';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import { ICheckoutSessionRedirectUrls } from './create-checkout-session';
import { CheckoutProductType } from '@phx/common/src/models/checkout/checkout-product-type';

jest.mock('@phx/common/src/utils/formatters/string.formatter', () => ({
  StringFormatter: {
    format: jest.fn(),
  },
}));

const formatMock = StringFormatter.format as jest.Mock;

beforeEach(() => {
  formatMock.mockReset();
});

describe('getCheckoutSessionRedirectUrls', () => {
  it('should return formatted checkout session redirect urls', () => {
    const baseUrl = 'https://myrx.io';
    const checkoutProductType: CheckoutProductType = 'appointment';
    const checkoutOrderNumber = '123445123213';
    const switches = 'f=test:1,test2:0  ';
    const operationId = 'operation-id';

    const expectedFormatParams = new Map<
      | 'baseUrl'
      | 'CHECKOUT_PRODUCT_TYPE'
      | 'CHECKOUT_ORDER_NUMBER'
      | 'CHECKOUT_OPERATION_ID'
      | 'switches',
      string
    >([
      ['baseUrl', baseUrl],
      ['CHECKOUT_PRODUCT_TYPE', checkoutProductType],
      ['CHECKOUT_ORDER_NUMBER', checkoutOrderNumber],
      ['CHECKOUT_OPERATION_ID', operationId],
      ['switches', (switches || '').trim()],
    ]);

    const expected: ICheckoutSessionRedirectUrls = {
      success_url: 'mock_success_url',
      cancel_url: 'mock_cancel_url',
    };

    formatMock.mockReturnValueOnce(expected.success_url);
    formatMock.mockReturnValueOnce(expected.cancel_url);

    const result = getCheckoutSessionRedirectUrls(
      baseUrl,
      'appointment',
      checkoutOrderNumber,
      operationId,
      switches
    );

    expect(result).toEqual(expected);
    expect(formatMock).toHaveBeenNthCalledWith(
      1,
      ApiConstants.PAYMENTS_REDIRECT_SUCCESS_URL,
      expectedFormatParams
    );
    expect(formatMock).toHaveBeenNthCalledWith(
      2,
      ApiConstants.PAYMENTS_REDIRECT_CANCEL_URL,
      expectedFormatParams
    );
  });
});

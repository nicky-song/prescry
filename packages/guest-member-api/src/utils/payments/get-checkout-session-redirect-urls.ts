// Copyright 2020 Prescryptive Health, Inc.

import { CheckoutProductType } from '@phx/common/src/models/checkout/checkout-product-type';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import { ApiConstants } from '../../constants/api-constants';
import { ICheckoutSessionRedirectUrls } from './create-checkout-session';

export function getCheckoutSessionRedirectUrls(
  baseUrl: string,
  checkoutProductType: CheckoutProductType,
  checkoutOrderNumber: string,
  operationId: string,
  switches?: string
): ICheckoutSessionRedirectUrls {
  const map = new Map<string, string>([
    ['baseUrl', baseUrl],
    ['CHECKOUT_PRODUCT_TYPE', checkoutProductType],
    ['CHECKOUT_ORDER_NUMBER', checkoutOrderNumber],
    ['CHECKOUT_OPERATION_ID', operationId],
    ['switches', (switches || '').trim()],
  ]);
  return {
    success_url: StringFormatter.format(
      ApiConstants.PAYMENTS_REDIRECT_SUCCESS_URL,
      map
    ),
    cancel_url: StringFormatter.format(
      ApiConstants.PAYMENTS_REDIRECT_CANCEL_URL,
      map
    ),
  };
}

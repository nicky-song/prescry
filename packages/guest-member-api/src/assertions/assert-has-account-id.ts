// Copyright 2022 Prescryptive Health, Inc.

import { assertIsTruthy } from '@phx/common/src/assertions/assert-is-truthy';
import { ErrorConstants } from '../constants/response-messages';

export function assertHasAccountId(
  accountId: string | undefined
): asserts accountId is string {
  assertIsTruthy(accountId, ErrorConstants.ACCOUNT_ID_MISSING);
}

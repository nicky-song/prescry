// Copyright 2022 Prescryptive Health, Inc.

import { assertIsTruthy } from '@phx/common/src/assertions/assert-is-truthy';
import { ErrorConstants } from '../constants/response-messages';

export function assertHasPhoneNumber(
  phoneNumber: string | undefined
): asserts phoneNumber is string {
  assertIsTruthy(phoneNumber, ErrorConstants.PHONE_NUMBER_MISSING);
}

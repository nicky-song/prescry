// Copyright 2022 Prescryptive Health, Inc.

import { assertIsTruthy } from '@phx/common/src/assertions/assert-is-truthy';
import { ErrorConstants } from '../constants/response-messages';

export function assertHasPersonCode(
  personCode: string | undefined
): asserts personCode is string {
  assertIsTruthy(personCode, ErrorConstants.PERSON_CODE_MISSING);
}

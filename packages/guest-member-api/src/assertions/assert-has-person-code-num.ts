// Copyright 2022 Prescryptive Health, Inc.

import { assertIsTruthy } from '@phx/common/src/assertions/assert-is-truthy';
import { ErrorConstants } from '../constants/response-messages';

export function assertHasPersonCodeNum(
  personCodeNum: number | undefined
): asserts personCodeNum is number {
  assertIsTruthy(personCodeNum, ErrorConstants.PERSON_CODE_MISSING);
}

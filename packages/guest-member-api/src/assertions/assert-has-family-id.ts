// Copyright 2022 Prescryptive Health, Inc.

import { assertIsTruthy } from '@phx/common/src/assertions/assert-is-truthy';
import { ErrorConstants } from '../constants/response-messages';

export function assertHasFamilyId(
  familyId: string | undefined
): asserts familyId is string {
  assertIsTruthy(familyId, ErrorConstants.FAMILY_ID_MISSING);
}

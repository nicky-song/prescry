// Copyright 2022 Prescryptive Health, Inc.

import { assertIsTruthy } from '@phx/common/src/assertions/assert-is-truthy';
import { ErrorConstants } from '../constants/response-messages';

export function assertHasMemberId(
  memberId: string | undefined
): asserts memberId is string {
  assertIsTruthy(memberId, ErrorConstants.MEMBER_ID_MISSING);
}

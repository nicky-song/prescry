// Copyright 2022 Prescryptive Health, Inc.

import { assertIsTruthy } from '@phx/common/src/assertions/assert-is-truthy';
import { IPerson } from '@phx/common/src/models/person';
import { ErrorConstants } from '../constants/response-messages';

export function assertHasPerson(
  person: IPerson | undefined
): asserts person is IPerson {
  assertIsTruthy(person, ErrorConstants.INVALID_PERSON_DATA);
}

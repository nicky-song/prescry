// Copyright 2022 Prescryptive Health, Inc.

import DateValidator from '@phx/common/src/utils/validators/date.validator';
import { ErrorConstants } from '../constants/response-messages';

export function assertIsIsoDate(dateString = ''): asserts dateString is string {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  const dateParts = dateString.split('-');

  if (
    !regex.test(dateString) ||
    !DateValidator.isDateValid(dateParts[0], dateParts[1], dateParts[2])
  ) {
    throw new Error(ErrorConstants.INVALID_ISO_DATE(dateString));
  }
}

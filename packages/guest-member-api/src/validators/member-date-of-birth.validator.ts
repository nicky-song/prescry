// Copyright 2018 Prescryptive Health, Inc.

import moment from 'moment';
import DateValidator from '@phx/common/src/utils/validators/date.validator';

export function validateMemberDateOfBirth(dateOfBirth: string): boolean {
  const dateRegex =
    /^(january|february|march|april|may|june|july|august|september|october|november|december)-(0[1-9]|[1-2][0-9]|3[0-1])-[0-9]{4}$/i;
  if (!dateRegex.test(dateOfBirth)) {
    return false;
  }
  try {
    const dateArray = dateOfBirth.split('-');
    if (dateArray.length !== 3) {
      return false;
    }
    const month = moment().month(dateArray[0]).format('M');
    return DateValidator.isDateValid(dateArray[2], month, dateArray[1]);
  } catch {
    return false;
  }
}

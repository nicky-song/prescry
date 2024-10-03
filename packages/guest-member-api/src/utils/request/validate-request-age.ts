// Copyright 2022 Prescryptive Health, Inc.

import { InternalResponseCode } from '../../constants/error-codes';
import {
  differenceInYear,
  UTCDate,
} from '@phx/common/src/utils/date-time-helper';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import dateFormat from 'dateformat';
import { LoginMessages } from '../../constants/response-messages';
import { BadRequestError } from '../../errors/request-errors/bad.request-error';
import { trackRegistrationFailureEvent } from '../custom-event-helper';

export const validateRequestAge = (
  birthDate: string,
  childMemberAgeLimit: number,
  firstName: string,
  lastName: string,
  primaryMemberRxId = '',
  errorMessage: string = LoginMessages.AUTHENTICATION_FAILED,
  internalCode: number = InternalResponseCode.GENERAL_MIN_AGE_NOT_MET
): void => {
  if (
    differenceInYear(UTCDate(getNewDate()), UTCDate(new Date(birthDate))) <
    childMemberAgeLimit
  ) {
    trackRegistrationFailureEvent(
      'ChildMember',
      firstName,
      lastName,
      primaryMemberRxId,
      dateFormat(birthDate, 'yyyy-mm-dd')
    );

    throw new BadRequestError(errorMessage, internalCode);
  }
};

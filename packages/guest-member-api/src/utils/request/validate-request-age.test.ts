// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import {
  differenceInYear,
  UTCDate,
} from '@phx/common/src/utils/date-time-helper';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import dateFormat from 'dateformat';
import { LoginMessages } from '../../constants/response-messages';
import { BadRequestError } from '../../errors/request-errors/bad.request-error';
import { configurationMock } from '../../mock-data/configuration.mock';
import { trackRegistrationFailureEvent } from '../custom-event-helper';
import { validateRequestAge } from './validate-request-age';

jest.mock('@phx/common/src/utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

jest.mock('@phx/common/src/utils/date-time-helper');
const differenceInYearMock = differenceInYear as jest.Mock;
const UTCDateMock = UTCDate as jest.Mock;

jest.mock('../custom-event-helper');
const trackRegistrationFailureEventMock =
  trackRegistrationFailureEvent as jest.Mock;

describe('validateRequestAge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [configurationMock.childMemberAgeLimit - 1, undefined, undefined, false],
    [configurationMock.childMemberAgeLimit - 1, undefined, 'Invalid', false],
    [
      configurationMock.childMemberAgeLimit - 1,
      'primary-member-rx-id',
      undefined,
      false,
    ],
    [configurationMock.childMemberAgeLimit, undefined, undefined, true],
    [configurationMock.childMemberAgeLimit + 1, undefined, undefined, true],
  ])(
    'validates age %p (primaryMemberRxId: %p, errorMessage: %p)',
    (
      ageMock: number,
      primaryMemberRxIdMock: string | undefined,
      errorMessageMock: string | undefined,
      isValidExpected: boolean
    ) => {
      const birthDateMock = 'January-01-2001';
      const childMemberAgeLimitMock = configurationMock.childMemberAgeLimit;
      const firstNameMock = 'first-name';
      const lastNameMock = 'last-name';

      const nowMock = new Date();
      getNewDateMock.mockReturnValue(nowMock);

      const nowValueMock = 1;
      UTCDateMock.mockReturnValueOnce(nowValueMock);

      const birthDateValueMock = 2;
      UTCDateMock.mockReturnValueOnce(birthDateValueMock);

      try {
        differenceInYearMock.mockReturnValue(ageMock);

        validateRequestAge(
          birthDateMock,
          childMemberAgeLimitMock,
          firstNameMock,
          lastNameMock,
          primaryMemberRxIdMock,
          errorMessageMock
        );

        if (!isValidExpected) {
          expect.assertions(1);
        }

        expect(trackRegistrationFailureEventMock).not.toHaveBeenCalled();
      } catch (error) {
        if (isValidExpected) {
          expect.assertions(0);
        }

        expectToHaveBeenCalledOnceOnlyWith(
          trackRegistrationFailureEventMock,
          'ChildMember',
          firstNameMock,
          lastNameMock,
          primaryMemberRxIdMock ?? '',
          dateFormat(birthDateMock, 'yyyy-mm-dd')
        );

        const expectedError = new BadRequestError(
          errorMessageMock ?? LoginMessages.AUTHENTICATION_FAILED
        );
        expect(error).toEqual(expectedError);
      }

      expect(UTCDateMock).toHaveBeenCalledTimes(2);
      expect(UTCDateMock).toHaveBeenNthCalledWith(1, nowMock);
      expect(UTCDateMock).toHaveBeenNthCalledWith(2, new Date(birthDateMock));

      expectToHaveBeenCalledOnceOnlyWith(
        differenceInYearMock,
        nowValueMock,
        birthDateValueMock
      );
    }
  );
});

// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../constants/response-messages';
import { assertHasMemberId } from './assert-has-member-id';

describe('assertHasMemberId', () => {
  it.each([
    [undefined, true],
    ['', true],
    ['x', false],
  ])(
    'asserts that family id (%p) is truthy',
    (memberIdMock: string | undefined, isErrorExpected: boolean) => {
      try {
        assertHasMemberId(memberIdMock);

        if (isErrorExpected) {
          expect.assertions(1);
        }
      } catch (error) {
        if (!isErrorExpected) {
          expect.assertions(0);
        }

        const expectedError = new Error(ErrorConstants.MEMBER_ID_MISSING);
        expect(error).toEqual(expectedError);
      }
    }
  );
});

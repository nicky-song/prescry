// Copyright 2022 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { ErrorConstants } from '../constants/response-messages';
import { assertHasPerson } from './assert-has-person';

describe('assertHasPerson', () => {
  const personMock = {} as IPerson;

  it.each([
    [undefined, true],
    [personMock, false],
  ])(
    'asserts that person (%p) exists',
    (personMock: IPerson | undefined, isErrorExpected: boolean) => {
      try {
        assertHasPerson(personMock);

        if (isErrorExpected) {
          expect.assertions(1);
        }
      } catch (error) {
        if (!isErrorExpected) {
          expect.assertions(0);
        }

        const expectedError = new Error(ErrorConstants.INVALID_PERSON_DATA);
        expect(error).toEqual(expectedError);
      }
    }
  );
});

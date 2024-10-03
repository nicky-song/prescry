// Copyright 2022 Prescryptive Health, Inc.

import { assertIsDefined } from './assert-is-defined';

describe('assertIsDefined', () => {
  it.each([
    [undefined, undefined, true],
    [undefined, 'failed', true],
    [null, undefined, true],
    ['', undefined, false],
    ['x', undefined, false],
  ])(
    'throws error if assertion fails for value %p',
    (
      valueMock: unknown,
      errorMessageMock: string | undefined,
      isErrorExpected: boolean
    ) => {
      try {
        assertIsDefined(valueMock, errorMessageMock);

        if (isErrorExpected) {
          expect.assertions(1);
        }
      } catch (error) {
        if (!isErrorExpected) {
          expect.assertions(0);
        }

        const expectedError = new Error(
          errorMessageMock ?? 'Value is not defined'
        );
        expect(error).toEqual(expectedError);
      }
    }
  );
});

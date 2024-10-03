// Copyright 2020 Prescryptive Health, Inc.

import { ErrorRequestInitialization } from '@phx/common/src/errors/error-request-initialization';
import { getRequiredField, getField } from './get-required-field';

describe('get-required-field', () => {
  it('should return the app local when it is truthy', () => {
    const test = {
      that: 1234 as number | undefined,
    };
    const value = getRequiredField(test, 'that');
    expect(value).not.toBeFalsy();
  });

  it('should throw exception if property doesnt exist or is null', () => {
    const test = {
      that: undefined as number | undefined,
    };

    expect(() => getRequiredField(test, 'that')).toThrowError(
      new ErrorRequestInitialization('that')
    );
  });
});

describe('getField', () => {
  it('should return the app local when it is truthy', () => {
    const test = {
      that: 1234 as number | undefined,
    };
    const value = getField(test, 'that');
    expect(value).not.toBeFalsy();
  });

  it('should return undefined if property doesnt exist or is null', () => {
    const test = {
      that: undefined as number | undefined,
    };

    expect(getField(test, 'that')).toEqual(undefined);
  });
});

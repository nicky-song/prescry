// Copyright 2021 Prescryptive Health, Inc.

import { getNewDate } from './get-new-date';

describe('getNewDate', () => {
  it('returns current date', () => {
    // Adapted from https://codewithhugo.com/mocking-the-current-date-in-jest-tests/
    jest
      .spyOn(global, 'Date')
      .mockImplementationOnce(
        () => new Date('2019-05-14T11:01:58.135Z') as unknown as string
      );

    expect(getNewDate()).toEqual(new Date('2019-05-14T11:01:58.135Z'));
  });
});

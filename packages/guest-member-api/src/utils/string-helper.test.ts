// Copyright 2018 Prescryptive Health, Inc.

import { createRandomString } from './string-helper';

describe('createRandomString', () => {
  it('should create random string of given length', () => {
    const randomString = createRandomString();

    expect(typeof randomString).toBe('string');
    expect(randomString.length).toBeGreaterThan(1);
    expect(randomString).toMatch(/^[a-zA-Z0-9]+$/);
  });
});

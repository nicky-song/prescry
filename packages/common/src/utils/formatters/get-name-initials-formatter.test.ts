// Copyright 2018 Prescryptive Health, Inc.

import { getNameInitials } from './get-name-initials-formatter';

describe('getNameInitials', () => {
  it('should return uppercase initials when provided full name', () => {
    expect(getNameInitials('keanu Reeves')).toBe('KR');
    expect(getNameInitials('keanu')).toBe('K');
  });

  it('should return empty string when name is empty', () => {
    expect(getNameInitials('')).toBe('');
  });

  it('should trim string when name starts with spaces ', () => {
    expect(getNameInitials(' TEST NAME')).toBe('TN');
  });
});

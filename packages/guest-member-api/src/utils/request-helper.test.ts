// Copyright 2018 Prescryptive Health, Inc.

import { Request } from 'express';
import { fetchRequestHeader } from './request-helper';

describe('fetchRequestHeader()', () => {
  it('should return string if header value is string', () => {
    const requestMock = {
      headers: {
        'x-header': 'header-value',
      },
    } as unknown as Request;
    expect(fetchRequestHeader(requestMock, 'x-header')).toBe('header-value');
  });

  it('should return first index value if header value is string[]', () => {
    const requestMock = {
      headers: {
        'x-header': ['value1', 'value2'],
      },
    } as unknown as Request;
    expect(fetchRequestHeader(requestMock, 'x-header')).toBe('value1');
  });
});

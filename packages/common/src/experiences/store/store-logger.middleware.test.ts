// Copyright 2018 Prescryptive Health, Inc.

import { setupLogger } from './store-logger.middleware';

const fakeActionType = 'fakeActionType';
const mockFn = jest.fn();

beforeEach(() => {
  mockFn.mockReturnValue(fakeActionType);
});
afterEach(() => {
  mockFn.mockReset();
});

describe('setupLogger middleware', () => {
  it('should return mock middleware with mock value', () => {
    const mockMiddleware = setupLogger(fakeActionType, mockFn);
    expect(typeof mockMiddleware).toBe('string');
    expect(mockMiddleware).toBe(fakeActionType);
  });
  it('should called mock function with mock parameter', () => {
    setupLogger(fakeActionType, mockFn);
    expect(mockFn).toBeCalledTimes(1);
    expect(mockFn).toBeCalledWith(fakeActionType);
  });
});

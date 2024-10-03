// Copyright 2020 Prescryptive Health, Inc.

import { useInterval } from './use-interval.hook';

jest.useFakeTimers();

const setIntervalId = jest.fn();
jest.mock('react', () => ({
  ...(jest.requireActual('react') as object),
  useState: () => {
    const lastIntervalId = setIntervalId.mock.calls.length
      ? setIntervalId.mock.calls[0][0]
      : undefined;

    return [lastIntervalId, setIntervalId];
  },
  useEffect: (callback: () => void, _: unknown[]) => callback(),
}));

beforeEach(() => {
  setIntervalId.mockClear();
});

afterAll(() => {
  jest.useRealTimers();
});

describe('useInterval', () => {
  describe('when it is live', () => {
    it('sets an interval and a callback when is live', () => {
      const callback = jest.fn();
      const expectedDelay = 1000;

      useInterval(callback, true, expectedDelay);

      expect(setInterval).toHaveBeenCalledTimes(1);
      const args = (setInterval as unknown as jest.Mock).mock.calls[0];
      expect(args.length).toBe(3);
      expect(args[0]).toBe(callback);
      expect(args[1]).toBe(expectedDelay);
      expect(args[2]).toEqual({});
    });
  });

  describe('when it is NOT live', () => {
    it('does nothing during the first run', () => {
      const callback = jest.fn();
      (setInterval as unknown as jest.Mock)
        .mockClear()
        .mockImplementation(() => 999);
      (clearInterval as jest.Mock).mockClear().mockImplementation(() => ({}));

      useInterval(callback, false, 777);

      expect(setInterval).toHaveBeenCalledTimes(0);
      expect(clearInterval).toHaveBeenCalledTimes(0);
    });

    it('clears any previously set interval', () => {
      const delay = 100;
      const expected = 999;

      const callback = jest.fn();
      (setInterval as unknown as jest.Mock)
        .mockReset()
        .mockReturnValue(expected);
      (clearInterval as jest.Mock).mockReset();

      const firstTimeIsLive = true;
      // when live, it sets the initial interval
      useInterval(callback, firstTimeIsLive, delay);

      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenCalledWith(callback, delay, {});
      expect(clearInterval).toHaveBeenCalledTimes(0);
      expect(setIntervalId).toHaveBeenNthCalledWith(1, expected);

      const secondTimeIsLive = false;
      // when NOT live, it clears the previously set interval
      useInterval(callback, secondTimeIsLive, 200);
      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(clearInterval).toHaveBeenCalledTimes(1);
    });
    it('sets an interval and a callback when is live and parameters are provided', () => {
      const callback = jest.fn();
      const expectedDelay = 1000;
      const params = { test: '1' };
      (setInterval as unknown as jest.Mock)
        .mockClear()
        .mockImplementation(() => 999);
      (clearInterval as jest.Mock).mockClear().mockImplementation(() => ({}));
      useInterval(callback, true, expectedDelay, params);

      expect(setInterval).toHaveBeenCalledTimes(1);
      const args = (setInterval as unknown as jest.Mock).mock.calls[0];
      expect(args.length).toBe(3);
      expect(args[0]).toBe(callback);
      expect(args[1]).toBe(expectedDelay);
      expect(args[2]).toEqual(params);
    });
  });
});

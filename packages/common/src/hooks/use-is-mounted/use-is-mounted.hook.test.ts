// Copyright 2022 Prescryptive Health, Inc.

import { useRef, useEffect } from 'react';
import { useIsMounted } from './use-is-mounted.hook';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(),
  useEffect: jest.fn(),
}));
const useRefMock = useRef as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

describe('useIsMounted', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useRefMock.mockImplementation((value) => {
      return {
        current: value,
      };
    });
  });

  it('calls useRef', () => {
    useIsMounted();

    expect(useRefMock).toHaveBeenCalledTimes(1);
    expect(useRefMock).toHaveBeenNthCalledWith(1, true);
  });

  it('calls useEffect', () => {
    useIsMounted();

    expect(useEffectMock).toHaveBeenCalledTimes(1);
    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), []);
  });

  it('sets isMounted.current to true initially and false after useEffect callback', () => {
    const isMounted = useIsMounted();

    expect(isMounted.current).toEqual(true);

    useEffectMock.mock.calls[0][0]()();

    expect(isMounted.current).toEqual(false);
  });
});

// Copyright 2021 Prescryptive Health, Inc.

import { ReactTestInstance } from 'react-test-renderer';

export const getChildren = (
  testInstance: ReactTestInstance
): ReactTestInstance[] => {
  const children = testInstance.props.children;

  if (!children) {
    return [];
  }

  return Array.isArray(children) ? children : [children];
};

export const getKey = (testInstance: ReactTestInstance): string | undefined =>
  (testInstance as unknown as { key: string }).key;

// TODO: Jest has an expect.extend() mechanism that should allow being able to
// just do expect.toHaveBeenCalledOnceOnlyWith() but I couldn't get it to work
// and didn't have time to spend on it.
export const expectToHaveBeenCalledOnceOnlyWith = <E extends unknown[]>(
  mock: jest.Mock,
  ...params: E
) => {
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenNthCalledWith(1, ...params);
};

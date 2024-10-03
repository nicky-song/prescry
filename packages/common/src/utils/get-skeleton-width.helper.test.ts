// Copyright 2022 Prescryptive Health, Inc.

import { SkeletonWidth } from '../theming/fonts';
import { getSkeletonWidth } from './get-skeleton-width.helper';

describe('getSkeletonWidth', () => {
  const shorter: SkeletonWidth = 'shorter';
  const short: SkeletonWidth = 'short';
  const medium: SkeletonWidth = 'medium';
  const long: SkeletonWidth = 'long';

  it.each([
    [shorter, 50],
    [short, 100],
    [medium, 150],
    [long, 200],
    [undefined, 100],
  ])(
    'should return the correct skeleton width for %p',
    (isSkeletonMock: SkeletonWidth | undefined, expectedWidth: number) => {
      const result = getSkeletonWidth(isSkeletonMock);

      expect(result).toEqual(expectedWidth);
    }
  );
});

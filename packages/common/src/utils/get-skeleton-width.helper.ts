// Copyright 2022 Prescryptive Health, Inc.

import { SkeletonWidth } from '../theming/fonts';

export const getSkeletonWidth = (width?: SkeletonWidth): number => {
  const shorter = 50;
  const short = 100;
  const medium = 150;
  const long = 200;

  switch (width) {
    case 'shorter':
      return shorter;
    case 'short':
      return short;
    case 'medium':
      return medium;
    case 'long':
      return long;
    default:
      return short;
  }
};

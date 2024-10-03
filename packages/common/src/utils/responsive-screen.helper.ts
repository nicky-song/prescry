// Copyright 2021 Prescryptive Health, Inc.

import { Dimensions } from 'react-native';

export const isDesktopDevice = () => {
  return !/iPhone|iPad|Android/i.test(navigator.userAgent);
};

export const getContainerHeightMinusHeader = () =>
  Dimensions.get('window').height - 80;

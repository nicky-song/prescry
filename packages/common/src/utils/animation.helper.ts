// Copyright 2018 Prescryptive Health, Inc.

import { Animated } from 'react-native';

export function animateOpacity(
  animatedValue: Animated.Value,
  duration: number,
  toValue: number,
  startAction?: () => void
) {
  Animated.timing(animatedValue, {
    duration,
    toValue,
    useNativeDriver: false,
  }).start(startAction);
}

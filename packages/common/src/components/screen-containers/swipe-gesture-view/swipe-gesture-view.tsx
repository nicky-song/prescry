// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, FunctionComponent } from 'react';
import {
  View,
  PanResponder,
  ViewStyle,
  GestureResponderEvent,
  PanResponderGestureState,
  StyleProp,
} from 'react-native';

export interface ISwipeGestureProps {
  viewStyle?: StyleProp<ViewStyle>;
  onSwipe: (direction: SwipeDirection) => void;
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export const SwipeGestureView: FunctionComponent<ISwipeGestureProps> = ({
  viewStyle,
  onSwipe,
  children,
}): ReactElement => {
  const onStartShouldSetPanResponder = () => true;

  const onPanResponderRelease = (
    _: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => {
    const x = gestureState.dx;
    const y = gestureState.dy;
    if (x !== y) {
      if (Math.abs(x) > Math.abs(y)) {
        if (x >= 0) {
          onSwipe('right');
        } else {
          onSwipe('left');
        }
      } else {
        if (y >= 0) {
          onSwipe('down');
        } else {
          onSwipe('up');
        }
      }
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder,
    onPanResponderRelease,
  });

  return (
    <View {...panResponder.panHandlers} style={viewStyle}>
      {children}
    </View>
  );
};

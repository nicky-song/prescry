// Copyright 2021 Prescryptive Health, Inc.

import React, { useRef, useEffect, ReactElement } from 'react';
import { ViewStyle, StyleProp, Animated, Easing } from 'react-native';

export type FadeType = 'fade-in' | 'fade-out';

interface IFadeViewProps {
  readonly children?: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly type: FadeType;
  readonly duration?: number;
  readonly pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  readonly delay?: number;
  readonly onFinished?: () => void;
}

export const FadeView = (props: IFadeViewProps): ReactElement => {
  const {
    style,
    type,
    duration = 500,
    pointerEvents,
    delay = 5000,
    onFinished,
  } = props;
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  const opacityAnim = type === 'fade-in' ? fadeInAnim : fadeOutAnim;

  useEffect(() => {
    const endingOpacity = type === 'fade-in' ? 1 : 0;
    Animated.timing(opacityAnim, {
      toValue: endingOpacity,
      delay,
      duration,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start(() => {
      if (onFinished) {
        onFinished();
      }
    });
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[style, { opacity: opacityAnim }]}
      pointerEvents={pointerEvents}
    >
      {props.children}
    </Animated.View>
  );
};

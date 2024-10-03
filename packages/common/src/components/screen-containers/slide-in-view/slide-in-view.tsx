// Copyright 2021 Prescryptive Health, Inc.

import React, {
  useRef,
  useState,
  useEffect,
  ReactElement,
  FunctionComponent,
} from 'react';
import { ViewStyle, StyleProp, Animated, Easing } from 'react-native';

export type Origin = 'left' | 'right' | 'top' | 'bottom';

export interface ISlideInViewProps {
  viewStyle?: StyleProp<ViewStyle>;
  isOpen?: boolean;
  slideInValue: number;
  slideOutValue: number;
  duration?: number;
  direction?: Origin;
  animationFinished?: (isOpen: string) => void;
}

export const SlideInView: FunctionComponent<ISlideInViewProps> = ({
  viewStyle,
  isOpen,
  slideOutValue,
  slideInValue,
  duration,
  direction,
  children,
  animationFinished,
}): ReactElement => {
  const slideIn = useRef(new Animated.Value(slideInValue)).current;
  const slideOut = useRef(new Animated.Value(slideOutValue)).current;
  const [currentState, setCurrentState] = useState<Animated.Value>(slideIn);
  const [initialDisplayStyle, initialDisplayStyleSet] = useState<ViewStyle>({
    display: 'none',
  });

  const getTargetMargin = (origin: Origin) => {
    switch (origin) {
      case 'left':
        return { left: currentState };
      case 'right':
        return { right: currentState };
      case 'top':
        return { top: currentState };
      case 'bottom':
        return { bottom: currentState };
    }
  };

  const animationDuration = duration ?? 600;
  const targetedMargin = direction
    ? getTargetMargin(direction)
    : getTargetMargin('right');

  useEffect(() => {
    if (isOpen) {
      setCurrentState(slideIn);
      Animated.timing(slideIn, {
        toValue: slideOutValue,
        duration: animationDuration,
        useNativeDriver: false,
        easing: Easing.exp,
      }).start(() => {
        slideOut.setValue(slideOutValue);
        if (animationFinished) {
          animationFinished('opened');
        }
      });
    } else {
      setCurrentState(slideOut);
      Animated.timing(slideOut, {
        toValue: slideInValue,
        duration: animationDuration,
        useNativeDriver: false,
        easing: Easing.exp,
      }).start(() => {
        slideIn.setValue(slideInValue);
        if (animationFinished) {
          animationFinished('closed');
        }
      });
    }
  }, [isOpen]);

  useEffect(() => {
    setTimeout(
      () => initialDisplayStyleSet({ display: 'flex' }),
      animationDuration
    );
  }, []);

  return (
    <Animated.View style={[viewStyle, targetedMargin, initialDisplayStyle]}>
      {children}
    </Animated.View>
  );
};

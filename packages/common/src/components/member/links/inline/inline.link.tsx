// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode, useState } from 'react';
import { TextStyle, StyleProp } from 'react-native';
import { BaseText } from '../../../text/base-text/base-text';
import { inlineLinkStyles } from './inline.link.styles';

export interface IInlineLinkProps {
  children: ReactNode;
  disabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
  onPress: () => void;
  testID?: string;
  inheritStyle?: boolean;
  isSkeleton?: boolean;
}

export const InlineLink = ({
  children,
  disabled,
  textStyle,
  testID,
  inheritStyle,
  isSkeleton,
  onPress,
}: IInlineLinkProps): ReactElement => {
  const [isPressAnimating, setIsPressAnimating] = useState(false);

  const statusTextStyle: TextStyle = disabled
    ? inlineLinkStyles.disabledTextStyle
    : inlineLinkStyles.enabledTextStyle;

  const onPressAnimator = () => {
    const pressAnimationMilliseconds = 200;

    setIsPressAnimating(true);
    setTimeout(() => {
      onPress();
      setIsPressAnimating(false);
    }, pressAnimationMilliseconds);
  };

  const onLinkPress = disabled ? undefined : onPressAnimator;

  const pressTextStyle = isPressAnimating ? { opacity: 0.5 } : undefined;

  const accessibilityRole = disabled ? undefined : 'link';

  return (
    <BaseText
      style={[statusTextStyle, textStyle, pressTextStyle]}
      accessibilityRole={accessibilityRole}
      testID={testID}
      onPress={onLinkPress}
      inheritStyle={inheritStyle}
      isSkeleton={isSkeleton}
    >
      {children}
    </BaseText>
  );
};

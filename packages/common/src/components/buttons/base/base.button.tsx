// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { SkeletonWidth } from '../../../theming/fonts';
import { getSkeletonCustomColor } from '../../../utils/get-skeleton-custom-color.helper';
import { getSkeletonFontSize } from '../../../utils/get-skeleton-font-size.helper';
import { getSkeletonHighlightColor } from '../../../utils/get-skeleton-highlight-color';
import { getSkeletonWidth } from '../../../utils/get-skeleton-width.helper';
import { SkeletonBone } from '../../primitives/skeleton-bone';
import { BaseText } from '../../text/base-text/base-text';
import { baseButtonStyles } from './base.button.styles';

export type ButtonSize = 'large' | 'medium';

export interface IBaseButtonProps extends TouchableOpacityProps {
  viewStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  disabled?: boolean;
  size?: ButtonSize;
  children: ReactNode;
  isSkeleton?: boolean;
  skeletonWidth?: SkeletonWidth;
  testID?: string;
}

export const BaseButton = ({
  viewStyle,
  textStyle,
  disabled = false,
  children,
  size = 'large',
  onPress,
  isSkeleton,
  skeletonWidth,
  testID,
  ...props
}: IBaseButtonProps): ReactElement => {
  const defaultViewStyle = getViewStyle(size, disabled);
  const defaultTextStyle = getTextStyle(size, disabled);
  const defaultSkeletonWidth = (size: ButtonSize): SkeletonWidth =>
    size === 'large' ? 'long' : 'short';

  const onTouchableOpacityPress = (_: GestureResponderEvent) => {
    if (onPress) {
      onPress();
    }
  };

  const skeletonHeight = isSkeleton
    ? getSkeletonFontSize(textStyle, defaultTextStyle)
    : undefined;

  const customBoneColor = isSkeleton
    ? getSkeletonCustomColor(viewStyle, defaultViewStyle)
    : undefined;

  const customHighlightColor = isSkeleton
    ? getSkeletonHighlightColor(textStyle, defaultTextStyle)
    : undefined;

  const skeletonButton = (
    <SkeletonBone
      containerViewStyle={[defaultViewStyle, viewStyle]}
      layoutViewStyleList={[
        {
          width: getSkeletonWidth(skeletonWidth ?? defaultSkeletonWidth(size)),
          height: skeletonHeight,
        },
      ]}
      boneColor={customBoneColor}
      highlightColor={customHighlightColor}
    />
  );

  return isSkeleton ? (
    skeletonButton
  ) : (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      style={[defaultViewStyle, viewStyle]}
      accessibilityRole='button'
      onPress={onTouchableOpacityPress}
      {...(testID && { testID })}
      {...props}
    >
      <BaseText style={[defaultTextStyle, textStyle]}>{children}</BaseText>
    </TouchableOpacity>
  );
};

const getViewStyle = (size: ButtonSize, disabled: boolean): ViewStyle => {
  switch (size) {
    case 'medium': {
      return getMediumViewStyle(disabled);
    }
    default: {
      return getLargeViewStyle(disabled);
    }
  }
};

const getMediumViewStyle = (disabled: boolean): ViewStyle =>
  disabled
    ? baseButtonStyles.disabledMediumViewStyle
    : baseButtonStyles.enabledMediumViewStyle;

const getLargeViewStyle = (disabled: boolean): ViewStyle =>
  disabled
    ? baseButtonStyles.disabledLargeViewStyle
    : baseButtonStyles.enabledLargeViewStyle;

const getTextStyle = (size: ButtonSize, disabled: boolean): TextStyle => {
  switch (size) {
    case 'medium': {
      return getMediumTextStyle(disabled);
    }
    default: {
      return getLargeTextStyle(disabled);
    }
  }
};

const getMediumTextStyle = (disabled: boolean): TextStyle =>
  disabled
    ? baseButtonStyles.disabledMediumTextStyle
    : baseButtonStyles.enabledMediumTextStyle;

const getLargeTextStyle = (disabled: boolean): TextStyle =>
  disabled
    ? baseButtonStyles.disabledLargeTextStyle
    : baseButtonStyles.enabledLargeTextStyle;

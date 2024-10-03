// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent, ReactElement, ReactNode } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { BaseButton, ButtonSize, IBaseButtonProps } from '../base/base.button';
import { secondaryButtonStyles } from './secondary.button.styles';
export interface ISecondaryButtonProps
  extends Omit<IBaseButtonProps, 'textStyle'> {
  children: ReactNode;
}
export const SecondaryButton: FunctionComponent<ISecondaryButtonProps> = ({
  disabled = false,
  size = 'large',
  viewStyle,
  ...props
}): ReactElement => {
  const defaultViewStyle = getViewStyle(size, disabled);
  const defaultTextStyle = getTextStyle(size, disabled);

  return (
    <BaseButton
      {...props}
      size={size}
      disabled={disabled}
      viewStyle={[defaultViewStyle, viewStyle]}
      textStyle={defaultTextStyle}
    />
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
    ? secondaryButtonStyles.disabledMediumViewStyle
    : secondaryButtonStyles.enabledMediumViewStyle;

const getLargeViewStyle = (disabled: boolean): ViewStyle =>
  disabled
    ? secondaryButtonStyles.disabledLargeViewStyle
    : secondaryButtonStyles.enabledLargeViewStyle;

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
    ? secondaryButtonStyles.disabledMediumTextStyle
    : secondaryButtonStyles.enabledMediumTextStyle;

const getLargeTextStyle = (disabled: boolean): TextStyle =>
  disabled
    ? secondaryButtonStyles.disabledLargeTextStyle
    : secondaryButtonStyles.enabledLargeTextStyle;

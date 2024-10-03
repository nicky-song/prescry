// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent, ReactElement, ReactNode } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { BaseButton, IBaseButtonProps } from '../base/base.button';
import { squareButtonStyles } from './square.button.styles';

export type ButtonRank = 'primary' | 'secondary';

export interface ISquareButtonProps
  extends Omit<IBaseButtonProps, 'textStyle' | 'size'> {
  rank?: ButtonRank;
  isSkeleton?: boolean;
  children: ReactNode;
}
export const SquareButton: FunctionComponent<ISquareButtonProps> = ({
  disabled = false,
  rank = 'primary',
  isSkeleton,
  viewStyle,
  ...props
}): ReactElement => {
  const defaultViewStyle = getViewStyle(rank, disabled);
  const defaultTextStyle = getTextStyle(rank, disabled);

  return (
    <BaseButton
      {...props}
      size={'medium'}
      disabled={disabled}
      viewStyle={[defaultViewStyle, viewStyle]}
      textStyle={defaultTextStyle}
      isSkeleton={isSkeleton}
      skeletonWidth='short'
    />
  );
};

const getViewStyle = (rank: ButtonRank, disabled: boolean): ViewStyle => {
  switch (rank) {
    case 'secondary': {
      return getSecondaryViewStyle(disabled);
    }
    default: {
      return getPrimaryViewStyle(disabled);
    }
  }
};

const getPrimaryViewStyle = (disabled: boolean): ViewStyle =>
  disabled
    ? squareButtonStyles.disabledPrimaryViewStyle
    : squareButtonStyles.enabledPrimaryViewStyle;

const getSecondaryViewStyle = (disabled: boolean): ViewStyle =>
  disabled
    ? squareButtonStyles.disabledSecondaryViewStyle
    : squareButtonStyles.enabledSecondaryViewStyle;

const getTextStyle = (rank: ButtonRank, disabled: boolean): TextStyle => {
  switch (rank) {
    case 'secondary': {
      return getSecondaryTextStyle(disabled);
    }
    default: {
      return getPrimaryTextStyle(disabled);
    }
  }
};

const getSecondaryTextStyle = (disabled: boolean): TextStyle =>
  disabled
    ? squareButtonStyles.disabledSecondaryTextStyle
    : squareButtonStyles.enabledSecondaryTextStyle;

const getPrimaryTextStyle = (disabled: boolean): TextStyle =>
  disabled
    ? squareButtonStyles.disabledPrimaryTextStyle
    : squareButtonStyles.enabledPrimaryTextStyle;

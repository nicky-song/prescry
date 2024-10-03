// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { goBackButtonStyles } from './go-back.button.styles';
import { IconButton, IIconButtonProps } from '../icon/icon.button';

export type IGoBackButtonProps = Omit<
  IIconButtonProps,
  'iconTextStyle' | 'iconName' | 'size'
>;

export const GoBackButton = ({ viewStyle, ...props }: IGoBackButtonProps) => {
  return (
    <IconButton
      iconName='chevron-left'
      size='large'
      viewStyle={[goBackButtonStyles.viewStyle, viewStyle]}
      {...props}
      testID='goBackButton'
    />
  );
};

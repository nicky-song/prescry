// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { BaseButton, IBaseButtonProps } from '../base/base.button';
import { linkButtonStyles } from './link.button.styles';

export interface ILinkButtonProps extends Omit<IBaseButtonProps, 'children'> {
  linkText: string;
  onPress: () => void;
}

export const LinkButton = ({
  disabled,
  viewStyle,
  textStyle,
  linkText,
  ...props
}: ILinkButtonProps): ReactElement => {
  const {
    baseViewStyle,
    baseTextStyle,
    enabledTextStyle,
    disabledTextStyle,
  } = linkButtonStyles;

  const statusTextStyle = disabled ? disabledTextStyle : enabledTextStyle;

  return (
    <BaseButton
      {...props}
      children={linkText}
      disabled={disabled}
      viewStyle={[baseViewStyle, viewStyle]}
      textStyle={[baseTextStyle, statusTextStyle, textStyle]}
    />
  );
};

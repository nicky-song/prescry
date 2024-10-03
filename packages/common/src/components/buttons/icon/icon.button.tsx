// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { BaseButton, IBaseButtonProps } from '../base/base.button';
import { iconButtonStyle } from './icon.button.styles';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';

export interface IIconButtonProps extends Omit<IBaseButtonProps, 'children'> {
  iconName: string;
  iconTextStyle?: StyleProp<TextStyle>;
  viewStyle?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  onPress: () => void;
  iconSolid?: boolean;
}

export const IconButton = ({
  viewStyle,
  disabled,
  iconName,
  iconTextStyle,
  iconSolid,
  ...props
}: IIconButtonProps): ReactElement => {
  const defaultIconTextStyle = disabled
    ? iconButtonStyle.iconDisabledTextStyle
    : iconButtonStyle.iconTextStyle;
  const defaultButtonViewStyle = disabled
    ? iconButtonStyle.iconButtonDisabledViewStyle
    : iconButtonStyle.iconButtonViewStyle;
  return (
    <BaseButton
      disabled={disabled}
      viewStyle={[defaultButtonViewStyle, viewStyle]}
      {...props}
    >
      <FontAwesomeIcon
        name={iconName}
        style={[defaultIconTextStyle, iconTextStyle]}
        solid={iconSolid}
      />
    </BaseButton>
  );
};

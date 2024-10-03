// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { toolButtonStyles } from './tool.button.styles';
import { BaseText } from '../../text/base-text/base-text';
import { TextStyle, StyleProp } from 'react-native';
import { BaseButton, IBaseButtonProps } from '../base/base.button';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { IconSize } from '../../../theming/icons';
import { TranslatableBaseText } from '../../text/translated-base-text/translatable-base-text';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';

export interface IToolButtonProps extends IBaseButtonProps {
  children: ReactNode;
  iconName: string;
  iconSize?: number;
  iconTextStyle?: StyleProp<TextStyle>;
  onPress: () => void;
  translateContent?: boolean;
}

export const ToolButton = ({
  children,
  disabled,
  viewStyle,
  textStyle,
  iconName,
  iconSize,
  iconTextStyle,
  translateContent,
  ...props
}: IToolButtonProps): ReactElement => {
  const iconStyle = disabled
    ? toolButtonStyles.iconDisabledTextStyle
    : [toolButtonStyles.iconTextStyle, iconTextStyle];

  const buttonStyle = disabled
    ? toolButtonStyles.toolButtonDisabledTextStyle
    : toolButtonStyles.toolButtonTextStyle;

  const fontAwesomeIconSize = iconSize ? iconSize : IconSize.medium;

  const baseTextStyle = [buttonStyle, textStyle];

  return (
    <BaseButton
      disabled={disabled}
      viewStyle={[toolButtonStyles.rowContainerViewStyle, viewStyle]}
      {...props}
    >
      <FontAwesomeIcon
        name={iconName}
        style={iconStyle}
        size={fontAwesomeIconSize}
      />
      {translateContent === undefined ? (
        <BaseText style={baseTextStyle}>{children}</BaseText>
      ) : translateContent ? (
        <TranslatableBaseText style={baseTextStyle}>
          {children}
        </TranslatableBaseText>
      ) : (
        <ProtectedBaseText style={baseTextStyle}>{children}</ProtectedBaseText>
      )}
    </BaseButton>
  );
};

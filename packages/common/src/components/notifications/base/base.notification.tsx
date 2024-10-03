// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../../text/base-text/base-text';
import { baseNotificationStyles } from './base.notification.styles';

export interface IBaseNotificationProps {
  message: string;
  onClose?: () => void;
  iconName?: string;
  iconColor?: string;
  iconSize?: number;
  iconTextStyle?: StyleProp<TextStyle>;
  iconSolid?: boolean;
  isSkeleton?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  messageTextStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const BaseNotification = ({
  message,
  onClose,
  iconName,
  iconColor,
  iconSize,
  iconTextStyle,
  iconSolid,
  isSkeleton,
  viewStyle,
  messageTextStyle,
  testID,
}: IBaseNotificationProps): ReactElement => {
  const { closeButtonViewStyle } = baseNotificationStyles;

  const icon =
    iconName && iconColor && iconSize ? (
      <FontAwesomeIcon
        name={iconName}
        style={[baseNotificationStyles.iconTextStyle, iconTextStyle]}
        solid={iconSolid}
        color={iconColor}
        size={iconSize}
      />
    ) : null;

  const messageText = (
    <BaseText
      isSkeleton={isSkeleton}
      style={[baseNotificationStyles.messageTextStyle, messageTextStyle]}
    >
      {message}
    </BaseText>
  );

  const closeButton = onClose ? (
    <TouchableOpacity onPress={onClose} style={closeButtonViewStyle}>
      <FontAwesomeIcon
        name='times'
        solid={true}
        color={GrayScaleColor.secondaryGray}
        size={IconSize.regular}
      />
    </TouchableOpacity>
  ) : null;

  return (
    <View style={[baseNotificationStyles.viewStyle, viewStyle]} testID={testID}>
      {icon}
      {messageText}
      {closeButton}
    </View>
  );
};

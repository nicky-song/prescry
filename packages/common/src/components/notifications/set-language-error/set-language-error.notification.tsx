// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { NotificationColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { BaseNotification } from '../base/base.notification';
import { setLanguageErrorNotificationStyles } from './set-language-error.notification.styles';

export interface ISetLanguageErrorNotificationProps {
  onClose: () => void;
  viewStyle?: StyleProp<ViewStyle>;
  notificationViewStyle?: StyleProp<ViewStyle>;
  isSkeleton?: boolean;
}

export const SetLanguageErrorNotification = ({
  onClose,
  viewStyle,
  notificationViewStyle,
}: ISetLanguageErrorNotificationProps): ReactElement => {

  const groupKey = CmsGroupKey.global;
  const { content, isContentLoading } = useContent<IGlobalContent>(groupKey, 2);
  const message = content.setLanguageError;

  const iconName = 'exclamation-circle';
  const iconColor = NotificationColor.red;
  const iconSize = IconSize.regular;

  const baseNotification = (
    <BaseNotification
      message={message}
      iconName={iconName}
      iconColor={iconColor}
      iconSize={iconSize}
      viewStyle={[
        setLanguageErrorNotificationStyles.notificationViewStyle,
        notificationViewStyle,
      ]}
      isSkeleton={isContentLoading}
      onClose={onClose}
    />
  );

  return <View style={viewStyle}>{baseNotification}</View>;
};

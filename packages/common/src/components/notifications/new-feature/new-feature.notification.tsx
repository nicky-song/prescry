// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { NotificationColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { BaseNotification } from '../base/base.notification';

export interface INewFeatureNotificationProps {
  onClose: () => void;
  showNotification?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  notificationViewStyle?: StyleProp<ViewStyle>;
}

export const NewFeatureNotification = ({
  onClose,
  viewStyle,
  notificationViewStyle,
}: INewFeatureNotificationProps): ReactElement => {
  const globalKey = CmsGroupKey.global;
  const { content, isContentLoading } = useContent<IGlobalContent>(
    globalKey,
    2
  );
  const message = content.newFavoritedPharmaciesFeature;
  const iconName = 'heart';
  const iconColor = NotificationColor.heartRed;
  const iconSize = IconSize.regular;

  const baseNotification = (
    <BaseNotification
      message={message}
      onClose={onClose}
      iconName={iconName}
      iconColor={iconColor}
      iconSize={iconSize}
      viewStyle={notificationViewStyle}
      isSkeleton={isContentLoading}
    />
  );

  return <View style={viewStyle}>{baseNotification}</View>;
};

// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { NotificationColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { BaseNotification } from '../base/base.notification';
import { unfavoritedPharmacyNotificationStyles } from './unfavorited-pharmacy.notification.styles';

export interface IUnfavoritedPharmacyNotificationProps {
  viewStyle?: StyleProp<ViewStyle>;
  notificationViewStyle?: StyleProp<ViewStyle>;
  isSkeleton?: boolean;
}

export const UnfavoritedPharmacyNotification = ({
  viewStyle,
  notificationViewStyle,
}: IUnfavoritedPharmacyNotificationProps): ReactElement => {
  const groupKey = CmsGroupKey.global;
  const { content, isContentLoading } = useContent<IGlobalContent>(groupKey, 2);
  const message = content.favoritePharmacyUnsaved;
  const iconName = 'check';
  const iconColor = NotificationColor.green;
  const iconSize = IconSize.regular;

  const baseNotification = (
    <BaseNotification
      message={message}
      iconName={iconName}
      iconColor={iconColor}
      iconSize={iconSize}
      viewStyle={[
        unfavoritedPharmacyNotificationStyles.notificationViewStyle,
        notificationViewStyle,
      ]}
      isSkeleton={isContentLoading}
      testID='unFavoritedPharmacyNotificationBaseNotification'
    />
  );

  return <View style={viewStyle}>{baseNotification}</View>;
};

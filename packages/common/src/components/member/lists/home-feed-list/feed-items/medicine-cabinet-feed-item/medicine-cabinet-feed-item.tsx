// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { medicineCabinetNavigateDispatch } from '../../../../../../experiences/guest-experience/store/navigation/dispatch/medicine-cabinet-navigate.dispatch';
import { IFeedContext } from '../../../../../../models/api-response/feed-response';
import { TitleDescriptionCardItem } from '../../../../items/title-description-card-item/title-description-card-item';
import { MedicineCabinetNavigationProp } from './../../../../../../experiences/guest-experience/navigation/stack-navigators/root/root.stack-navigator';

export interface IMedicineCabinetFeedItemDataProps {
  viewStyle?: StyleProp<ViewStyle>;
  context?: IFeedContext;
  code?: string;
  title?: string;
  description?: string;
}

export const MedicineCabinetFeedItem = ({
  code: _code,
  title,
  description,
  context: _context,
  ...props
}: IMedicineCabinetFeedItemDataProps) => {
  const navigation = useNavigation<MedicineCabinetNavigationProp>();
  const onMedicineCabinetPress = () =>
    medicineCabinetNavigateDispatch(navigation);

  return (
    <TitleDescriptionCardItem
      title={title}
      description={description}
      onPress={onMedicineCabinetPress}
      {...props}
    />
  );
};

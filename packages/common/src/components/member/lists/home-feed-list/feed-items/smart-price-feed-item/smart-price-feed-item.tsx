// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../../../../experiences/guest-experience/navigation/stack-navigators/root/root.stack-navigator';
import { TitleDescriptionCardItem } from '../../../../items/title-description-card-item/title-description-card-item';

export interface ISmartPriceFeedItemDataProps {
  viewStyle?: StyleProp<ViewStyle>;
  serviceType?: string;
  code?: string;
  title?: string;
  description?: string;
}

export const SmartPriceFeedItem = ({
  serviceType,
  code,
  title,
  description,
  ...props
}: ISmartPriceFeedItemDataProps) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const navigateToSmartPriceScreen = () => {
    navigation.navigate('SmartPrice');
  };
  return (
    <TitleDescriptionCardItem
      code={code}
      title={title}
      description={description}
      onPress={navigateToSmartPriceScreen}
      serviceType={serviceType}
      {...props}
    />
  );
};

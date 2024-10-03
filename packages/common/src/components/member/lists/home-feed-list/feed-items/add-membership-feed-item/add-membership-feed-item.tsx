// Copyright 2020 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { RootStackNavigationProp } from '../../../../../../experiences/guest-experience/navigation/stack-navigators/root/root.stack-navigator';
import { TitleDescriptionCardItem } from '../../../../items/title-description-card-item/title-description-card-item';

export interface IAddMembershipFeedItemDataProps {
  viewStyle?: StyleProp<ViewStyle>;
  code?: string;
  title?: string;
  description?: string;
}

export const AddMembershipFeedItem = ({
  title,
  code,
  description,
  viewStyle,
}: IAddMembershipFeedItemDataProps) => {
  const navigation = useNavigation<RootStackNavigationProp>();

  const onPress = () => navigation.navigate('Login', {});

  return (
    <TitleDescriptionCardItem
      code={code}
      title={title}
      description={description}
      onPress={onPress}
      viewStyle={viewStyle}
      testID='homeFeedItem-addMembershipFeedItem'
    />
  );
};

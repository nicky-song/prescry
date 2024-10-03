// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { IFeedContext } from '../../../../../../models/api-response/feed-response';
import { IStaticFeedContextServiceItem } from '../../../../../../models/static-feed';
import { TitleDescriptionCardItem } from '../../../../items/title-description-card-item/title-description-card-item';
import { RootStackNavigationProp } from '../../../../../../experiences/guest-experience/navigation/stack-navigators/root/root.stack-navigator';
import { useNavigation } from '@react-navigation/native';
export interface ICustomFeedItemDataProps {
  viewStyle: StyleProp<ViewStyle>;
  code?: string;
  context?: IFeedContext;
}

export interface ICustomFeedItemDispatchProps {
  navigateAction: (
    navigation: RootStackNavigationProp,
    serviceType?: string,
    services?: IStaticFeedContextServiceItem[]
  ) => void;
}

export const CustomFeedItem = ({
  navigateAction,
  code,
  ...props
}: ICustomFeedItemDataProps & ICustomFeedItemDispatchProps) => {
  const title = props.context?.defaultContext?.title;
  const description = props.context?.defaultContext?.description;
  const serviceType = props.context?.defaultContext?.serviceType;
  const services = props.context?.defaultContext?.services;
  const navigation = useNavigation<RootStackNavigationProp>();

  const onFeedItemPress = (_?: string, serType?: string) => {
    serType
      ? navigateAction(navigation, serType)
      : navigateAction(navigation, undefined, services);
  };

  return (
    <TitleDescriptionCardItem
      code={code}
      title={title}
      description={description}
      onPress={onFeedItemPress}
      serviceType={serviceType}
      {...props}
    />
  );
};

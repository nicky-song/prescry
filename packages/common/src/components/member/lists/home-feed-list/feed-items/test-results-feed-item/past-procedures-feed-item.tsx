// Copyright 2020 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { RootStackNavigationProp } from '../../../../../../experiences/guest-experience/navigation/stack-navigators/root/root.stack-navigator';
import { navigatePastProceduresListDispatch } from '../../../../../../experiences/guest-experience/store/navigation/dispatch/navigate-past-procedures-list.dispatch';
import { IFeedContext } from '../../../../../../models/api-response/feed-response';
import { TitleDescriptionCardItem } from '../../../../items/title-description-card-item/title-description-card-item';

export interface IPastProceduresFeedItemDataProps {
  viewStyle?: StyleProp<ViewStyle>;
  context?: IFeedContext;
  code?: string;
  title?: string;
  description?: string;
}

export const PastProceduresFeedItem = ({
  code,
  title,
  description,
  context: _context,
  ...props
}: IPastProceduresFeedItemDataProps) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const onPastProceduresPress = () =>
    navigatePastProceduresListDispatch(navigation);

  return (
    <TitleDescriptionCardItem
      code={code}
      title={title}
      description={description}
      onPress={onPastProceduresPress}
      {...props}
    />
  );
};

// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { IDefaultViewProps } from '../../primitives/default-view';
import { ListItem } from '../../primitives/list-item';

export interface ICardContainerProps
  extends Omit<IDefaultViewProps, 'accessibilityRole'> {
  isSingleton?: boolean;
}

export const CardContainer = ({
  isSingleton,
  ...props
}: ICardContainerProps): ReactElement => {
  return isSingleton ? <View {...props} /> : <ListItem {...props} />;
};

// Copyright 2020 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import { Heading } from '../../heading/heading';
import { titleContainerListStyles } from './title-container-list.styles';

export interface ITitleContainerListProps {
  title: string;
  children: React.ReactNode;
  viewStyle?: StyleProp<ViewStyle>;
}

export const TitleContainerList = ({
  title,
  viewStyle,
  children,
}: ITitleContainerListProps): ReactElement => {
  return (
    <View style={viewStyle} testID='TitleContainerList'>
      <Heading level={2} textStyle={titleContainerListStyles.titleTextStyle}>
        {title}
      </Heading>
      {children}
    </View>
  );
};

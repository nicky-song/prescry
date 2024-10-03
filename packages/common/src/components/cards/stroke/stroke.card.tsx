// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, StyleProp } from 'react-native';
import React, { ReactElement, ReactNode } from 'react';
import { strokeCardStyles } from './stroke.card.styles';
import { CardContainer } from '../../containers/card/card.container';

export interface IStrokeCardProps {
  viewStyle?: StyleProp<ViewStyle>;
  isSingleton?: boolean;
  testID?: string;
  children: ReactNode;
}

export const StrokeCard = ({
  viewStyle,
  isSingleton,
  testID,
  children,
}: IStrokeCardProps): ReactElement => {
  return (
    <CardContainer
      isSingleton={isSingleton}
      style={[strokeCardStyles.viewStyle, viewStyle]}
      testID={testID}
    >
      {children}
    </CardContainer>
  );
};

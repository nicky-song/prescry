// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { footerContentContainerStyles } from './footer-content.container.styles';

export interface IFooterContentContainerProps {
  viewStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
  testID?: string;
}

export const FooterContentContainer = ({
  children,
  viewStyle,
  testID = 'FooterContentContainer',
}: IFooterContentContainerProps): ReactElement => {
  return (
    <View
      style={[footerContentContainerStyles.viewStyle, viewStyle]}
      testID={testID}
    >
      {children}
    </View>
  );
};

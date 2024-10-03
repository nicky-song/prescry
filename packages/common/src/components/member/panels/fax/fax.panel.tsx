// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { BaseText } from '../../../text/base-text/base-text';
import { ProtectedBaseText } from '../../../text/protected-base-text/protected-base-text';
import { faxPanelContent } from './fax.panel.content';
import { faxPanelStyles } from './fax.panel.styles';

export interface IFaxPanelProps {
  viewStyle?: StyleProp<ViewStyle>;
}

export const FaxPanel = ({ viewStyle }: IFaxPanelProps): ReactElement => {
  const content = faxPanelContent;
  const styles = faxPanelStyles;

  return (
    <View style={viewStyle} testID='FaxPanel'>
      <BaseText>{content.label}</BaseText>
      <ProtectedBaseText style={styles.faxNumberTextStyle}>
        {content.faxNumber}
      </ProtectedBaseText>
    </View>
  );
};

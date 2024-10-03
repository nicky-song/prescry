// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { ProtectedView } from '../../../containers/protected-view/protected-view';
import { BaseText } from '../../../text/base-text/base-text';
import { paperClaimsPanelContent } from './paper-claims.panel.content';
import { paperClaimsPanelStyles } from './paper-claims.panel.styles';

export interface IPaperClaimsPanelProps {
  viewStyle?: StyleProp<ViewStyle>;
}

export const PaperClaimsPanel = ({
  viewStyle,
}: IPaperClaimsPanelProps): ReactElement => {
  const content = paperClaimsPanelContent;
  const styles = paperClaimsPanelStyles;

  return (
    <View style={viewStyle} testID='PaperClaimsPanel'>
      <BaseText>{content.title}</BaseText>
      <ProtectedView testID='address' style={styles.addressViewStyle}>
        <BaseText style={styles.addressTextStyle}>{content.phx}</BaseText>
        <BaseText style={styles.addressTextStyle}>{content.attention}</BaseText>
        <BaseText style={styles.addressTextStyle}>{content.postalBox}</BaseText>
        <BaseText style={styles.addressTextStyle}>
          {content.cityStateZip}
        </BaseText>
      </ProtectedView>
    </View>
  );
};

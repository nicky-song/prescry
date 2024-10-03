// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import { BaseText } from '../../../text/base-text/base-text';
import { pricingOptionInformativePanelStyles } from './pricing-option-informative.panel.styles';
import { ConfirmedAmountText } from '../../../text/confirmed-amount/confirmed-amount.text';
import { MoneyFormatter } from '../../../../utils/formatters/money-formatter';

export interface IPricingOptionInformativePanelProps {
  title: string;
  subText: string;
  memberPays: number;
  isSkeleton?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const PricingOptionInformativePanel = ({
  title,
  subText,
  memberPays,
  isSkeleton = false,
  viewStyle,
  testID = 'pricingOptionInformativePanel',
}: IPricingOptionInformativePanelProps): ReactElement => {
  const { panelViewStyle, titleViewStyle, titleTextStyle, subTextStyle } =
    pricingOptionInformativePanelStyles;

  const memberPaysPrice = MoneyFormatter.format(memberPays);

  const headerView = (
    <View style={titleViewStyle}>
      <BaseText style={titleTextStyle} isSkeleton={isSkeleton}>
        {title}
      </BaseText>
      <ConfirmedAmountText style={titleTextStyle} isSkeleton={isSkeleton}>
        {memberPaysPrice}
      </ConfirmedAmountText>
    </View>
  );

  return (
    <View style={[viewStyle, panelViewStyle]} testID={testID}>
      {headerView}
      <BaseText style={subTextStyle} isSkeleton={isSkeleton}>
        {subText}
      </BaseText>
    </View>
  );
};

// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { pricingOptionButtonStyle } from './pricing-option.button.styles';
import { BaseText } from '../../text/base-text/base-text';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';

export interface IPricingOptionButtonProps {
  title: string;
  subText: string;
  memberPays: number;
  isSelected?: boolean;
  onPress: () => void;
  isSkeleton?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const PricingOptionButton = ({
  title,
  subText,
  memberPays,
  isSelected = false,
  onPress,
  isSkeleton = false,
  viewStyle,
  testID = 'pricingOptionButton',
}: IPricingOptionButtonProps): ReactElement => {
  const {
    rowViewStyle,
    rowViewActiveStyle,
    rowViewInactiveStyle,
    titleTextStyle,
    subTextStyle,
    priceTextStyle,
    titleContainerViewStyle,
  } = pricingOptionButtonStyle;

  const formattedMemberPays = MoneyFormatter.format(memberPays);

  const onTouchablePress = () => {
    onPress();
  };

  return (
    <TouchableOpacity
      accessibilityRole='radio'
      testID={testID}
      style={[
        viewStyle,
        rowViewStyle,
        isSelected ? rowViewActiveStyle : rowViewInactiveStyle,
      ]}
      onPress={onTouchablePress}
    >
      <View style={titleContainerViewStyle}>
        <BaseText
          style={titleTextStyle}
          isSkeleton={isSkeleton}
          skeletonWidth='long'
        >
          {title}
        </BaseText>
        <ProtectedBaseText style={priceTextStyle} isSkeleton={isSkeleton}>
          {formattedMemberPays}
        </ProtectedBaseText>
      </View>
      <View>
        <BaseText style={subTextStyle} isSkeleton={isSkeleton}>
          {subText}
        </BaseText>
      </View>
    </TouchableOpacity>
  );
};

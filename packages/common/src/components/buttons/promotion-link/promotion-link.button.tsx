// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { PromotionLinkButtonStyle } from './promotion-link.button.style';
import { BaseText } from '../../text/base-text/base-text';
import { BaseButton } from '../base/base.button';
import { ImageAsset } from '../../image-asset/image-asset';
import { ImageInstanceNames } from '../../../theming/assets';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';

export interface IPromotionLinkButtonProps {
  promotionText: string;
  linkText?: string;
  viewStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  image?: string;
  iconName?: string;
  iconColor?: string;
  iconSize?: number;
}

export const PromotionLinkButton = ({
  promotionText,
  linkText,
  onPress,
  viewStyle,
  image,
  iconName,
  iconColor,
  iconSize,
}: IPromotionLinkButtonProps) => {
  const asset = image ? (
    <ImageAsset
      name={image as ImageInstanceNames}
      style={PromotionLinkButtonStyle.couponIconImageStyle}
    />
  ) : !!iconName && !!iconSize && !!iconColor ? (
    <FontAwesomeIcon
      name={iconName as string}
      size={iconSize}
      color={iconColor}
    />
  ) : null;
  return (
    <BaseButton
      onPress={onPress}
      viewStyle={[PromotionLinkButtonStyle.buttonContainerViewStyle, viewStyle]}
    >
      <View style={PromotionLinkButtonStyle.rowViewStyle}>
        {asset}
        <BaseText
          weight='semiBold'
          style={PromotionLinkButtonStyle.promotionTextStyle}
        >
          {promotionText}
          <BaseText
            weight='semiBold'
            style={PromotionLinkButtonStyle.linkTextStyle}
          >
            {linkText}
          </BaseText>
        </BaseText>
      </View>
    </BaseButton>
  );
};

// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  ImageBackground,
  Image,
} from 'react-native';
import { BaseText } from '../../text/base-text/base-text';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { CouponContent } from './coupon.content';
import { couponStyles } from './coupon.style';
import { getResolvedImageSource } from '../../../utils/assets.helper';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { ProtectedView } from '../../containers/protected-view/protected-view';

export interface ICouponProps {
  price?: number;
  productName?: string;
  viewStyle?: StyleProp<ViewStyle>;
  group?: string;
  pcn?: string;
  memberId?: string;
  bin?: string;
  eligibilityUrl?: string;
  logoUrl?: string;
}

export const Coupon = ({
  price,
  viewStyle,
  productName,
  group,
  pcn,
  bin,
  memberId,
}: ICouponProps): ReactElement => {
  const priceFormatted = MoneyFormatter.format(price);

  // TODO: Use logoUrl as uri
  const couponLogo = getResolvedImageSource('couponLogo');
  const semiCircle = getResolvedImageSource('semiCircle');
  const dottedLine = getResolvedImageSource('dottedLine');

  return (
    <View style={viewStyle}>
      <View style={couponStyles.topHalfViewStyle}>
        <View style={couponStyles.logoViewStyle}>
          <Image
            source={couponLogo}
            resizeMethod='resize'
            resizeMode='contain'
            style={couponStyles.logoImageStyle}
          />
          <ProtectedBaseText style={couponStyles.productNameTextStyle}>
            {productName}
          </ProtectedBaseText>
        </View>

        <View style={couponStyles.payLabelViewStyle}>
          <BaseText style={couponStyles.payLabelTextStyle}>
            {CouponContent.payAsLittle}
          </BaseText>
          <BaseText style={couponStyles.priceTextStyle}>
            {priceFormatted}
          </BaseText>
        </View>
      </View>
      <View style={couponStyles.middleContainerViewStyle}>
        <ImageBackground
          source={semiCircle}
          style={couponStyles.semiCircleLeftViewStyle}
          resizeMethod='resize'
          resizeMode='contain'
        />
        <ImageBackground
          source={dottedLine}
          style={couponStyles.dottedLineViewStyle}
          resizeMode='stretch'
        />
        <ImageBackground
          source={semiCircle}
          style={couponStyles.semiCircleRightViewStyle}
          resizeMethod='resize'
          resizeMode='contain'
        />
      </View>
      <View style={couponStyles.bottomHalfViewStyle}>
        <View>
          <BaseText style={couponStyles.couponTextStyle}>
            {CouponContent.groupNumberLabel}
          </BaseText>
          <BaseText style={couponStyles.couponTextStyle}>
            {CouponContent.pcnLabel}
          </BaseText>
          <BaseText style={couponStyles.couponTextStyle}>
            {CouponContent.memberIdLabel}
          </BaseText>
          <BaseText style={couponStyles.couponTextStyle}>
            {CouponContent.binLabel}
          </BaseText>
        </View>
        <ProtectedView>
          <BaseText style={couponStyles.dataTextStyle}>{group}</BaseText>
          <BaseText style={couponStyles.dataTextStyle}>{pcn}</BaseText>
          <BaseText style={couponStyles.dataTextStyle}>{memberId}</BaseText>
          <BaseText style={couponStyles.dataTextStyle}>{bin}</BaseText>
        </ProtectedView>
      </View>
    </View>
  );
};

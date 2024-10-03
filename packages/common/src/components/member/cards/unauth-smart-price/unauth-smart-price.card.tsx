// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent, ReactElement } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { ISmartPriceScreenContent } from '../../../../experiences/guest-experience/smart-price-screen/smart-price-screen.ui-content.model';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ImageAsset } from '../../../image-asset/image-asset';
import { BaseText } from '../../../text/base-text/base-text';
import { unauthSmartPriceCardStyles } from './unauth-smart-price.card.styles';

export interface IUnauthSmartPriceCardProps {
  viewStyle?: StyleProp<ViewStyle>;
}

export const UnauthSmartPriceCard: FunctionComponent<IUnauthSmartPriceCardProps> =
  ({ viewStyle }): ReactElement => {
    const groupKey = CmsGroupKey.smartPriceScreen;

    const {
      content: {
        unauthSmartPriceCard: {
          defaultMessage,
          pcnValue,
          groupValue,
          binValue,
        },
        digitalIdCard: { pcn, bin, group, memberId },
      },
    } = useContent<ISmartPriceScreenContent>(groupKey, 2);

    const {
      containerViewStyle,
      headerViewStyle,
      brandMyPrescryptiveImage,
      topRowViewStyle,
      labelTextStyle,
      contentTextStyle,
      paddingStyle,
      lastRowViewStyle,
      firstItemViewStyle,
      dataViewStyle,
    } = unauthSmartPriceCardStyles;

    const brandingInstanceName = 'headerMyPrescryptiveLogo';
    const brandingInstanceStyling = brandMyPrescryptiveImage;

    return (
      <View
        style={[containerViewStyle, viewStyle]}
        testID='UnauthSmartPriceCard'
      >
        <View style={headerViewStyle}>
          <ImageAsset
            name={brandingInstanceName}
            style={brandingInstanceStyling}
            resizeMode='contain'
          />
        </View>
        <View style={paddingStyle}>
          <View style={topRowViewStyle} testID='UnauthSmartPriceMemberId'>
            <BaseText style={labelTextStyle}>{memberId}</BaseText>
            <BaseText style={contentTextStyle}>{defaultMessage}</BaseText>
          </View>
          <View style={lastRowViewStyle} testID='UnauthSmartPriceInformation'>
            <View style={firstItemViewStyle} testID='UnauthSmartPriceGroup'>
              <BaseText style={labelTextStyle}>{group}</BaseText>
              <BaseText style={contentTextStyle}>{groupValue}</BaseText>
            </View>
            <View style={dataViewStyle} testID='UnauthSmartPriceBin'>
              <BaseText style={labelTextStyle}>{bin}</BaseText>
              <BaseText style={contentTextStyle}>{binValue}</BaseText>
            </View>
            <View style={dataViewStyle} testID='UnauthSmartPricePCN'>
              <BaseText style={labelTextStyle}>{pcn}</BaseText>
              <BaseText style={contentTextStyle}>{pcnValue}</BaseText>
            </View>
          </View>
        </View>
      </View>
    );
  };

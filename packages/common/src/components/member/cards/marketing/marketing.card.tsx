// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { ImageInstanceNames } from '../../../../theming/assets';
import { ImageAsset } from '../../../image-asset/image-asset';
import { BaseText } from '../../../text/base-text/base-text';
import { Heading } from '../../heading/heading';
import { marketingCardStyles } from './marketing.card.styles';

export interface IMarketingCardProps {
  imageName: ImageInstanceNames;
  title: string;
  description: string;
  headingLevel: number;
  viewStyle?: StyleProp<ViewStyle>;
}

export const MarketingCard = (props: IMarketingCardProps) => {
  return (
    <View
      testID={'marketingCardView'}
      style={[marketingCardStyles.marketingCardViewStyle, props.viewStyle]}
    >
      <ImageAsset
        style={marketingCardStyles.iconImageStyle}
        resizeMode='contain'
        resizeMethod='scale'
        name={props.imageName}
      />
      <View
        testID={'marketingCardContentView'}
        style={marketingCardStyles.marketingCardContentViewStyle}
      >
        <Heading
          level={props.headingLevel}
          textStyle={marketingCardStyles.marketingCardTitleTextStyle}
        >
          {props.title}
        </Heading>
        <BaseText style={marketingCardStyles.marketingCardDescriptionTextStyle}>
          {props.description}
        </BaseText>
      </View>
    </View>
  );
};

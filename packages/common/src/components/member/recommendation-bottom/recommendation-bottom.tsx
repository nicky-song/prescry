// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import DateFormatter from '../../../utils/formatters/date.formatter';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { ProtectedView } from '../../containers/protected-view/protected-view';
import { TranslatableView } from '../../containers/translated-view/translatable-view';
import { BaseText } from '../../text/base-text/base-text';
import { recommendationBottomContent } from './recommendation-bottom.content';
import { recommendationBottomStyles } from './recommendation-bottom.styles';

export interface IRecommendationBottomProps {
  pharmacyCashPrice: number;
  pharmacyName: string;
  planPays: number;
  orderDate?: Date;
}
export const RecommendationBottom = (props: IRecommendationBottomProps) => {
  const { pharmacyCashPrice, planPays, pharmacyName } = props;
  const orderDate = props.orderDate
    ? 'on ' + DateFormatter.formatToMDY(props.orderDate)
    : '';

  return (
    <View style={recommendationBottomStyles.containerView}>
      <View style={recommendationBottomStyles.youPayContainerView}>
        <BaseText style={recommendationBottomStyles.youPayText}>
          {recommendationBottomContent.youPayLabel()}
        </BaseText>
        <BaseText style={recommendationBottomStyles.youPayPriceText}>
          {MoneyFormatter.format(pharmacyCashPrice)}
        </BaseText>
      </View>
      <View style={recommendationBottomStyles.planPayContainerView}>
        <BaseText>{recommendationBottomContent.employerPayLabel()}</BaseText>
        <BaseText style={recommendationBottomStyles.planPayPriceText}>
          {MoneyFormatter.format(planPays)}
        </BaseText>
      </View>
      <TranslatableView style={recommendationBottomStyles.sentToViewStyle}>
        <BaseText style={recommendationBottomStyles.sentToPharmacyText}>
          {recommendationBottomContent.sentToText() + ' '}
        </BaseText>
        <ProtectedView>
          <BaseText style={recommendationBottomStyles.sentToPharmacyText}>
            {pharmacyName + ' '}
          </BaseText>
        </ProtectedView>
        <BaseText style={recommendationBottomStyles.sentToPharmacyText}>
          {orderDate}
        </BaseText>
      </TranslatableView>
    </View>
  );
};

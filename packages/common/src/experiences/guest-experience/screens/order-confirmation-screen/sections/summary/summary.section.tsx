// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import dateFormatter from '../../../../../../utils/formatters/date.formatter';
import { MoneyFormatter } from '../../../../../../utils/formatters/money-formatter';
import { SectionView } from '../../../../../../components/primitives/section-view';
import { Heading } from '../../../../../../components/member/heading/heading';
import { summarySectionStyle as styles } from './summary.section.style';
import { LineSeparator } from '../../../../../../components/member/line-separator/line-separator';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { ConfirmedAmountText } from '../../../../../../components/text/confirmed-amount/confirmed-amount.text';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { IOrderConfirmationScreenContent } from '../../order-confirmation.screen.content';
import { ProtectedBaseText } from '../../../../../../components/text/protected-base-text/protected-base-text';

export interface ISummarySectionProps {
  orderDate?: Date;
  orderNumber?: string;
  pricePlanPays?: number;
  priceYouPay?: number;
  viewStyle?: StyleProp<ViewStyle>;
}

export const SummarySection = ({
  orderDate,
  orderNumber,
  pricePlanPays,
  priceYouPay,
  viewStyle,
}: ISummarySectionProps) => {
  const groupKey = CmsGroupKey.orderConfirmation;

  const { content, isContentLoading } =
    useContent<IOrderConfirmationScreenContent>(groupKey, 2);
  const price = priceYouPay ? MoneyFormatter.format(priceYouPay) : undefined;
  const planPays = pricePlanPays
    ? MoneyFormatter.format(pricePlanPays)
    : undefined;

  const orderDateRow = orderDate ? (
    <View testID='summaryRowOrderDate' style={styles.rowViewStyle}>
      <BaseText
        style={styles.labelTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='short'
      >
        {content.summaryOrderDate}
      </BaseText>
      <BaseText
        style={styles.dataTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='short'
      >
        {dateFormatter.formatLocalDate(orderDate)}
      </BaseText>
    </View>
  ) : null;

  const orderNumberRow = orderNumber ? (
    <View testID={'summaryRowOrderNumber'} style={styles.rowViewStyle}>
      <BaseText
        style={styles.labelTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='short'
      >
        {content.summaryOrderNumber}
      </BaseText>
      <ProtectedBaseText
        style={styles.dataTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='short'
      >
        {orderNumber}
      </ProtectedBaseText>
    </View>
  ) : null;

  const pricePlansPayRender = planPays ? (
    <View testID='summaryRowPlanPays' style={styles.rowViewStyle}>
      <BaseText
        style={styles.labelTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='short'
      >
        {content.summaryPlanPays}
      </BaseText>
      <BaseText
        style={styles.dataTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='short'
      >
        {planPays}
      </BaseText>
    </View>
  ) : null;

  const priceYouPayRender = price ? (
    <View testID='summaryRowYouPay' style={styles.rowViewStyle}>
      <BaseText
        style={styles.labelTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='short'
      >
        {content.summaryYouPay}
      </BaseText>
      <ConfirmedAmountText
        style={styles.dataTextStyle}
        isSkeleton={isContentLoading}
      >
        {price}
      </ConfirmedAmountText>
    </View>
  ) : null;

  const body = (
    <View>
      {orderDateRow}
      {orderNumberRow}
      {pricePlansPayRender}
      {priceYouPayRender}
    </View>
  );

  return (
    <SectionView
      testID='summarySection'
      style={[styles.sectionViewStyle, viewStyle]}
    >
      <LineSeparator viewStyle={styles.separatorViewStyle} />
      <Heading
        level={2}
        textStyle={styles.heading2TextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.summaryTitle}
      </Heading>
      {body}
    </SectionView>
  );
};

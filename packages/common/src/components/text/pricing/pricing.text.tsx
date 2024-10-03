// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { PrescriptionPriceContainer } from '../../containers/prescription-price/prescription-price.container';
import { IPrescriptionPriceSectionContent } from '../../member/prescription-price/prescription-price-section.cms-content-wrapper';
import { BaseText } from '../base-text/base-text';
import { ConfirmedAmountText } from '../confirmed-amount/confirmed-amount.text';
import { pricingTextStyles } from './pricing.text.styles';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { IFeaturesState } from '../../../experiences/guest-experience/guest-experience-features';

export interface IDrugPricing {
  memberPays: number;
  planPays?: number;
  insurancePrice?: number;
}

export type PricingTextFormat = 'details' | 'summary';

export interface IPricingTextProps {
  drugPricing: IDrugPricing;
  pricingTextFormat: PricingTextFormat;
  viewStyle?: StyleProp<ViewStyle>;
}

export const PricingText = ({
  viewStyle,
  drugPricing,
  pricingTextFormat,
}: IPricingTextProps): ReactElement => {
  const groupKey = CmsGroupKey.prescriptionPriceSection;
  const { content, isContentLoading } =
    useContent<IPrescriptionPriceSectionContent>(groupKey, 2);

  const { usertpb } = useFlags<IFeaturesState>();

  const {
    youPay: memberPaysLabel,
    planPays: planPaysLabel,
    withInsurance: insuranceLabel,
  } = content;

  const memberPaysPricing = MoneyFormatter.format(drugPricing.memberPays);
  const planPaysPricing = MoneyFormatter.format(drugPricing.planPays);
  const insurancePricing = MoneyFormatter.format(drugPricing.insurancePrice);

  const { planPaysViewStyle, detailsViewStyle } = pricingTextStyles;

  const memberPaysLabelText = (
    <BaseText isSkeleton={isContentLoading}>{memberPaysLabel}</BaseText>
  );

  const insuranceLabelText = (
    <BaseText isSkeleton={isContentLoading}>{insuranceLabel}</BaseText>
  );

  const planPaysLabelText = (
    <BaseText
      isSkeleton={isContentLoading}
      style={pricingTextStyles.planPaysTextStyle}
    >
      {`${planPaysLabel} `}
    </BaseText>
  );

  const memberPaysPricingText = (
    <ConfirmedAmountText>{memberPaysPricing}</ConfirmedAmountText>
  );

  const insurancePricingText = (
    <ConfirmedAmountText>{insurancePricing}</ConfirmedAmountText>
  );

  const detailsMemberPaysPricingText = (
    <BaseText style={pricingTextStyles.detailsMemberPaysPricingTextStyle}>
      {memberPaysPricing}
    </BaseText>
  );

  const planPaysPricingText = (
    <BaseText style={pricingTextStyles.planPaysTextStyle}>
      {planPaysPricing}
    </BaseText>
  );

  const detailsText = (
    <View style={viewStyle}>
      <PrescriptionPriceContainer
        viewStyle={detailsViewStyle}
        containerFormat='plain'
      >
        {memberPaysLabelText}
        {detailsMemberPaysPricingText}
      </PrescriptionPriceContainer>
      {drugPricing.planPays !== undefined && (
        <PrescriptionPriceContainer
          viewStyle={detailsViewStyle}
          containerFormat='plain'
        >
          {planPaysLabelText}
          {planPaysPricingText}
        </PrescriptionPriceContainer>
      )}
    </View>
  );

  const summaryText = (
    <View style={viewStyle}>
      <PrescriptionPriceContainer isRounded={true}>
        {memberPaysLabelText}
        {memberPaysPricingText}
      </PrescriptionPriceContainer>
      {drugPricing.planPays !== undefined && (
        <PrescriptionPriceContainer viewStyle={planPaysViewStyle}>
          {planPaysLabelText}
          {planPaysPricingText}
        </PrescriptionPriceContainer>
      )}
    </View>
  );

  const insuranceText = (
    <PrescriptionPriceContainer isRounded={true} viewStyle={viewStyle}>
      {insuranceLabelText}
      {insurancePricingText}
    </PrescriptionPriceContainer>
  );

  if (insurancePricing && usertpb) {
    return insuranceText;
  }

  switch (pricingTextFormat) {
    case 'details':
      return detailsText;
    case 'summary':
      return summaryText;
  }
};

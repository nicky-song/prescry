// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { PrescriptionTitle } from '../../../../../../../components/member/prescription-title/prescription-title';
import { SectionView } from '../../../../../../../components/primitives/section-view';
import { ConfirmedAmountText } from '../../../../../../../components/text/confirmed-amount/confirmed-amount.text';
import { BaseText } from '../../../../../../../components/text/base-text/base-text';
import { IDrugDetails } from '../../../../../../../utils/formatters/drug.formatter';
import { MoneyFormatter } from '../../../../../../../utils/formatters/money-formatter';
import { drugWithPriceSectionStyles } from './drug-with-price.section.styles';
import { PrescriptionPriceContainer } from '../../../../../../../components/containers/prescription-price/prescription-price.container';
import { IPrescriptionPriceSectionContent } from '../../../../../../../components/member/prescription-price/prescription-price-section.cms-content-wrapper';
import { CmsGroupKey } from '../../../../../state/cms-content/cms-group-key';
import { useContent } from '../../../../../context-providers/session/ui-content-hooks/use-content';

export interface IDrugWithPriceSectionProps {
  drugName: string;
  drugDetails: IDrugDetails;
  hideSeparator: boolean;
  price?: number;
  planPrice?: number;
}

export const DrugWithPriceSection = ({
  drugName,
  drugDetails,
  hideSeparator,
  price,
  planPrice,
}: IDrugWithPriceSectionProps): ReactElement => {
  const groupKey = CmsGroupKey.prescriptionPriceSection;
  const { content, isContentLoading } =
    useContent<IPrescriptionPriceSectionContent>(groupKey, 2);

  const { strength, unit, formCode, quantity, supply } = drugDetails;
  const formattedPrice = MoneyFormatter.format(price);
  const formattedPlanPrice = MoneyFormatter.format(planPrice);

  const planPriceWithYouPayPrice = (
    <>
      <PrescriptionPriceContainer
        viewStyle={drugWithPriceSectionStyles.priceContainerViewStyle}
      >
        <BaseText isSkeleton={isContentLoading} skeletonWidth='short'>
          {content.youPay}
        </BaseText>
        <ConfirmedAmountText style={drugWithPriceSectionStyles.priceTextStyle}>
          {formattedPrice}
        </ConfirmedAmountText>
      </PrescriptionPriceContainer>
      {planPrice !== undefined ? (
        <View style={drugWithPriceSectionStyles.planPaysContainerViewStyle}>
          <BaseText isSkeleton={isContentLoading} skeletonWidth='short'>
            {content.planPays}
          </BaseText>
          <BaseText style={drugWithPriceSectionStyles.planPriceTextStyle}>
            {formattedPlanPrice}
          </BaseText>
        </View>
      ) : null}
    </>
  );

  const priceOrDefault = (
    <PrescriptionPriceContainer
      viewStyle={drugWithPriceSectionStyles.priceContainerViewStyle}
    >
      <BaseText isSkeleton={isContentLoading} skeletonWidth='short'>
        {content.price}
      </BaseText>
      <ConfirmedAmountText
        testID='youPayContent'
        style={drugWithPriceSectionStyles.priceTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='long'
      >
        {price === undefined ? content.noPrice : formattedPrice}
      </ConfirmedAmountText>
    </PrescriptionPriceContainer>
  );

  const renderPrice =
    planPrice !== undefined && price !== undefined
      ? planPriceWithYouPayPrice
      : priceOrDefault;

  return (
    <SectionView>
      <PrescriptionTitle
        headingLevel={2}
        productName={drugName}
        strength={strength}
        unit={unit}
        formCode={formCode}
        quantity={quantity}
        refills={0}
        supply={supply}
        hideSeparator={hideSeparator}
      />
      {renderPrice}
    </SectionView>
  );
};

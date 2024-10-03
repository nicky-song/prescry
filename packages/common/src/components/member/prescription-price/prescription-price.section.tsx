// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { BaseText } from '../../text/base-text/base-text';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { prescriptionPriceStyles as styles } from './prescription-price.section.styles';
import { ICouponDetails } from '../../../models/coupon-details/coupon-details';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IPrescriptionPriceSectionContent } from './prescription-price-section.cms-content-wrapper';
import { IDrugPricing, PricingText } from '../../text/pricing/pricing.text';
import { PrescriptionPriceContainer } from '../../containers/prescription-price/prescription-price.container';
import { ConfirmedAmountText } from '../../text/confirmed-amount/confirmed-amount.text';

export interface IPrescriptionPriceSectionProps {
  hasAssistanceProgram: boolean;
  showPlanPays: boolean;
  memberPays?: number;
  planPays?: number;
  couponDetails?: ICouponDetails;
  isSkeleton?: boolean;
  isConfirmed?: boolean;
  insurancePrice?: number;
  viewStyle?: ViewStyle;
}

interface IPrescriptionPrice {
  label?: string;
  value: number;
  price?: string;
  isSkeleton?: boolean;
}

export const PrescriptionPriceSection = (
  props: IPrescriptionPriceSectionProps
) => {
  const {
    showPlanPays,
    memberPays,
    planPays,
    hasAssistanceProgram,
    couponDetails,
    isSkeleton,
    isConfirmed,
    insurancePrice,
  } = props;

  const groupKey = CmsGroupKey.prescriptionPriceSection;
  const { content, isContentLoading } =
    useContent<IPrescriptionPriceSectionContent>(groupKey, 2);

  const assistanceProgram = hasAssistanceProgram ? (
    <BaseText
      style={styles.assistanceProgramTextStyle}
      isSkeleton={isContentLoading}
      skeletonWidth='long'
    >
      {content.assistanceProgram}
    </BaseText>
  ) : null;

  const couponPrice = MoneyFormatter.format(couponDetails?.price);
  const memberPaysPrice = MoneyFormatter.format(memberPays);

  const couponPriceValid = couponDetails?.price !== undefined;
  const memberPaysValid = memberPays !== undefined;

  const hasCouponAndPrice =
    !showPlanPays && memberPaysValid && couponPriceValid;
  const hasJustCouponPrice =
    !showPlanPays && !memberPaysValid && couponPriceValid;

  const prescriptionPrices: IPrescriptionPrice[] = [
    {
      label: content.price,
      value: memberPays ?? Number.MAX_VALUE,
      price: memberPaysPrice,
      isSkeleton: isContentLoading,
    },
    {
      label: couponDetails?.copayText,
      value: couponDetails?.price ?? Number.MAX_VALUE,
      price: couponPrice,
    },
  ];

  prescriptionPrices.sort((a, b) => (a.value > b.value ? 1 : -1));

  const lowestPrescriptionPrice = prescriptionPrices[0];
  const highestPrescriptionPrice = prescriptionPrices[1];

  const renderPriceContainer = () => {
    if (hasCouponAndPrice) {
      return (
        <>
          <View testID='hasCouponAndPrice-lowestValue'>
            <PrescriptionPriceContainer
              viewStyle={styles.amountContainerViewStyle}
            >
              <BaseText
                isSkeleton={lowestPrescriptionPrice.isSkeleton}
                skeletonWidth='medium'
              >
                {lowestPrescriptionPrice.label}
              </BaseText>
              <ConfirmedAmountText style={styles.amountTextStyle}>
                {lowestPrescriptionPrice.price}
              </ConfirmedAmountText>
            </PrescriptionPriceContainer>
          </View>
          <View testID='hasCouponAndPrice-highestValue'>
            <View style={styles.amountHighContainerViewStyle}>
              <BaseText
                isSkeleton={highestPrescriptionPrice.isSkeleton}
                skeletonWidth='medium'
              >
                {highestPrescriptionPrice.label}
              </BaseText>
              <BaseText style={styles.amountTextStyle}>
                {highestPrescriptionPrice.price}
              </BaseText>
            </View>
          </View>
        </>
      );
    }
    if (hasJustCouponPrice) {
      return (
        <View testID='hasJustCouponPrice'>
          <PrescriptionPriceContainer
            viewStyle={styles.amountContainerViewStyle}
          >
            <BaseText>{couponDetails?.copayText}</BaseText>
            <ConfirmedAmountText style={styles.amountTextStyle}>
              {couponPrice}
            </ConfirmedAmountText>
          </PrescriptionPriceContainer>
          <View style={styles.priceContainerViewStyle}>
            <BaseText isSkeleton={isContentLoading} skeletonWidth='short'>
              {content.price}
            </BaseText>
            <BaseText
              style={styles.rightTextStyle}
              isSkeleton={isContentLoading}
              skeletonWidth='long'
            >
              {content.noPrice}
            </BaseText>
          </View>
        </View>
      );
    } else if (memberPays === undefined) {
      return (
        <BaseText
          style={styles.contactPharmacyViewStyle}
          isSkeleton={isContentLoading}
          skeletonWidth='long'
        >
          {content.contactPharmacyForPricing}
        </BaseText>
      );
    } else {
      const drugPricing: IDrugPricing = {
        memberPays,
        planPays,
        insurancePrice,
      };

      return (
        memberPaysValid && (
          <PricingText drugPricing={drugPricing} pricingTextFormat='summary' />
        )
      );
    }
  };

  const skeleton = (
    <BaseText
      style={styles.contactPharmacyViewStyle}
      isSkeleton={isSkeleton}
      skeletonWidth='long'
    >
      {content.skeletonPlaceHolder}
    </BaseText>
  );

  const verifyRealPrice =
    isConfirmed && insurancePrice ? (
      <BaseText
        style={styles.verifyRealPriceTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='long'
      >
        {content.verifyRealPrice}
      </BaseText>
    ) : null;

  const body = (
    <View>
      {renderPriceContainer()}
      {verifyRealPrice}
      {assistanceProgram}
    </View>
  );

  return (
    <View testID='PrescriptionPriceSection' style={props.viewStyle}>
      {isSkeleton ? skeleton : body}
    </View>
  );
};

// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { Heading } from '../../../../../../components/member/heading/heading';
import { SectionView } from '../../../../../../components/primitives/section-view';
import { ICouponDetails } from '../../../../../../models/coupon-details/coupon-details';
import { IDrugDetails } from '../../../../../../utils/formatters/drug.formatter';
import { orderSectionStyle } from './order.section.style';
import { PrescriptionPriceSection } from '../../../../../../components/member/prescription-price/prescription-price.section';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { IOrderConfirmationScreenContent } from '../../order-confirmation.screen.content';
import { DrugDetailsText } from '../../../../../../components/text/drug-details/drug-details.text';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { IFeaturesState } from '../../../../guest-experience-features';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { PricingOption } from '../../../../../../models/pricing-option';
import { SmartPricePricingOptionInformativePanel } from '../../../../../../components/member/panels/smart-pricing-option-informative/smart-price-pricing-option-informative.panel';
import { PbmPricingOptionInformativePanel } from '../../../../../../components/member/panels/pbm-pricing-option-informative/pbm-pricing-option-informative.panel';
import { ThirdPartyPricingOptionInformativePanel } from '../../../../../../components/member/panels/third-party-pricing-option-informative/third-party-pricing-option-informative.panel';

export interface IOrderSectionProps {
  drugDetails: IDrugDetails;
  drugName: string;
  showPlanPays: boolean;
  planPays?: number;
  memberPays?: number;
  couponDetails?: ICouponDetails;
  hasAssistanceProgram?: boolean;
  hasInsurance?: boolean;
  pricingOption?: PricingOption;
}

export const OrderSection = ({
  drugDetails,
  drugName,
  planPays,
  memberPays,
  showPlanPays,
  couponDetails,
  hasAssistanceProgram = false,
  hasInsurance,
  pricingOption = "smartPrice",
}: IOrderSectionProps): ReactElement => {
  const groupKey = CmsGroupKey.orderConfirmation;

  const { content, isContentLoading } =
    useContent<IOrderConfirmationScreenContent>(groupKey, 2);

  const {
    usertpb,
    useDualPrice,
  } = useFlags<IFeaturesState>();

  const styles = orderSectionStyle;
  const testIDBase = 'orderSection';

  const { strength, unit, quantity, formCode, supply } = drugDetails;

  const getDualPriceSection = () => {
    switch (pricingOption) {
      case 'smartPrice':
        return (
          <SmartPricePricingOptionInformativePanel
            memberPays={memberPays || 0}
            viewStyle={styles.dualPriceSectionViewStyle}
          />
        );
      case 'pbm':
        return (
          <PbmPricingOptionInformativePanel
            memberPays={memberPays || 0}
            planPays={planPays || 0}
            viewStyle={styles.dualPriceSectionViewStyle}
          />
        );
      case 'thirdParty':
        return (
          <ThirdPartyPricingOptionInformativePanel
            memberPays={memberPays || 0}
            viewStyle={styles.dualPriceSectionViewStyle}
          />
        );
      case 'noPrice':
        return null;
    }
  };

  return (
    <SectionView testID={testIDBase} style={styles.sectionViewStyle}>
      <Heading
        level={2}
        textStyle={styles.heading2TextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='long'
      >
        {content.orderSectionHeader}
      </Heading>
      <Heading
        level={3}
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
        translateContent={false}
      >
        {drugName}
      </Heading>
      <DrugDetailsText
        viewStyle={styles.drugDetailsViewStyle}
        strength={strength}
        unit={unit}
        quantity={quantity}
        formCode={formCode}
        supply={supply}
      />
      {useDualPrice 
        ? getDualPriceSection()
        : (
          <PrescriptionPriceSection
            hasAssistanceProgram={hasAssistanceProgram}
            showPlanPays={showPlanPays}
            memberPays={memberPays}
            planPays={planPays}
            couponDetails={couponDetails}
            isSkeleton={isContentLoading}
            viewStyle={styles.prescriptionPriceSectionViewStyle}
          />
        )
      }
      {usertpb && hasInsurance && (
        <BaseText
          style={styles.estimatedPriceNoticeTextStyle}
          isSkeleton={isContentLoading}
          skeletonWidth='long'
        >
          {content.estimatedPriceNoticeText}
        </BaseText>
      )}
    </SectionView>
  );
};

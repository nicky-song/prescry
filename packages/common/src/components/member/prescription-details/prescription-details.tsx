// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { PrescriptionTagList } from '../../tags/prescription/prescription-tag-list';
import { BaseText } from '../../text/base-text/base-text';
import { IDrugPricing, PricingText } from '../../text/pricing/pricing.text';
import { PrescriptionTitle } from '../prescription-title/prescription-title';
import { prescriptionDetailsStyles } from './prescription-details.styles';
import { IPrescriptionDetails } from '../../../models/prescription-details';

export interface IPrescriptionDetailsProps {
  title?: string;
  memberSaves: number;
  planSaves: number;
  prescriptionDetailsList: IPrescriptionDetails[];
  drugPricing: IDrugPricing;
  isShowingPriceDetails?: boolean;
  viewStyle?: ViewStyle;
}

export const PrescriptionDetails = ({
  title,
  memberSaves,
  planSaves,
  prescriptionDetailsList,
  drugPricing,
  isShowingPriceDetails,
  viewStyle,
}: IPrescriptionDetailsProps) => {
  const prescriptionTitles = prescriptionDetailsList.map(
    (prescriptionDetails) => {
      const showPricing = isShowingPriceDetails;

      const pricingText = showPricing &&
        prescriptionDetails.memberPays !== undefined && (
          <PricingText
            drugPricing={{
              memberPays: prescriptionDetails.memberPays,
              planPays: prescriptionDetails.planPays,
            }}
            pricingTextFormat='details'
            viewStyle={prescriptionDetailsStyles.pricingTextViewStyle}
          />
        );

      return (
        <View key={prescriptionDetails.productName}>
          <PrescriptionTitle
            {...prescriptionDetails}
            viewStyle={prescriptionDetailsStyles.prescriptionTitleViewStyle}
            hideSeparator={true}
          />
          {pricingText}
        </View>
      );
    }
  );

  return (
    <View style={viewStyle}>
      <BaseText style={prescriptionDetailsStyles.titleTextStyle}>
        {title}
      </BaseText>
      <PrescriptionTagList
        memberSaves={memberSaves}
        planSaves={planSaves}
        viewStyle={prescriptionDetailsStyles.prescriptionTagListViewStyle}
      />
      {prescriptionTitles}
      <PricingText
        drugPricing={drugPricing}
        viewStyle={prescriptionDetailsStyles.pricingTextViewStyle}
        pricingTextFormat='summary'
      />
    </View>
  );
};

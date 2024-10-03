// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { PrescriptionTagList } from '../../tags/prescription/prescription-tag-list';
import { IDrugPricing, PricingText } from '../../text/pricing/pricing.text';
import { IPrescriptionDetails } from '../../../models/prescription-details';
import { PrescriptionTitle } from '../prescription-title/prescription-title';
import { alternativeMedicationStyles } from './alternative-medication.styles';
export interface IAlternativeMedicationProps {
  memberSaves: number;
  planSaves: number;
  prescriptionDetailsList: IPrescriptionDetails[];
  drugPricing: IDrugPricing;
  viewStyle?: ViewStyle;
  testID?: string;
}

export const AlternativeMedication = ({
  memberSaves,
  planSaves,
  prescriptionDetailsList,
  drugPricing,
  viewStyle,
  testID,
}: IAlternativeMedicationProps) => {
  const prescriptionTitles = prescriptionDetailsList.map(
    (prescriptionDetails: IPrescriptionDetails) => {
      const prescriptionDetailsKey = prescriptionDetails.productName;
      return (
        <PrescriptionTitle
          key={prescriptionDetailsKey}
          {...prescriptionDetails}
          viewStyle={alternativeMedicationStyles.prescriptionTitleViewStyle}
          hideSeparator={true}
          isClaimAlert={true}
        />
      );
    }
  );

  return (
    <View style={viewStyle} testID={testID}>
      <PrescriptionTagList
        memberSaves={memberSaves}
        planSaves={planSaves}
        viewStyle={alternativeMedicationStyles.prescriptionTagListViewStyle}
      />
      <View style={alternativeMedicationStyles.chevronCardViewStyle}>
        {prescriptionTitles}
      </View>
      <PricingText
        drugPricing={drugPricing}
        pricingTextFormat='summary'
        viewStyle={alternativeMedicationStyles.pricingTextViewStyle}
      />
    </View>
  );
};

// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { ReactElement } from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { IPharmacy } from '../../../models/pharmacy';
import { PrescriptionTitle } from '../../member/prescription-title/prescription-title';
import { IDrugDetailsTextProps } from '../../text/drug-details/drug-details.text';
import { PharmacyInfoText } from '../../text/pharmacy-info/pharmacy-info.text';
import { ProtectedView } from '../protected-view/protected-view';
import { pricingOptionContextContainerStyles } from './pricing-option-context.container.styles';

export interface IPricingOptionContextContainerProps
  extends Omit<ViewProps, 'style'> {
  drugName: string;
  drugDetails: Pick<
    IDrugDetailsTextProps,
    'strength' | 'unit' | 'formCode' | 'quantity' | 'refills' | 'supply'
  >;
  pharmacyInfo: Pick<IPharmacy, 'name' | 'address'>;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const PricingOptionContextContainer = ({
  drugName,
  drugDetails,
  pharmacyInfo,
  viewStyle,
  testID,
}: IPricingOptionContextContainerProps): ReactElement => {
  const { formCode, strength, quantity, refills, supply } = drugDetails;
  return (
    <View testID={testID} style={viewStyle}>
      <ProtectedView
        style={pricingOptionContextContainerStyles.prescpritionTitleViewStyle}
      >
        <PrescriptionTitle
          productName={drugName}
          formCode={formCode}
          strength={strength}
          quantity={quantity}
          refills={refills}
          supply={supply}
          hideSeparator={true}
          headingLevel={2}
        ></PrescriptionTitle>
      </ProtectedView>
      <PharmacyInfoText pharmacyInfo={pharmacyInfo} />
    </View>
  );
};

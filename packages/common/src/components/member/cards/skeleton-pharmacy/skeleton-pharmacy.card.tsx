// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { SkeletonBone } from '../../../primitives/skeleton-bone';
import { PharmacyTagList } from '../../../tags/pharmacy/pharmacy-tag-list';
import { skeletonPharmacyCardStyles } from './skeleton-pharmacy.card.styles';

export interface ISkeletonPharmacyCardProps {
  isBestPricePharmacy?: boolean;
  viewStyle?: ViewStyle;
}

export const SkeletonPharmacyCard = ({
  isBestPricePharmacy = false,
  viewStyle,
}: ISkeletonPharmacyCardProps) => {
  const {
    skeletonPharmacyCardViewStyle,
    containerViewStyle,
    pharmacyNameViewStyle,
    pharmacyAddressViewStyle,
    distanceAndHoursViewStyle,
    priceViewStyle,
    firstBottomContentViewStyle,
    secondBottomContentViewStyle,
    pharmacyTagListViewStyle,
  } = skeletonPharmacyCardStyles;
  const layoutViewStyleList: ViewStyle[] = [
    pharmacyNameViewStyle,
    pharmacyAddressViewStyle,
    distanceAndHoursViewStyle,
    priceViewStyle,
    firstBottomContentViewStyle,
    secondBottomContentViewStyle,
  ];

  return (
    <View style={[skeletonPharmacyCardViewStyle, viewStyle]}>
      {isBestPricePharmacy ? (
        <PharmacyTagList
          isBestValue={true}
          viewStyle={pharmacyTagListViewStyle}
        />
      ) : null}
      <SkeletonBone
        containerViewStyle={{ ...containerViewStyle, ...viewStyle }}
        layoutViewStyleList={layoutViewStyleList}
      />
    </View>
  );
};

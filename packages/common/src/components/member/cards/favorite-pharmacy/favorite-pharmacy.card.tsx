// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { FavoriteIconButton } from '../../../buttons/favorite-icon/favorite-icon.button';
import { BaseText } from '../../../text/base-text/base-text';
import { favoritePharmacyCardStyles } from './favorite-pharmacy.card.styles';

export interface IFavoritePharmacyCardProps {
  onPress: () => Promise<void>;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyNcpdp: string;
  viewStyle?: ViewStyle;
  isSkeleton?: boolean;
  isDisabled?: boolean;
  testID?: string;
}

export const FavoritePharmacyCard = ({
  onPress,
  pharmacyName,
  pharmacyAddress,
  pharmacyNcpdp,
  viewStyle,
  isSkeleton,
  isDisabled,
  testID,
}: IFavoritePharmacyCardProps) => {
  const {
    favoritePharmacyCardViewStyle,
    pharmacyNameAndAddressViewStyle,
    pharmacyNameTextStyle,
    favoriteIconButtonWrapperViewStyle,
    favoriteIconButtonViewStyle,
  } = favoritePharmacyCardStyles;

  return (
    <View style={[favoritePharmacyCardViewStyle, viewStyle]} testID={testID}>
      <View style={pharmacyNameAndAddressViewStyle}>
        <BaseText
          style={pharmacyNameTextStyle}
          isSkeleton={isSkeleton}
          skeletonWidth='short'
        >
          {pharmacyName}
        </BaseText>
        <BaseText isSkeleton={isSkeleton} skeletonWidth='long'>
          {pharmacyAddress}
        </BaseText>
      </View>
      <View style={favoriteIconButtonWrapperViewStyle}>
        <FavoriteIconButton
          onPress={onPress}
          testID='favoriteIconButtonOnFavoritePharmacyCard'
          ncpdp={pharmacyNcpdp}
          viewStyle={favoriteIconButtonViewStyle}
          isDisabled={isDisabled}
        />
      </View>
    </View>
  );
};

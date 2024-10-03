// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { IAddress } from '../../../../models/address';
import { BaseText } from '../../../text/base-text/base-text';
import { ChevronCard } from '../../../cards/chevron/chevron.card';
import { pharmacyInfoCardContent } from './pharmacy-info.card.content';
import {
  pharmacyInfoCardStyles,
  pharmacyInfoCardStyles as styles,
} from './pharmacy-info.card.styles';
import { useMembershipContext } from '../../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { PharmacyTagList } from '../../../tags/pharmacy/pharmacy-tag-list';
import { ProtectedBaseText } from '../../../text/protected-base-text/protected-base-text';

export interface IPharmacyInfoCardProps {
  onPress: () => void;
  address: IAddress;
  serviceStatus: string;
  ncpdp: string;
  distance?: number;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const PharmacyInfoCard = ({
  onPress,
  address,
  ncpdp,
  distance,
  serviceStatus,
  viewStyle,
  testID,
}: IPharmacyInfoCardProps): ReactElement => {
  const {
    membershipState: {
      account: { favoritedPharmacies },
    },
  } = useMembershipContext();

  const isFavoritedPharmacy = favoritedPharmacies.includes(ncpdp);

  const distanceText =
    distance && pharmacyInfoCardContent.distanceText(distance);
  const infoText =
    distance !== undefined
      ? `${distanceText} | ${serviceStatus}`
      : serviceStatus;

  return (
    <View
      style={[pharmacyInfoCardStyles.contentViewStyle, viewStyle]}
      testID={testID}
    >
      <PharmacyTagList
        isFavoritedPharmacy={isFavoritedPharmacy}
        viewStyle={pharmacyInfoCardStyles.pharmacyTagListViewStyle}
      />
      <ChevronCard
        onPress={onPress}
        viewStyle={pharmacyInfoCardStyles.chevronCardViewStyle}
      >
        <View style={styles.pharmacyInfoViewStyle}>
          <ProtectedBaseText style={styles.addressTextStyle}>
            {address.lineOne}
          </ProtectedBaseText>
          <BaseText>{infoText}</BaseText>
        </View>
      </ChevronCard>
    </View>
  );
};

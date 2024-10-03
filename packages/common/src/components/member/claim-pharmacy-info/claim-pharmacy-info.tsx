// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { formatPhoneNumber } from '../../../utils/formatters/phone-number.formatter';
import { BaseText } from '../../text/base-text/base-text';
import { formatZipCode } from '../../../utils/formatters/address.formatter';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { IconSize } from '../../../theming/icons';
import { claimPharmacyInfoStyles } from './claim-pharmacy-info.styles';
import { Heading } from '../heading/heading';
import { ProtectedView } from '../../containers/protected-view/protected-view';

export interface IClaimPharmacyInfoProps {
  phoneNumber?: string;
  pharmacyAddress1?: string;
  pharmacyCity?: string;
  pharmacyZipCode?: string;
  pharmacyState?: string;
  title?: string;
  ncpdp?: string;
  isMailOrderOnly?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  isSkeleton?: boolean;
}

export const ClaimPharmacyInfo = ({
  phoneNumber = '',
  pharmacyAddress1,
  pharmacyCity,
  pharmacyZipCode,
  pharmacyState,
  title,
  isMailOrderOnly,
  viewStyle,
  isSkeleton,
}: IClaimPharmacyInfoProps): ReactElement => {
  const titleContent = (
    <Heading textStyle={claimPharmacyInfoStyles.titleTextStyle} level={3}>
      {title}
    </Heading>
  );

  const formattedPharmacyZipCode = formatZipCode(pharmacyZipCode ?? '');

  const address = `${pharmacyAddress1} ${pharmacyCity}, ${pharmacyState} ${formattedPharmacyZipCode}`;
  const addressContent =
    !isMailOrderOnly && pharmacyAddress1 ? (
      <View style={claimPharmacyInfoStyles.rowViewStyle}>
        <FontAwesomeIcon
          name='map-marker-alt'
          size={IconSize.regular}
          style={claimPharmacyInfoStyles.iconTextStyle}
        />
        <BaseText isSkeleton={isSkeleton} skeletonWidth='medium'>
          {address}
        </BaseText>
      </View>
    ) : null;

  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
  const phoneNumberContent = phoneNumber ? (
    <View style={claimPharmacyInfoStyles.rowViewStyle}>
      <FontAwesomeIcon
        name='phone-alt'
        size={IconSize.regular}
        style={claimPharmacyInfoStyles.iconTextStyle}
      />
      <BaseText isSkeleton={isSkeleton} skeletonWidth='medium'>
        {formattedPhoneNumber}
      </BaseText>
    </View>
  ) : null;

  return (
    <ProtectedView style={viewStyle}>
      {titleContent}
      {addressContent}
      {phoneNumberContent}
    </ProtectedView>
  );
};

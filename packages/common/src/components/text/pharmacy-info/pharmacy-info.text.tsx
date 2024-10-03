// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { ReactElement } from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { IPharmacy } from '../../../models/pharmacy';
import { formatZipCode } from '../../../utils/formatters/address.formatter';
import { Heading } from '../../member/heading/heading';
import { ProtectedBaseText } from '../protected-base-text/protected-base-text';

import { pharmacyInfoTextStyles } from './pharmacy-info.text.styles';

export interface IPharmacyInfoTextProps extends Omit<ViewProps, 'style'> {
  pharmacyInfo: Pick<IPharmacy, 'name' | 'address'>;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const PharmacyInfoText = ({
  pharmacyInfo,
  viewStyle,
  testID = 'pharmacyInfoText',
}: IPharmacyInfoTextProps): ReactElement => {
  const zipCode = formatZipCode(pharmacyInfo.address.zip ?? '');
  const address = `${pharmacyInfo.address.lineOne}, ${pharmacyInfo.address.city}, ${pharmacyInfo.address.state} ${zipCode}`;

  const pharmacyAddress = (
    <ProtectedBaseText style={pharmacyInfoTextStyles.pharmacyAddressTextStyle}>
      {address}
    </ProtectedBaseText>
  );

  return (
    <View testID={testID} style={viewStyle}>
      <Heading
        textStyle={pharmacyInfoTextStyles.pharmacyNameViewStyle}
        translateContent={false}
      >
        {pharmacyInfo.name}
      </Heading>
      {pharmacyAddress}
    </View>
  );
};

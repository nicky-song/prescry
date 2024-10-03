// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import { ProtectedView } from '../../containers/protected-view/protected-view';
import { PharmacyHoursContainer } from '../pharmacy-hours-container/pharmacy-hours-container';
import { PrescriptionPharmacyInfo } from '../prescription-pharmacy-info/prescription-pharmacy-info';
import { pharmacyInformationStyle } from './pharmacy-information.style';

export interface IPharmacyWebsite {
  label: string;
  url: string;
}

export interface IPharmacyAddressProps {
  pharmacyName: string;
  pharmacyAddress1: string;
  pharmacyAddress2?: string;
  pharmacyCity: string;
  pharmacyZipCode: string;
  pharmacyState: string;
  pharmacyWebsite?: IPharmacyWebsite;
  distance?: string;
  isMailOrderOnly?: boolean;
  isScreenFocused?: boolean;
}
export interface IPharmacyInformationProps extends IPharmacyAddressProps {
  pharmacyHours: Map<string, string>;
  currentDate: Date;
  driveThru: boolean;
  phoneNumber: string;
  textStyle?: StyleProp<TextStyle>;
}

export const PharmacyInformation = (props: IPharmacyInformationProps) => {
  return (
    <View style={pharmacyInformationStyle.containerView}>
      <ProtectedView>
        <PrescriptionPharmacyInfo
          title={props.pharmacyName}
          phoneNumber={props.phoneNumber}
          pharmacyAddress1={props.pharmacyAddress1}
          pharmacyCity={props.pharmacyCity}
          pharmacyState={props.pharmacyState}
          pharmacyZipCode={props.pharmacyZipCode}
          pharmacyWebsite={props.pharmacyWebsite}
        />
      </ProtectedView>
      <PharmacyHoursContainer pharmacyHours={props.pharmacyHours} />
    </View>
  );
};

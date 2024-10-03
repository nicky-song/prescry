// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { TextStyle, View } from 'react-native';
import { IDrugInformation } from '../../../experiences/guest-experience/claim-alert-screen/claim-alert-screen';
import { recommendationTopStyles as styles } from './recommendation-top.styles';
import { PrescriptionTitle } from '../prescription-title/prescription-title';
import { LineSeparator } from '../line-separator/line-separator';

export interface IRecommendationTopProps {
  rxId: string;
  drugName: string;
  dose: string;
  units: string;
  count: number;
  form: string;
  medicationId: string;
  daysSupply: number;
  refillCount: number;
  drugNameTextStyle?: TextStyle;
  doseTypeTextStyle?: TextStyle;
  unitCountTextStyle?: TextStyle;
  isScreenFocused?: boolean;
  drugInformation?: IDrugInformation;
}

interface IRecommendationTopState {
  showEllipsis: boolean;
}

export const initialState: IRecommendationTopState = {
  showEllipsis: true,
};

export const RecommendationTop = (props: IRecommendationTopProps) => {
  return (
    <View style={styles.headerTopViewStyle}>
      <View style={styles.prescriptionHeaderTopViewStyle}>
        <PrescriptionTitle
          productName={props.drugName}
          strength={props.dose}
          unit={props.units}
          quantity={props.count}
          supply={props.daysSupply}
          refills={props.refillCount}
          hideSeparator={true}
          infoLink={props.drugInformation?.externalLink}
          formCode={props.form}
        />
      </View>
      <LineSeparator viewStyle={styles.lineSeparatorViewStyle} />
    </View>
  );
};

// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { FontSize, GreyScale } from '../../../theming/theme';

export interface IPrescriptionDosageInfoProps {
  dose: string;
  units: string;
  count: number;
  form: string;
  doseTypeTextStyle?: TextStyle;
  unitCountTextStyle?: TextStyle;
  doseViewStyle?: TextStyle;
}

export class PrescriptionDosageInfo extends React.PureComponent<IPrescriptionDosageInfoProps> {
  public render() {
    const {
      doseViewStyle,
      doseTypeTextStyle,
      unitCountTextStyle,
      count,
      dose,
      form,
      units,
    } = this.props;
    return (
      <Text
        style={[styles.dosingText, doseViewStyle]}
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        <Text style={[styles.doseTypeText, doseTypeTextStyle]}>
          {dose}
          <Text style={[styles.unitCountText, unitCountTextStyle]}>
            {units}
          </Text>
        </Text>
        <Text style={[styles.doseCountText, doseTypeTextStyle]}>
          {count}
          <Text style={[styles.unitCountText, unitCountTextStyle]}>{form}</Text>
        </Text>
      </Text>
    );
  }
}

const dosingText: TextStyle = {
  alignSelf: 'flex-start',
  color: GreyScale.dark,
  flex: 1,
  fontSize: FontSize.regular,
  ...getFontFace(),
  textAlign: 'right',
};

const commonUnitCountStyle: TextStyle = {
  color: GreyScale.dark,
};

const doseTypeText: TextStyle = {
  ...commonUnitCountStyle,
  fontSize: FontSize.regular,
  ...getFontFace({ weight: FontWeight.medium }),
  marginRight: 10,
};

const doseCountText: TextStyle = {
  ...commonUnitCountStyle,
  ...getFontFace({ weight: FontWeight.medium }),
};
const unitCountText: TextStyle = {
  ...commonUnitCountStyle,
  fontSize: FontSize.smaller,
  ...getFontFace({ weight: FontWeight.light }),
  marginLeft: 2,
};

const styles = StyleSheet.create({
  doseCountText,
  doseTypeText,
  dosingText,
  unitCountText,
});

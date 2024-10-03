// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { rxLabelWithValueStyles as styles } from './rx-label-with-value.styles';
import { BaseText } from '../base-text/base-text';
import { ProtectedBaseText } from '../protected-base-text/protected-base-text';
import { RxCardType } from '../../../models/rx-id-card';

export interface IRxLabelWithValue {
  label: string;
  value: string;
  rxType?: RxCardType;
  isSkeleton?: boolean;
}

export interface IRxLabelWithValueWithStyles extends IRxLabelWithValue {
  viewStyle?: StyleProp<ViewStyle>;
}

export const RxLabelWithValue = (props: IRxLabelWithValue) => {
  const { rxType = 'pbm' } = props;
  const labelTextStyle =
    rxType === 'pbm'
      ? styles.rxBenefitLabelTextStyle
      : styles.rxSavingsLabelTextStyle;

  const valueTextStyle =
    rxType === 'pbm'
      ? styles.rxBenefitValueTextStyle
      : styles.rxSavingsValueTextStyle;
  return (
    <View style={styles.rxLabelWithValueViewStyle}>
      <BaseText
        style={[styles.rxLabelTextStyle, labelTextStyle]}
        isSkeleton={props.isSkeleton}
        skeletonWidth='short'
      >
        {props.label}
      </BaseText>
      <ProtectedBaseText>
        <BaseText
          style={[styles.rxValueTextStyle, valueTextStyle]}
          isSkeleton={props.isSkeleton}
        >
          {props.value}
        </BaseText>
      </ProtectedBaseText>
    </View>
  );
};

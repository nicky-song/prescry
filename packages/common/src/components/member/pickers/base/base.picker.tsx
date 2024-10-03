// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { Picker, PickerProps } from '@react-native-picker/picker';
import { basePickerStyles as styles } from './base.picker.styles';

export type IBasePickerProps = PickerProps;

export const BasePicker = ({
  style,
  ...props
}: IBasePickerProps): ReactElement => (
  <Picker style={[styles.pickerTextStyle, style]} {...props} />
);

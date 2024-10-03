// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { RedScale } from '../../../theming/theme';

export interface IFieldErrorTextStyle {
  textStyle: TextStyle;
}

export const fieldErrorTextStyle: IFieldErrorTextStyle = {
  textStyle: {
    color: RedScale.regular,
  },
};

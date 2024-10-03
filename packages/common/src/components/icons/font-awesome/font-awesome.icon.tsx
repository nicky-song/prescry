// Copyright 2021 Prescryptive Health, Inc.

import { ReactElement } from 'react';
import { StyleProp, TextStyle } from 'react-native';

export interface IFontAwesomeIconProps {
  brand?: boolean;
  light?: boolean;
  regular?: boolean;
  solid?: boolean;
  name: string;
  color?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
}

let FontAwesomeIcon: (props: IFontAwesomeIconProps) => ReactElement;

export const initializeFontAwesomeIcon = (
  component: (props: IFontAwesomeIconProps) => ReactElement
) => {
  FontAwesomeIcon = component;
};

export { FontAwesomeIcon };

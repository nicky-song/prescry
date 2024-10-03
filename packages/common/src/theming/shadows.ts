// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { GrayScaleColor } from './colors';

export type IShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius'
>;

export type IShadowsStyle = Record<string, IShadowStyle>;

export const shadows: IShadowsStyle = {
  cardShadowStyle: {
    shadowOffset: { width: 2, height: 2 },
    shadowColor: GrayScaleColor.black,
    shadowRadius: 12,
    shadowOpacity: 0.1,
  },
};

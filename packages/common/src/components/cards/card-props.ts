// Copyright 2022 Prescryptive Health, Inc.

import { StyleProp, ViewStyle } from 'react-native';

export interface ICardProps {
  viewStyle?: StyleProp<ViewStyle>;
  headingLevel?: number;
  isSingleton?: boolean;
  isSkeleton?: boolean;
}

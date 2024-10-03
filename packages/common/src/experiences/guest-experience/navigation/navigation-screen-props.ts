// Copyright 2022 Prescryptive Health, Inc.

import { RootStackNavigationProp } from './stack-navigators/root/root.stack-navigator';

export interface INavigationScreenProps<
  TRouteProp,
  TNavigationProp = RootStackNavigationProp
> {
  navigation: TNavigationProp;
  route: TRouteProp;
}

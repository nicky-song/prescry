// Copyright 2018 Prescryptive Health, Inc.

import { NavigationContainer, NavigationRouter } from 'react-navigation';

import * as Flux from 'react-native-router-flux';

declare module 'react-native-router-flux' {
  // tslint:disable-next-line:interface-name
  export interface ActionsGenericStatic {
    create: (props?: {}) => NavigationContainer;
  }
}

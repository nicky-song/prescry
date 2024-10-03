// Copyright 2020 Prescryptive Health, Inc.

import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export const navigateTestResultScreenDispatch = (
  navigation: RootStackNavigationProp,
  orderNumber: string,
  backToList?: boolean,
) => {
  navigation.navigate('PastProceduresStack', {
    screen: 'TestResult',
    params: {
      orderNumber,
      backToList,
    },
  });
};

// Copyright 2020 Prescryptive Health, Inc.

import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { IPastProceduresListScreenRouteProps } from '../../../screens/past-procedures-list/past-procedures-list.screen';

export const navigatePastProceduresListDispatch = (
  navigation: RootStackNavigationProp,
  backToHome?: boolean
) => {
  const routeParams: IPastProceduresListScreenRouteProps = {
    backToHome,
  };

  navigation.navigate('PastProceduresStack', {
    screen: 'PastProceduresList',
    params: routeParams,
  });
};

// Copyright 2021 Prescryptive Health, Inc.

import { ILoginPinScreenRouteProps } from '../../../../login-pin-screen/login-pin-screen';
import { RootStackNavigationProp } from '../../../../navigation/stack-navigators/root/root.stack-navigator';
export const loginPinNavigateDispatch = (
  navigation: RootStackNavigationProp,
  pinScreenParams: ILoginPinScreenRouteProps = {}
) => navigation.navigate('LoginPin', pinScreenParams);

// Copyright 2021 Prescryptive Health, Inc.

import {
  RootStackNavigationProp,
  RootStackScreenName,
} from '../../../../navigation/stack-navigators/root/root.stack-navigator';
import { Workflow } from '../../../../../../models/workflow';
import { getCurrentScreen } from '../../../../navigation/navigation.helper';
import { IPhoneNumberLoginScreenRouteProps } from '../../../../screens/sign-in/phone-number-login-screen/phone-number-login.screen';
import { SideMenuDrawerScreenName } from '../../../../navigation/drawer-navigators/side-menu/side-menu.drawer-navigator';

export const phoneNumberLoginNavigateDispatch = (
  navigation: RootStackNavigationProp,
  workflow?: Workflow,
  prescriptionId?: string,
  isBlockchain?: boolean
) => {
  const currentScreen = getCurrentScreen(navigation);

  const screenProps: IPhoneNumberLoginScreenRouteProps = {
    workflow,
    hasNavigateBack: hasNavigateBack(currentScreen, workflow),
    prescriptionId,
    isBlockchain,
  };
  navigation.navigate('PhoneNumberLogin', screenProps);
};

const hasNavigateBack = (
  currentScreen: RootStackScreenName | SideMenuDrawerScreenName,
  workflow?: Workflow
) => !!workflow || currentScreen === 'UnauthHome';

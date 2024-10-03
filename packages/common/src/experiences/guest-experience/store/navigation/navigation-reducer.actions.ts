// Copyright 2018 Prescryptive Health, Inc.

import {
  IPhoneNumberLoginScreenRouteProps,
  PhoneScreenModalContentType,
} from './../../screens/sign-in/phone-number-login-screen/phone-number-login.screen';
import { RootStackNavigationProp } from './../../navigation/stack-navigators/root/root.stack-navigator';
import { IHomeScreenRouteProps } from '../../home-screen/home-screen';
import { popToTop } from '../../navigation/navigation.helper';
import { CommonActions } from '@react-navigation/native';

export const dispatchResetStackToPhoneLoginScreen = (
  navigation: RootStackNavigationProp,
  isBlockchain?: boolean,
  errorMessage?: string
) => {
  popToTop(navigation);

  const phoneNumberLoginScreenParams: IPhoneNumberLoginScreenRouteProps = {
    isBlockchain,
  };

  if (errorMessage) {
    const modalContent: PhoneScreenModalContentType = {
      showModal: true,
      modalTopContent: errorMessage,
    };
    phoneNumberLoginScreenParams.modalContent = modalContent;
  }
  navigation.navigate('PhoneNumberLogin', phoneNumberLoginScreenParams);
};

export const dispatchResetStackToLoginScreen = (
  navigation: RootStackNavigationProp
) => {
  popToTop(navigation);
  navigation.navigate('Login', {});
};

export const dispatchResetStackToFatalErrorScreen = (
  navigation: RootStackNavigationProp,
  errorMessage?: string
) => {
  popToTop(navigation);
  navigation.navigate('FatalError', { errorMessage });
};

export const resetStackToHome = (
  navigation: RootStackNavigationProp,
  homeScreenProps?: IHomeScreenRouteProps
) => {
  popToTop(navigation);
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
          params: homeScreenProps ?? {},
        },
      ],
    })
  );
};

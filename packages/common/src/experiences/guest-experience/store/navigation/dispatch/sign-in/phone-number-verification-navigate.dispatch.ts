// Copyright 2021 Prescryptive Health, Inc.

import { RootStackNavigationProp } from '../../../../navigation/stack-navigators/root/root.stack-navigator';
import { IPhoneNumberVerificationScreenRouteProps } from '../../../../phone-number-verification-screen/phone-number-verification-screen';

export const phoneNumberVerificationNavigateDispatch = (
  navigation: RootStackNavigationProp,
  phoneVerificationScreenParams: IPhoneNumberVerificationScreenRouteProps
) => {
  navigation.navigate('PhoneNumberVerification', phoneVerificationScreenParams);
};

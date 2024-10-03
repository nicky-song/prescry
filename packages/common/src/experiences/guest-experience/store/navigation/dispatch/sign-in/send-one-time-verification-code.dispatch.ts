// Copyright 2021 Prescryptive Health, Inc.

import { ICreateAccount } from '../../../../../../models/create-account';
import { Workflow } from '../../../../../../models/workflow';

import {
  PhoneNumberDialingCode,
  PhoneNumberOtherCountryDialingCode,
} from '../../../../../../theming/constants';
import { formatPhoneNumberForApi } from '../../../../../../utils/formatters/phone-number.formatter';
import { sendOneTimePassword } from '../../../../api/api-v1';
import { ReduxGetState } from '../../../../context-providers/redux/redux.context';
import { RootStackNavigationProp } from '../../../../navigation/stack-navigators/root/root.stack-navigator';
import { IPhoneNumberVerificationScreenRouteProps } from '../../../../phone-number-verification-screen/phone-number-verification-screen';
import { phoneNumberVerificationNavigateDispatch } from './phone-number-verification-navigate.dispatch';

export const sendOneTimeVerificationCodeDispatch = async (
  account: ICreateAccount,
  workflow: Workflow,
  reduxGetState: ReduxGetState,
  navigation: RootStackNavigationProp
): Promise<void> => {
  const state = reduxGetState();
  const { config, settings, features } = state;
  const countryCode = features.usecountrycode
    ? PhoneNumberOtherCountryDialingCode
    : PhoneNumberDialingCode;

  const apiConfig = config.apis.guestExperienceApi;
  await sendOneTimePassword(
    apiConfig,
    formatPhoneNumberForApi(account.phoneNumber, countryCode),
    settings.automationToken
  );
  const params: IPhoneNumberVerificationScreenRouteProps = {
    account,
    workflow,
    phoneNumber: account.phoneNumber,
  };

  phoneNumberVerificationNavigateDispatch(navigation, params);
};

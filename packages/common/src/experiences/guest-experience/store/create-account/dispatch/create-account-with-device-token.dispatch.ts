// Copyright 2021 Prescryptive Health, Inc.

import { InternalResponseCode } from '../../../../../errors/error-codes';
import { loginUser } from '../../../api/api-v1';
import { ICreateAccountDeviceTokenAsyncActionArgs } from '../async-actions/create-account-with-device-token.async-action';
import { ICreatePinScreenRouteProps } from './../../../create-pin-screen/create-pin-screen';

export const createAccountWithDeviceTokenDispatch = async ({
  account,
  workflow,
  reduxGetState,
  navigation,
}: ICreateAccountDeviceTokenAsyncActionArgs) => {
  const state = reduxGetState();
  const guestExperienceApi = state.config.apis.guestExperienceApi;
  const response = await loginUser(
    guestExperienceApi,
    account,
    state.settings.deviceToken
  );

  if (response.responseCode === InternalResponseCode.REQUIRE_USER_SET_PIN) {
    const createPinScreenParams: ICreatePinScreenRouteProps = {
      workflow,
    };
    navigation.navigate('CreatePin', createPinScreenParams);
  }
};

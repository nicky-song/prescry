// Copyright 2022 Prescryptive Health, Inc.

import { InternalResponseCode } from '../../../../../errors/error-codes';
import { loginExternalSso } from '../../../api/api-v1';

import { guestExperienceExceptionLogger } from '../../../guest-experience-logger.middleware';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';

import { verifySessionDispatch } from './verify-session.dispatch';

import type { SsoExternalLoginActionArgs } from '../async-actions/sso-experience.actions';
import { authenticatedExperienceDispatch } from './authenticated-experience.dispatch';
import { ReduxDispatch } from '../../../context-providers/redux/redux.context';

export const loginWithSsoJwtDispatch = async (
  args: SsoExternalLoginActionArgs
) => {
  const { jwtToken, dispatch, getState, navigation, group_number } = args;

  const state = getState();
  const features = state.features;

  if (!features.usesso) {
    navigation.navigate('UnauthHome');
    return;
  }
  const guestExperienceApi = state.config.apis.guestExperienceApi;

  try {
    const response = await loginExternalSso(guestExperienceApi, jwtToken);

    if (response?.data?.deviceToken) {
      await tokenUpdateDispatch(
        dispatch,
        response.data?.accountToken,
        response.data.deviceToken
      );
    }

    const isSessionInvalid = await verifySessionDispatch(
      dispatch,
      getState,
      navigation
    );

    if (!isSessionInvalid) {
      await authenticatedExperienceDispatch(
        dispatch as ReduxDispatch,
        getState,
        navigation
      );
      return;
    }

    switch (response.responseCode) {
      case InternalResponseCode.REQUIRE_USER_SET_PIN:
        navigation.navigate('CreatePin', { workflow: 'pbmActivate' });
        break;
      case InternalResponseCode.REQUIRE_USER_VERIFY_PIN:
        navigation.navigate('LoginPin', {});
        break;
      case InternalResponseCode.GENERAL_MIN_AGE_NOT_MET:
        navigation.navigate('ContactCaregiver', { group_number });
        break;
      default:
        navigation.navigate('CreateAccount', {
          workflow: 'pbmActivate',
          errorType: 'ssoError',
        });
        break;
    }
  } catch (error) {
    guestExperienceExceptionLogger(error as Error);
    navigation.navigate('CreateAccount', {
      workflow: 'pbmActivate',
      errorType: 'ssoError',
    });
  }
};

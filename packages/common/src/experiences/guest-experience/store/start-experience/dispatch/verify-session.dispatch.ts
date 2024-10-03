// Copyright 2020 Prescryptive Health, Inc.

import { dispatchResetStackToPhoneLoginScreen } from '../../navigation/navigation-reducer.actions';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { getSession } from '../../../api/api-v1.session';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { ISessionResponse } from '../../../../../models/api-response/session-response';
import {
  ISetIdentityVerificationEmailFlagAction,
  setIdentityVerificationEmailFlagAction,
} from '../../identity-verification/actions/set-identity-verification-email-flag.action';
import {
  ISetUserAuthenticatedAction,
  setUserAuthenticatedAction,
} from '../../secure-pin/secure-pin-reducer.actions';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { IPbmMemberBenefitsScreenRouteProps } from '../../../screens/unauth/pbm-member-benefits/pbm-member-benefits.screen';
import { ICreatePinScreenRouteProps } from './../../../create-pin-screen/create-pin-screen';
import { IAccountLockedScreenRouteProps } from '../../../screens/sign-in/account-locked/account-locked.screen';
import { ILoginScreenRouteProps } from '../../../login-screen/login-screen';
import { getClaimAlertOrPrescriptionIdFromUrl } from '../../../../../utils/claimalert-prescription.helper';

export type IDispatchVerifySessionActionType =
  | ISetIdentityVerificationEmailFlagAction
  | ISetUserAuthenticatedAction;

export const verifySessionDispatch = async (
  dispatch: Dispatch<IDispatchVerifySessionActionType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp
): Promise<boolean> => {
  const { settings, config } = getState();
  try {
    const response: ISessionResponse = await getSession(
      config.apis.guestExperienceApi,
      getEndpointRetryPolicy,
      settings.token,
      settings.deviceToken
    );
    dispatch(
      setIdentityVerificationEmailFlagAction({
        recoveryEmailExists: response.data?.recoveryEmailExists || false,
      })
    );

    if (response.responseCode === 'SESSION_VALID') {
      dispatch(setUserAuthenticatedAction(true));
      return false;
    }

    dispatch(setUserAuthenticatedAction(false));

    if (response.responseCode === 'REQUIRE_USER_VERIFY_PIN') {
      navigation.navigate('LoginPin', {});
      return true;
    }
    if (response.responseCode === 'REQUIRE_USER_SET_PIN') {
      const createPinScreenParams: ICreatePinScreenRouteProps = {};
      navigation.navigate('CreatePin', createPinScreenParams);
      return true;
    }
    if (response.responseCode === 'REQUIRE_USER_REGISTRATION') {
      const resource = (config.location?.pathname || '')
        .replace(/\//g, '')
        .trim()
        .toLowerCase();
      if (resource === 'activate') {
        navigation.navigate('CreateAccount', { workflow: 'pbmActivate' });
        return true;
      }
      if (config.location?.pathname) {
        const getClaimAlertOrPrescriptionInfo =
          getClaimAlertOrPrescriptionIdFromUrl(config.location?.pathname);
        if (getClaimAlertOrPrescriptionInfo) {
          const loginScreenProps: ILoginScreenRouteProps = {
            claimAlertId: getClaimAlertOrPrescriptionInfo.claimAlertId,
            prescriptionId: getClaimAlertOrPrescriptionInfo.prescriptionId,
            isBlockchain: getClaimAlertOrPrescriptionInfo.isBlockchain,
          };

          navigation.navigate('Login', loginScreenProps);
          return true;
        }
      }
      navigation.navigate('Login', {});
      return true;
    }
    if (response.responseCode === 'SHOW_FORGET_PIN') {
      navigation.navigate('AccountLocked', {});
      return true;
    }

    if (response.responseCode === 'SHOW_ACCOUNT_LOCKED') {
      const accountLockedScreenRouteProps: IAccountLockedScreenRouteProps = {
        accountLockedResponse: true,
      };
      navigation.navigate('AccountLocked', accountLockedScreenRouteProps);
      return true;
    }

    if (response.responseCode === 'INVALID_DEVICE_TOKEN') {
      if (config.location?.pathname === '/activate') {
        navigation.navigate('PbmMemberBenefits', {
          showBackButton: false,
        } as IPbmMemberBenefitsScreenRouteProps);
        return true;
      }
    }

    dispatchResetStackToPhoneLoginScreen(navigation);
  } catch (error) {
    internalErrorDispatch(navigation, error as Error);
  }
  return true;
};

// Copyright 2020 Prescryptive Health, Inc.

import { IDispatchContactInfoActionsType } from '../../member-list-info/member-list-info-reducer.actions';
import { IDispatchInitializePrescriptionsActionTypes } from '../../prescriptions/prescriptions-reducer.actions';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { testResultsDeepNavigateDispatch } from '../../navigation/dispatch/test-results-deep-navigate.dispatch';
import {
  handleKnownAuthenticationErrorAction,
  IDispatchAnyDeepLinkLocationActionsType,
} from '../../root-navigation.actions';
import { checkoutResultDeepNavigateDispatch } from './checkout-result-deep-navigate.dispatch';
import { appointmentDeepNavigateDispatch } from '../../navigation/dispatch/appointment-deep-navigate.dispatch';
import { decodeAscii } from '../../../../../utils/base-64-helper';
import { getPhoneNumberFromDeviceToken } from '../../../../../utils/json-web-token-helper/json-web-token-helper';
import { inviteCodeDeepNavigateDispatch } from '../../navigation/dispatch/invite-code-deep-navigate-dispatch';
import { locationDeepNavigateDispatch } from '../../navigation/dispatch/location-deep-navigate-dispatch';
import { pickAPharmacyDeepNavigateDispatch } from '../../navigation/dispatch/shopping/pick-a-pharmacy-deep-navigate.dispatch';
import { getPrescriptionUserStatusDispatch } from '../../navigation/dispatch/shopping/prescription-user-status.dispatch';
import { appointmentsDeepNavigateDispatch } from '../../navigation/dispatch/appointments-deep-navigate.dispatch';
import { cabinetDeepNavigateDispatch } from '../../navigation/dispatch/cabinet-deep-navigate.dispatch';
import { RootStackNavigationProp } from './../../../navigation/stack-navigators/root/root.stack-navigator';
import { IPbmMemberBenefitsScreenRouteProps } from '../../../screens/unauth/pbm-member-benefits/pbm-member-benefits.screen';
import { ICreateAccountScreenRouteProps } from '../../../screens/sign-in/create-account/create-account.screen';
import { handleCommonErrorAction } from '../../error-handling.actions';
import { ErrorConstants } from '../../../../../theming/constants';
import { prescriptionPersonNavigateDispatch } from '../../navigation/dispatch/account-and-family/prescription-person-navigate.dispatch';
import { vaccineDeepNavigateDispatch } from '../../navigation/dispatch/vaccine-deep-navigate.dispatch';
import { testResultDeepNavigateDispatch } from '../../navigation/dispatch/test-result-deep-navigate.dispatch';
import { popToTop } from '../../../navigation/navigation.helper';
import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { dispatchResetStackToFatalErrorScreen } from '../../navigation/navigation-reducer.actions';

export type IDispatchInitialScreenActionsType =
  | IDispatchInitializePrescriptionsActionTypes
  | IDispatchContactInfoActionsType
  | IDispatchAnyDeepLinkLocationActionsType;

export const deepLinkIfPathNameDispatch = async (
  dispatch: Dispatch<IDispatchInitialScreenActionsType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  isAuthFlow: boolean
) => {
  const {
    settings,
    config: { location },
    features: { useAccount },
  } = getState();

  const resource = (location?.pathname || '')
    .replace(/\//g, '')
    .trim()
    .toLowerCase();

  if (!resource) {
    return false;
  }

  if (resource.startsWith('activate')) {
    if (!isAuthFlow) {
      navigation.navigate('PbmMemberBenefits', {
        showBackButton: false,
      } as IPbmMemberBenefitsScreenRouteProps);

      return true;
    }
    return false;
  }

  if (resource === 'register') {
    if (!isAuthFlow) {
      navigation.navigate('CreateAccount', {
        workflow: 'register',
      } as ICreateAccountScreenRouteProps);
      return true;
    }
    return false;
  }

  if (resource === 'cabinet') {
    await cabinetDeepNavigateDispatch(dispatch, getState, navigation);
    return true;
  }

  if (resource.startsWith('prescription') || resource.startsWith('cabinet')) {
    const pathname = location?.pathname ?? '';
    const isCabinet = resource.startsWith('cabinet');
    const pathIndex = isCabinet ? 3 : 2;
    const isBlockchain = pathname.split('/')[2] === 'bc';

    const prescriptionId = pathname.split('/')[pathIndex];

    if (!prescriptionId) {
      return false;
    }

    if (!isAuthFlow) {
      try {
        const userExists = await getPrescriptionUserStatusDispatch(
          getState,
          prescriptionId,
          isBlockchain
        );

        if (!userExists) {
          if (useAccount) {
            prescriptionPersonNavigateDispatch(
              navigation,
              prescriptionId,
              userExists
            );
          } else {
            const createAccountScreenRouteProps: ICreateAccountScreenRouteProps =
              {
                workflow: 'prescriptionInvite',
                prescriptionId,
                blockchain: isBlockchain,
              };
            navigation.navigate('CreateAccount', createAccountScreenRouteProps);
          }

          return true;
        }
      } catch (error) {
        const { supportEmail } = getState().config;
        await handleCommonErrorAction(
          navigation,
          ErrorConstants.errorForNotFoundPrescription(supportEmail),
          error as Error
        );
        return true;
      }
    }

    await pickAPharmacyDeepNavigateDispatch(
      dispatch,
      getState,
      navigation,
      prescriptionId,
      isBlockchain
    );
    return true;
  }

  if (!isAuthFlow) {
    return false;
  }

  if (resource === 'results') {
    await testResultsDeepNavigateDispatch(dispatch, getState, navigation);
    return true;
  }

  if (resource.startsWith('results')) {
    const parsedPath = location?.pathname.split('/');
    const orderNumber = parsedPath?.[3];
    if (orderNumber) {
      if (parsedPath?.[2] === 'vaccine') {
        await vaccineDeepNavigateDispatch(
          dispatch,
          getState,
          navigation,
          orderNumber
        );
      } else if (parsedPath?.[2] === 'test') {
        await testResultDeepNavigateDispatch(
          dispatch,
          getState,
          navigation,
          orderNumber
        );
      }
    }
    return true;
  }

  if (resource === 'checkoutresult') {
    await checkoutResultDeepNavigateDispatch(dispatch, getState, navigation);
    return true;
  }

  if (resource === 'appointments') {
    await appointmentsDeepNavigateDispatch(dispatch, getState, navigation);
    return true;
  }

  if (resource.startsWith('appointment')) {
    const encodedOrdernumber = location?.pathname.split('/')[2];
    if (!settings.deviceToken) {
      return false;
    }
    const deviceNumber = getPhoneNumberFromDeviceToken(settings.deviceToken);
    if (!encodedOrdernumber) return false;
    const appointmentDetail = decodeAscii(encodedOrdernumber);
    const params = appointmentDetail.split(' ');
    const orderNumber = params[0];
    const phoneNumber = params[1];
    if (deviceNumber !== phoneNumber) return false;
    await appointmentDeepNavigateDispatch(
      dispatch,
      getState,
      navigation,
      orderNumber
    );
    return true;
  }

  if (resource === 'invite') {
    const urlSearchParams = new URLSearchParams(location?.search);

    const inviteCode = urlSearchParams.get('invitecode');
    if (inviteCode) {
      await inviteCodeDeepNavigateDispatch(
        dispatch,
        getState,
        navigation,
        inviteCode
      );
      return true;
    }
  }

  if (location?.pathname.split('/')[1] === 'p') {
    const pathParams = location?.pathname.split('/');
    const base64EncodedLocationId = pathParams[2];
    const base64EncodedServiceType = pathParams[3];
    if (base64EncodedLocationId && base64EncodedServiceType) {
      await locationDeepNavigateDispatch(
        dispatch,
        getState,
        navigation,
        base64EncodedLocationId,
        base64EncodedServiceType
      );
      return true;
    }
  }

  try {
    const redirected = await loadMemberDataDispatch(
      dispatch,
      getState,
      navigation
    );

    if (!redirected) {
      popToTop(navigation);
      navigation.navigate('RootStack', {
        screen: 'ClaimAlertStack',
        params: {
          screen: 'ClaimExperience',
          params: { identifier: resource },
        },
      });
      return true;
    }
  } catch (error) {
    const redirectedToHandleError = handleKnownAuthenticationErrorAction(
      dispatch,
      navigation,
      error as Error
    );

    if (!redirectedToHandleError) {
      dispatchResetStackToFatalErrorScreen(navigation);
    }

    return false;
  }
  return true;
};

// Copyright 2020 Prescryptive Health, Inc.

import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { IDispatchContactInfoActionsType } from '../../member-list-info/member-list-info-reducer.actions';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { IGetTestResultsActionType } from '../../test-result/async-actions/get-test-result.async-action';
import { dispatchResetStackToFatalErrorScreen } from '../../navigation/navigation-reducer.actions';
import {
  CheckoutResultParameter,
  CheckoutResultParameterEnum,
} from '../../../../../models/checkout/checkout-result-parameter';
import { CheckoutProductTypeEnum } from '../../../../../models/checkout/checkout-product-type';
import { ErrorRequestInitialization } from '../../../../../errors/error-request-initialization';
import {
  guestExperienceCustomEventLogger,
  updateTelemetryId,
} from '../../../guest-experience-logger.middleware';
import { cancelBookingDispatch } from '../../appointment/dispatch/cancel-booking.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { navigateAppointmentDetailsScreenDispatch } from '../../navigation/dispatch/navigate-appointment-details-screen-dispatch';
import { popToTop } from '../../../navigation/navigation.helper';

function getCheckoutResultParamValue<V extends string = string>(
  parameterName: CheckoutResultParameter,
  urlSearchParams: URLSearchParams
) {
  const parameter = CheckoutResultParameterEnum[parameterName];
  return getParamValue<V>(parameter, urlSearchParams);
}

function getParamValue<V extends string = string, T extends string = string>(
  parameter: T,
  urlSearchParams: URLSearchParams
) {
  const value = urlSearchParams.get(parameter);
  return value as V;
}

function getCheckoutResultParamValues(queryString?: string) {
  const params = new URLSearchParams(queryString);
  const productType = getCheckoutResultParamValue<CheckoutProductTypeEnum>(
    'ProductType',
    params
  );
  const orderNumber = getCheckoutResultParamValue('OrderNumber', params);
  const sessionId = getCheckoutResultParamValue('SessionId', params);
  const result = getCheckoutResultParamValue('Result', params);
  const operationId = getCheckoutResultParamValue('OperationId', params);

  return {
    productType,
    orderNumber,
    sessionId,
    result,
    operationId,
  };
}

export const checkoutResultDeepNavigateDispatch = async (
  dispatch: Dispatch<
    IGetTestResultsActionType | IDispatchContactInfoActionsType
  >,
  getState: () => RootState,
  navigation: RootStackNavigationProp
) => {
  try {
    const redirected = await loadMemberDataDispatch(
      dispatch,
      getState,
      navigation
    );
    if (redirected) {
      return;
    }

    const state = getState();
    const result = getCheckoutResultParamValues(state.config.location?.search);
    if (result.operationId.length) {
      updateTelemetryId(result.operationId);
    }

    guestExperienceCustomEventLogger(
      'CHECKOUT_SESSION_RESULT_REDIRECT',
      result
    );

    if (result.result === 'cancel') {
      await cancelBookingDispatch(
        dispatch,
        getState,
        navigation,
        result.orderNumber
      );
    }

    switch (result.productType) {
      case 'appointment':
        popToTop(navigation);
        navigateAppointmentDetailsScreenDispatch(
          navigation,
          result.orderNumber,
          false,
          result.result
        );
        return;
    }

    throw new ErrorRequestInitialization(
      CheckoutResultParameterEnum.ProductType
    );
  } catch (error) {
    const redirectedToHandleError = handleKnownAuthenticationErrorAction(
      dispatch,
      navigation,
      error as Error
    );

    if (!redirectedToHandleError) {
      dispatchResetStackToFatalErrorScreen(navigation);
    }
  }
};

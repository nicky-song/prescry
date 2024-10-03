// Copyright 2021 Prescryptive Health, Inc.

import {
  IChangeSlotAction,
  setChangeSlotAction,
} from '../actions/change-slot.action';
import { RootState } from '../../root-reducer';
import { lockSlot } from '../../../api/api-v1.lock-slots';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { unlockSlot } from '../../../api/api-v1.unlock-slots';
import moment from 'moment-timezone';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { IUpdateSettingsAction } from '../../settings/settings-reducer.actions';
import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import {
  changeSlotErrorAction,
  IChangeSlotActionErrorAction,
} from '../actions/change-slot-error.action';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { ErrorConstants } from '../../../../../theming/constants';
import { Dispatch } from 'react';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export type IChangeSlotActionType =
  | IChangeSlotAction
  | IChangeSlotActionErrorAction
  | IDispatchPostLoginApiErrorActionsType
  | IUpdateSettingsAction;

export const changeSlotDispatch = async (
  dispatch: Dispatch<IChangeSlotActionType>,
  getState: () => RootState,
  slotSelected: IAvailableSlot,
  navigation: RootStackNavigationProp
) => {
  const state = getState();
  const { config, settings, appointment } = state;
  const api = config.apis.guestExperienceApi;

  try {
    if (appointment.currentSlot?.bookingId) {
      const responseUnlockSlot = await unlockSlot(
        api,
        appointment.currentSlot.bookingId,
        settings.token,
        settings.deviceToken
      );
      await tokenUpdateDispatch(dispatch, responseUnlockSlot.refreshToken);
    }

    const phoneNumberFromMemberProfile =
      state.memberProfile?.account?.phoneNumber;

    const responseLockSlot = await lockSlot(
      api,
      {
        locationId: appointment.selectedLocation.id,
        startDate: moment
          .tz(slotSelected.start, appointment.selectedLocation.timezone)
          .toDate(),
        customerPhoneNumber:
          phoneNumberFromMemberProfile?.length > 0
            ? phoneNumberFromMemberProfile
            : state.memberListInfo?.loggedInMember?.phoneNumber ?? '',
        serviceType: appointment.selectedService.serviceType,
      },
      settings.token,
      settings.deviceToken
    );
    await tokenUpdateDispatch(dispatch, responseLockSlot.refreshToken);

    dispatch(
      setChangeSlotAction({
        slotName: slotSelected.slotName,
        start: slotSelected.start,
        day: slotSelected.day,
        bookingId: responseLockSlot.data.bookingId,
        slotExpirationDate: responseLockSlot.data.slotExpirationDate,
      })
    );
  } catch (error) {
    if (error instanceof ErrorBadRequest) {
      dispatch(changeSlotErrorAction(ErrorConstants.errorSlotNotAvailable));
    } else {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        navigation
      );
    }
  }
};

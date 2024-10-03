// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../../../../experiences/guest-experience/store/modal-popup/modal-popup.reducer.actions';
import { IAsyncActionArgs } from '../../../../../experiences/guest-experience/state/async-action-args';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../../../../experiences/guest-experience/store/navigation/dispatch/navigate-post-login-error.dispatch';
import { AppointmentsListDispatch } from '../dispatch/appointments-list.dispatch';
import { getAppointmentsListDispatch } from '../dispatch/get-appointments-list.dispatch';
import { IAppointmentListDetails } from '../../../../../components/member/lists/appointments-list/appointments-list';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';

export type IGetAppointmentsListActionType =
  IDispatchPostLoginApiErrorActionsType;

export interface IGetAppointmentsListAsyncActionArgs extends IAsyncActionArgs {
  navigation: AppointmentsStackNavigationProp;
  appointmentsListDispatch: AppointmentsListDispatch;
  appointmentListDetails: IAppointmentListDetails;
}

export const getAppointmentsListAsyncAction = async (
  args: IGetAppointmentsListAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(asyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};

const asyncAction = (args: IGetAppointmentsListAsyncActionArgs) => {
  return async () => {
    try {
      await getAppointmentsListDispatch(args);
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        args.reduxDispatch,
        args.navigation
      );
    }
  };
};

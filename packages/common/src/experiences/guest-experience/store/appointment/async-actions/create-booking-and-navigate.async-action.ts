// Copyright 2020 Prescryptive Health, Inc.

import { RootState } from '../../root-reducer';
import {
  ICreateBookingAndNavigateActionType,
  createBookingAndNavigateDispatch,
} from '../dispatch/create-booking-and-navigate.dispatch';
import {
  IMemberAddress,
  IDependentInformation,
} from '../../../../../models/api-request-body/create-booking.request-body';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { IQuestionAnswer } from '../../../../../models/question-answer';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';

export const createBookingAndNavigateAsyncAction = (data: {
  navigation: AppointmentsStackNavigationProp;
  questions: IQuestionAnswer[];
  insuranceQuestions: IQuestionAnswer[];
  selectedSlot: IAvailableSlot;
  address?: IMemberAddress | undefined;
  dependentInfo?: IDependentInformation | undefined;
}) => {
  return async (
    dispatch: (action: ICreateBookingAndNavigateActionType) => RootState,
    getState: () => RootState
  ) => {
    await createBookingAndNavigateDispatch(
      data.questions,
      data.insuranceQuestions,
      data.selectedSlot,
      dispatch,
      getState,
      data.navigation,
      data.address,
      data.dependentInfo
    );
  };
};

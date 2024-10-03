// Copyright 2020 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { createBookingAndNavigateAsyncAction } from './create-booking-and-navigate.async-action';
import {
  IMemberAddress,
  IDependentInformation,
} from '../../../../../models/api-request-body/create-booking.request-body';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { IQuestionAnswer } from '../../../../../models/question-answer';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';

export const createBookingAndNavigateDataLoadingAsyncAction = (
  navigation: AppointmentsStackNavigationProp,
  questions: IQuestionAnswer[],
  insuranceQuestions: IQuestionAnswer[],
  selectedSlot: IAvailableSlot,
  address?: IMemberAddress,
  dependentInfo?: IDependentInformation
) =>
  dataLoadingAction(
    createBookingAndNavigateAsyncAction,
    {
      navigation,
      questions,
      selectedSlot,
      address,
      dependentInfo,
      insuranceQuestions,
    },
    true
  );

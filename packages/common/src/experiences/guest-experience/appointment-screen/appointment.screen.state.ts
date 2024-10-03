// Copyright 2021 Prescryptive Health, Inc.

import {
  IMemberAddress,
  IDependentInformation,
} from '../../../models/api-request-body/create-booking.request-body';
import { IAvailableSlot } from '../../../models/api-response/available-slots-response';
import { IQuestionAnswer } from '../../../models/question-answer';

export interface IAppointmentScreenState {
  hasSlotExpired?: boolean;
  questionAnswers: IQuestionAnswer[];
  selectedSlot?: IAvailableSlot;
  memberAddress?: IMemberAddress;
  selectedDate: boolean;
  selectedOnce: boolean;
  dependentInfo?: IDependentInformation;
  selectedMemberType: number;
  consentAccepted: boolean;
}

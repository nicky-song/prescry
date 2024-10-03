// Copyright 2020 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { createBookingAndNavigateDataLoadingAsyncAction } from './create-booking-and-navigate-data-loading.async-action';
import { createBookingAndNavigateAsyncAction } from './create-booking-and-navigate.async-action';
import { IMemberAddress } from '../../../../../models/api-request-body/create-booking.request-body';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { IQuestionAnswer } from '../../../../../models/question-answer';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { insuranceQuestionsMock } from '../../../appointment-screen/__mocks__/insurance-question-answer.mock';

jest.mock('../../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));

const dataLoadingActionMock = dataLoadingAction as jest.Mock;
const questions: IQuestionAnswer[] = [
  {
    questionId: '1',
    questionText: 'question-1',
    answer: 'answer1',
  },
  {
    questionId: '2',
    questionText: 'question-2',
    answer: 'answer2',
  },
];

const selectedSlot: IAvailableSlot = {
  start: '2020-07-03T08:00:00',
  day: '2020-07-03',
  slotName: '8:15 am',
};

const address: IMemberAddress = {
  address1: 'address',
  county: 'county',
  state: 'state',
  city: 'city',
  zip: '11111',
};
describe('createBookingAndNavigateDataLoadingAsyncAction', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('Should call dataLoadingAction with member address for first time direct to consumers', async () => {
    const insuranceQuestions = insuranceQuestionsMock;
    await createBookingAndNavigateDataLoadingAsyncAction(
      appointmentsStackNavigationMock,
      questions,
      insuranceQuestions,
      selectedSlot,
      address
    );
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      createBookingAndNavigateAsyncAction,
      {
        navigation: appointmentsStackNavigationMock,
        questions,
        insuranceQuestions,
        selectedSlot,
        address,
      },
      true
    );
  });

  it('Should call dataLoadingAction without member address for other set of users', async () => {
    const insuranceQuestions = insuranceQuestionsMock;
    await createBookingAndNavigateDataLoadingAsyncAction(
      appointmentsStackNavigationMock,
      questions,
      insuranceQuestions,
      selectedSlot
    );
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      createBookingAndNavigateAsyncAction,
      {
        navigation: appointmentsStackNavigationMock,
        questions,
        insuranceQuestions,
        selectedSlot,
        undefined,
      },
      true
    );
  });
});

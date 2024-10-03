// Copyright 2020 Prescryptive Health, Inc.

import { createBookingAndNavigateAsyncAction } from './create-booking-and-navigate.async-action';
import { createBookingAndNavigateDispatch } from '../dispatch/create-booking-and-navigate.dispatch';
import { IMemberAddress } from '../../../../../models/api-request-body/create-booking.request-body';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { IQuestionAnswer } from '../../../../../models/question-answer';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { insuranceQuestionsMock } from '../../../appointment-screen/__mocks__/insurance-question-answer.mock';

jest.mock('../dispatch/create-booking-and-navigate.dispatch');
const createBookingAndNavigateDispatchMock =
  createBookingAndNavigateDispatch as jest.Mock;

const getStateMock = jest.fn();
const dispatchMock = jest.fn();
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

describe('createBookingAndNavigateAsyncAction', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    createBookingAndNavigateDispatchMock.mockReset();
  });

  it('calls createBookingAndNavigateDispatch with member address for first time CASH users', async () => {
    const address: IMemberAddress = {
      address1: 'address1',
      state: 'sate',
      city: 'city',
      zip: 'zip',
      county: 'county',
    };
    const insuranceQuestions = insuranceQuestionsMock;

    const asyncAction = createBookingAndNavigateAsyncAction({
      navigation: appointmentsStackNavigationMock,
      questions,
      insuranceQuestions,
      selectedSlot,
      address,
    });

    await asyncAction(dispatchMock, getStateMock);

    expect(createBookingAndNavigateDispatch).toHaveBeenCalledWith(
      questions,
      insuranceQuestions,
      selectedSlot,
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      address,
      undefined
    );
  });

  it('calls createBookingAndNavigateDispatch without member address for not first time users', async () => {
    const insuranceQuestions = insuranceQuestionsMock;
    const asyncAction = createBookingAndNavigateAsyncAction({
      navigation: appointmentsStackNavigationMock,
      questions,
      insuranceQuestions,
      selectedSlot,
    });

    await asyncAction(dispatchMock, getStateMock);
    expect(createBookingAndNavigateDispatch).toHaveBeenCalledWith(
      questions,
      insuranceQuestions,
      selectedSlot,
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      undefined,
      undefined
    );
  });
});

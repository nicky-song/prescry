// Copyright 2020 Prescryptive Health, Inc.

import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { createBooking } from '../../../api/api-v1.create-booking';
import { ICreateBookingAndNavigateActionType } from './create-booking-and-navigate.dispatch';
import {
  ICreateBookingRequestBody,
  IMemberAddress,
  IDependentInformation,
} from '../../../../../models/api-request-body/create-booking.request-body';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { GuestExperiencePayments } from '../../../guest-experience-payments';
import { createBookingResponseAction } from '../actions/create-booking-response.action';
import { getAppointmentDetails } from '../../../api/api-v1.get-appointment-details';
import { ErrorNotFound } from '../../../../../errors/error-not-found';
import { ErrorConstants } from '../../../../../theming/constants';
import { ICancelBookingRequestBody } from '../../../../../models/api-request-body/cancel-booking.request-body';
import { cancelBooking } from '../../../api/api-v1.cancel-booking';
import { IQuestionAnswer } from '../../../../../models/question-answer';
import { mapAnswersToInsuranceInformation } from '../../../../../utils/answer.helper';
import { IInsuranceInformation } from '../../../../../models/insurance-card';

interface ICreateBookingDispatchResponseProps {
  appointmentId?: string;
  appointmentLink: string;
}

export const createBookingDispatch = async (
  questions: IQuestionAnswer[],
  insuranceQuestions: IQuestionAnswer[],
  selectedSlot: IAvailableSlot,
  dispatch: Dispatch<ICreateBookingAndNavigateActionType>,
  getState: () => RootState,
  memberAddress?: IMemberAddress,
  dependentInfo?: IDependentInformation
): Promise<ICreateBookingDispatchResponseProps | undefined> => {
  const state = getState();
  const { config, settings, appointment } = state;
  const api = config.apis.guestExperienceApi;
  const { selectedLocation, selectedService, inviteCode } = appointment;

  const insuranceInformationAnswers =
    mapAnswersToInsuranceInformation(insuranceQuestions);

  const insuranceInformation: IInsuranceInformation = {
    insuranceCard: {
      firstName: '',
      lastName: '',
      memberId: insuranceInformationAnswers.memberId,
      dateOfBirth: '',
      payerId: insuranceInformationAnswers.name,
      policyId: '',
      groupId: insuranceInformationAnswers.groupId,
      payerName: insuranceInformationAnswers.name,
      isActive: true,
    },
    policyHolder: {
      policyHolder: insuranceInformationAnswers.policyHolder,
      policyHolderFirstName: insuranceInformationAnswers.policyHolderFirstName,
      policyHolderLastName: insuranceInformationAnswers.policyHolderLastName,
      policyHolderDOB: insuranceInformationAnswers.policyHolderDOB,
    },
  };

  if (selectedLocation && selectedService) {
    const createBookingRequestBody: ICreateBookingRequestBody = {
      experienceBaseUrl: state.config.payments.experienceBaseUrl,
      locationId: selectedLocation.id,
      serviceType: selectedService.serviceType,
      start: selectedSlot.start,
      questions,
      ...(memberAddress && { memberAddress }),
      ...(dependentInfo && { dependentInfo }),
      ...(inviteCode && { inviteCode }),
      bookingId: appointment.currentSlot?.bookingId ?? appointment.bookingId,
      insuranceInformation,
    };
    const response = await createBooking(
      api,
      createBookingRequestBody,
      settings.token,
      settings.deviceToken
    );
    await tokenUpdateDispatch(dispatch, response.refreshToken);
    dispatch(createBookingResponseAction(response.data.appointment));

    let appointmentDetails = null;
    while (
      appointmentDetails === null ||
      (appointmentDetails &&
        appointmentDetails.data.appointment?.status !== 'Accepted')
    ) {
      await new Promise((r) =>
        setTimeout(r, settings.dataRefreshIntervalMilliseconds)
      );
      appointmentDetails = await getAppointmentDetails(
        api,
        response.data.appointment.orderNumber,
        settings.token,
        undefined,
        settings.deviceToken
      );

      if (appointmentDetails.data.appointment?.status === 'Declined') {
        const body: ICancelBookingRequestBody = {
          orderNumber: response.data.appointment.orderNumber,
        };
        await cancelBooking(api, body, settings.token, settings.deviceToken);
        throw new ErrorNotFound(ErrorConstants.errorNotFound);
      }
      if (appointmentDetails.data.appointment?.bookingStatus === 'Cancelled') {
        throw new ErrorNotFound(ErrorConstants.errorNotFound);
      }
    }
    if (response.data.payment) {
      await GuestExperiencePayments.redirectToCheckout(response.data.payment);
    }
    return {
      appointmentId: response.data.appointment.orderNumber,
      appointmentLink: response.data.appointment.appointmentLink,
    };
  }
  return undefined;
};

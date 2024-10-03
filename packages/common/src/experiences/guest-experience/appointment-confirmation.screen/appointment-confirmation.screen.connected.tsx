// Copyright 2020 Prescryptive Health, Inc.

import moment from 'moment';
import { connect } from 'react-redux';
import {
  AppointmentConfirmationScreen,
  IAppointmentConfirmationScreenProps,
  IAppointmentConfirmationScreenDispatchProps,
} from './appointment-confirmation.screen';
import { RootState } from '../store/root-reducer';
import { getAppointmentDetailsDataLoadingAsyncAction } from '../store/appointment/async-actions/get-appointment-details-data-loading.async-action';
import { appointmentConfirmationScreenContent } from './appointment-confirmation.screen.content';
import { cancelAppointmentDataLoadingAsyncAction } from '../store/appointment/async-actions/cancel-appointment-data-loading.async-action';
import { checkCancellableAppointment } from '../../../utils/cancel-appointment.helper';
import dateFormatter from '../../../utils/formatters/date.formatter';
import { IAppointmentItem } from '../../../models/api-response/appointment.response';
import { INavigationScreenProps } from '../navigation/navigation-screen-props';
import { AppointmentConfirmationRouteProp } from '../navigation/stack-navigators/appointments/appointments.stack-navigator';

const getAppointmentStatusContent = (
  bookingStatus: string,
  appointment?: IAppointmentItem,
  isPast?: boolean
) => {
  switch (bookingStatus) {
    case 'Confirmed':
    case 'Completed':
      if (isPast) {
        return {
          title: appointmentConfirmationScreenContent.pastAppointmentTitle,
          introDescription:
            appointmentConfirmationScreenContent.pastAppointmentDescriptionIntro,
          endingDescription:
            appointmentConfirmationScreenContent.pastAppointmentDescriptionEnding,
        };
      }
      return {
        title: appointmentConfirmationScreenContent.confirmationTitle,
        description: appointment?.confirmationDescription
          ? appointment?.confirmationDescription
          : undefined,
      };
    case 'Cancelled':
    case 'cancel':
      return {
        title: appointmentConfirmationScreenContent.appointmentCancelledTitle,
        description:
          appointmentConfirmationScreenContent.appointmentCancelledDescription,
      };
    default:
      return {
        title: appointmentConfirmationScreenContent.appointmentRequestedTitle,
        description:
          appointmentConfirmationScreenContent.appointmentRequestedDescription,
      };
  }
};

export const mapStateToProps = (
  state: RootState,
  ownProps?: Partial<IAppointmentConfirmationScreenProps> &
    INavigationScreenProps<AppointmentConfirmationRouteProp>
): IAppointmentConfirmationScreenProps => {
  const appointmentStatusParam = ownProps?.route?.params?.appointmentStatus;
  const patientName = state.appointment.appointmentDetails?.customerName ?? '';
  const paymentStatus = state.appointment.appointmentDetails?.paymentStatus;
  const cancelSuccess = state.appointment.appointmentCanceledSuccess;
  const cancelWindowHours = state.config.cancelAppointmentWindowHours;
  const supportEmail = state.config.supportEmail;
  const { appointmentDetails, appointmentConfirmation } = state.appointment;
  const appointment = appointmentDetails ?? appointmentConfirmation;
  const isAppointmentCancelled = appointmentStatusParam === 'cancel';
  const cancelWindowHoursNum: number = +cancelWindowHours;
  const bookingStatus =
    (isAppointmentCancelled
      ? appointmentStatusParam
      : appointment?.bookingStatus) ?? '';
  const isPastAppointment = appointment?.startInUtc
    ? moment(appointment.startInUtc).isBefore(moment.utc())
    : false;
  const { title, description, introDescription, endingDescription } =
    getAppointmentStatusContent(bookingStatus, appointment, isPastAppointment);
  const isCancellableAppointment = () => {
    if (appointment?.bookingStatus !== 'Confirmed') {
      return false;
    }
    return checkCancellableAppointment(
      cancelWindowHoursNum,
      appointment?.startInUtc
    );
  };
  const day = dateFormatter.getDayFromDate(appointment?.date || '');
  return {
    patientName,
    appointmentInfoAvailable: !!appointment,
    appointmentDate: day
      ? `${day}, ${appointment?.date}`
      : appointment?.date || '',
    appointmentTime: appointment?.time || '',
    bookingStatus,
    confirmationDetails: description ?? '',
    confirmationTitle: title,
    confirmationDetailsIntro: introDescription || '',
    confirmationDetailsEnding: endingDescription || '',
    location: {
      name: appointment?.locationName || '',
      addressLine1: appointment?.address1 || '',
      addressLine2: appointment?.address2 || '',
      city: appointment?.city || '',
      state: appointment?.state || '',
      zip: appointment?.zip || '',
    },
    appointment: appointment ?? ({} as IAppointmentItem),
    isPastAppointment,
    isCancellableAppointment: isCancellableAppointment(),
    paymentStatus,
    cancelSuccess,
    cancelWindowHours,
    supportEmail,
    ...ownProps,
  };
};

export const actions: IAppointmentConfirmationScreenDispatchProps = {
  getAppointment: getAppointmentDetailsDataLoadingAsyncAction,
  cancelAppointment: cancelAppointmentDataLoadingAsyncAction,
};

export const AppointmentConfirmationScreenConnected = connect(
  mapStateToProps,
  actions
)(AppointmentConfirmationScreen);

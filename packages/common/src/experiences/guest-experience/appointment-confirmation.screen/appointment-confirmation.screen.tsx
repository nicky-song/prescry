// Copyright 2020 Prescryptive Health, Inc.

import React, { ReactNode, useEffect, useState } from 'react';
import { View } from 'react-native';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { appointmentConfirmationScreenContent } from './appointment-confirmation.screen.content';
import {
  IAppointmentConfirmationMessageProps,
  AppointmentConfirmationMessage,
} from '../../../components/appointment-confirmation/appointment-confirmation-message';
import { appointmentConfirmationScreenStyle } from './appointment-confirmation.screen.style';
import { Heading } from '../../../components/member/heading/heading';
import { AppointmentReceipt } from '../../../components/member/appointment-receipt/appointment-receipt';
import { IAppointmentItem } from '../../../models/api-response/appointment.response';
import { PopupModal } from '../../../components/modal/popup-modal/popup-modal';
import { checkCancellableAppointment } from '../../../utils/cancel-appointment.helper';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import { SecondaryButton } from '../../../components/buttons/secondary/secondary.button';
import {
  AppointmentConfirmationRouteProp,
  AppointmentsListNavigationProp,
  AppointmentsStackNavigationProp,
} from '../navigation/stack-navigators/appointments/appointments.stack-navigator';
import { useNavigation, useRoute } from '@react-navigation/native';
import { navigateAppointmentsListScreenDispatch } from '../store/navigation/dispatch/navigate-appointments-list-screen.dispatch';
import { navigateHomeScreenNoApiRefreshDispatch } from '../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { HomeButton } from '../../../components/buttons/home/home.button';
import { useUrl } from '../../../hooks/use-url';

export interface IAppointmentConfirmationRouteProps {
  showBackButton: boolean;
  appointmentId: string;
  appointmentStatus?: string;
  appointmentLink?: string;
  backToHome?: boolean;
}
export type IAppointmentConfirmationScreenProps =
  IAppointmentConfirmationMessageProps & {
    patientName: string;
    confirmationTitle: string;
    confirmationDetails: string;
    confirmationDetailsIntro: string;
    confirmationDetailsEnding: string;
    appointmentInfoAvailable: boolean;
    appointment: IAppointmentItem;
    cancelWindowHours: string;
    supportEmail: string;
    isPastAppointment?: boolean;
    showAllResults?: boolean;
    isCancellableAppointment?: boolean;
    cancelSuccess?: boolean;
    paymentStatus?: string;
  };
export interface IAppointmentConfirmationScreenDispatchProps {
  getAppointment: (
    navigation: AppointmentsStackNavigationProp,
    appointmentId: string,
    appointmentLink?: string
  ) => void;
  cancelAppointment: (
    navigation: AppointmentsStackNavigationProp,
    orderNumber: string
  ) => void;
}

export const AppointmentConfirmationScreen = (
  props: IAppointmentConfirmationScreenDispatchProps &
    IAppointmentConfirmationScreenProps
) => {
  const navigation = useNavigation<AppointmentsListNavigationProp>();
  const { params } = useRoute<AppointmentConfirmationRouteProp>();
  const { appointmentId, appointmentLink, showBackButton, backToHome } = params;
  const updateUrl = !!appointmentLink || !!props.appointment.appointmentLink;
  useUrl(
    updateUrl
      ? `/appointment/${appointmentLink ?? props.appointment.appointmentLink}`
      : undefined
  );

  const { getState: reduxGetState } = useReduxContext();
  const [modalToggle, setModalToggle] = useState(false);
  const [errorModalToggle, setErrorModalToggle] = useState(props.cancelSuccess);
  const [cancellableAppointment, setCancellableAppointment] = useState(true);

  useEffect(() => {
    props.getAppointment(navigation, appointmentId);
  }, []);

  function renderReceipt(): ReactNode {
    if (props.appointment.paymentStatus !== 'unpaid')
      return (
        <AppointmentReceipt
          patientName={props.patientName}
          appointment={props.appointment}
        />
      );
    return;
  }

  function toggleModal() {
    setModalToggle(!modalToggle);
  }

  function toggleErrorModal() {
    setErrorModalToggle(!props.cancelSuccess);
  }

  async function onCancelAppointment() {
    if (
      !checkCancellableAppointment(
        +props.cancelWindowHours,
        props.appointment?.startInUtc
      )
    ) {
      toggleModal();
      setCancellableAppointment(!cancellableAppointment);
      return;
    }
    if (appointmentId) {
      toggleModal();
      await props.cancelAppointment(navigation, appointmentId);
    }
  }

  function renderBody() {
    if (!props.appointmentInfoAvailable) {
      return renderEmptyAppointment();
    }
    return renderAppointment();
  }
  function renderEmptyAppointment(): ReactNode {
    return (
      <View
        testID='emptyAppointment'
        style={appointmentConfirmationScreenStyle.bodyViewStyle}
      />
    );
  }

  function renderCancelButton(): ReactNode {
    const isCancelButtonDisabled = !(
      props.isCancellableAppointment && cancellableAppointment
    );

    return (
      <SecondaryButton
        disabled={isCancelButtonDisabled}
        viewStyle={appointmentConfirmationScreenStyle.secondaryButtonViewStyle}
        onPress={toggleModal}
        testID='appointmentConfirmationCancelButton'
      >
        {appointmentConfirmationScreenContent.cancelButtonLabel}
      </SecondaryButton>
    );
  }

  function renderModal(): ReactNode {
    const { modalTopContent, modalPrimaryContent, modalSecondaryContent } =
      appointmentConfirmationScreenContent;
    return (
      <PopupModal
        key='appointment-cancel'
        content={modalTopContent}
        isOpen={modalToggle}
        primaryButtonLabel={modalPrimaryContent}
        secondaryButtonLabel={modalSecondaryContent}
        onPrimaryButtonPress={onCancelAppointment}
        onSecondaryButtonPress={toggleModal}
        primaryButtonTestID='appointmentConfirmationPopupModelCancelButton'
        secondaryButtonTestID='appointmentConfirmationPopupModelKeepButton'
      />
    );
  }

  const isCancelConfirmationOpen =
    props.cancelSuccess && !props.cancelSuccess && !errorModalToggle;

  function renderErrorModal(): ReactNode {
    const { errorModalTopContent, errorModalPrimaryContent } =
      appointmentConfirmationScreenContent;

    const parameterMap = new Map<string, string>([
      ['support-email', props.supportEmail],
    ]);

    const formattedDetails = StringFormatter.format(
      errorModalTopContent,
      parameterMap
    );

    return (
      <PopupModal
        key='confirmation-error'
        content={formattedDetails}
        isOpen={isCancelConfirmationOpen}
        primaryButtonLabel={errorModalPrimaryContent}
        onPrimaryButtonPress={toggleErrorModal}
      />
    );
  }
  const onHomeButtonPress = () => {
    navigateHomeScreenNoApiRefreshDispatch(reduxGetState, navigation);
  };

  function renderAppointment(): ReactNode {
    return (
      <>
        <View
          style={appointmentConfirmationScreenStyle.bodyViewStyle}
          testID='appointmentConfirmationView'
        >
          <Heading
            textStyle={appointmentConfirmationScreenStyle.titleTextStyle}
          >
            {props.confirmationTitle}
          </Heading>
          <AppointmentConfirmationMessage {...props} />
        </View>
        {renderReceipt()}
        <View style={appointmentConfirmationScreenStyle.bodyViewStyle}>
          <HomeButton
            disabled={false}
            onPress={onHomeButtonPress}
            testID='appointmentConfirmationHomeButton'
          />
          {renderCancelButton()}
        </View>
      </>
    );
  }

  const onBackButtonClick = showBackButton
    ? props.cancelSuccess
      ? undefined
      : () => navigateAppointmentsListScreenDispatch(navigation, !!backToHome)
    : undefined;

  const { headerViewStyle } = appointmentConfirmationScreenStyle;

  return (
    <BasicPageConnected
      navigateBack={onBackButtonClick}
      body={renderBody()}
      header={undefined}
      headerViewStyle={headerViewStyle}
      hideNavigationMenuButton={false}
      showProfileAvatar={true}
      modals={[renderModal(), renderErrorModal()]}
      translateContent={true}
    />
  );
};

// Copyright 2020 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import renderer from 'react-test-renderer';
import {
  AppointmentConfirmationScreen,
  IAppointmentConfirmationScreenProps,
  IAppointmentConfirmationScreenDispatchProps,
} from './appointment-confirmation.screen';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { appointmentConfirmationScreenStyle } from './appointment-confirmation.screen.style';
import { IAppointmentItem } from '../../../models/api-response/appointment.response';
import { PaymentStatus } from '../../../models/api-response/create-booking-response';
import { AppointmentReceipt } from '../../../components/member/appointment-receipt/appointment-receipt';
import { appointmentConfirmationScreenContent } from './appointment-confirmation.screen.content';
import { useNavigation, useRoute } from '@react-navigation/native';
import { appointmentsStackNavigationMock } from '../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { navigateAppointmentsListScreenDispatch } from '../store/navigation/dispatch/navigate-appointments-list-screen.dispatch';
import { PopupModal } from '../../../components/modal/popup-modal/popup-modal';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { navigateHomeScreenNoApiRefreshDispatch } from '../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { IReduxContext } from '../context-providers/redux/redux.context';
import { HomeButton } from '../../../components/buttons/home/home.button';
import { useUrl } from '../../../hooks/use-url';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));
jest.mock('@react-navigation/native');
const useRouteMock = useRoute as jest.Mock;
const useNavigationMock = useNavigation as jest.Mock;
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;
jest.mock(
  '../../../components/member/appointment-receipt/appointment-receipt',
  () => ({
    AppointmentReceipt: () => <div />,
  })
);

jest.mock(
  '../../../components/appointment-confirmation/appointment-confirmation-message',
  () => ({
    AppointmentConfirmationMessage: () => <div />,
  })
);
jest.mock('../../../components/modal/popup-modal/popup-modal', () => ({
  PopupModal: () => <div />,
}));

jest.mock(
  '../store/navigation/dispatch/navigate-appointments-list-screen.dispatch'
);
const navigateAppointmentsListScreenDispatchMock =
  navigateAppointmentsListScreenDispatch as jest.Mock;

jest.mock('../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;
const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();

jest.mock(
  '../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch'
);
const navigateHomeScreenNoApiRefreshDispatchMock =
  navigateHomeScreenNoApiRefreshDispatch as jest.Mock;

jest.mock('../../../hooks/use-url');
const useUrlMock = useUrl as jest.Mock;

const appointmentLinkMock = 'appointmentLinkMock';

const appointmentMock = {
  serviceName: '',
  customerName: 'name',
  customerDateOfBirth: '01/01/2000',
  status: 'Accepted',
  orderNumber: '12345',
  address1: '7807 219th ST SW',
  address2: '',
  city: 'Yamika',
  locationName: 'RX Pharmacy',
  state: 'WA',
  zip: '98056',
  date: 'date',
  time: 'time',
  providerTaxId: `123456`,
  descriptionOfService: 'Antigen COVID-19 Test',
  procedureCode: '89456',
  providerLegalName: 'rXPharmacy',
  providerNpi: `123456`,
  totalCost: '$56.75 USD',
  paymentStatus: 'Paid' as PaymentStatus,
  serviceDescription: 'description',
  bookingStatus: 'Confirmed',
  startInUtc: new Date('2020-12-15T13:00:00+0000'),
  serviceType: '',
  appointmentLink: appointmentLinkMock,
} as IAppointmentItem;

const mockAppointmentBookingConfirmationScreenProps: IAppointmentConfirmationScreenProps &
  IAppointmentConfirmationScreenDispatchProps = {
  confirmationTitle: 'Mock Header',
  getAppointment: jest.fn(),
  cancelAppointment: jest.fn(),
  confirmationDetails: '',
  confirmationDetailsIntro: '',
  confirmationDetailsEnding: '',
  appointmentDate: '2020-10-01',
  appointmentTime: '',
  location: {
    name: '',
    addressLine1: '',
    city: '',
    state: '',
    zip: '',
  },
  bookingStatus: 'Confirmed',
  appointmentInfoAvailable: true,
  cancelWindowHours: '6',
  isCancellableAppointment: false,
  supportEmail: 'support@email',
  appointment: appointmentMock,
  patientName: 'Joe Bloggs',
};

const getAppointmentMock =
  mockAppointmentBookingConfirmationScreenProps.getAppointment as jest.Mock;
const stylesheet = appointmentConfirmationScreenStyle;
const propsWithAppointmentMock = {
  ...mockAppointmentBookingConfirmationScreenProps,
  getAppointment: getAppointmentMock,
};
const setModalToggleMock = jest.fn();
const setErrorModalToggleMock = jest.fn();
const setCancellableAppointmentMock = jest.fn();

interface StateReturnValues {
  modalToggle?: boolean;
  errorModalToggle?: boolean;
  cancellableAppointment?: boolean;
}

const stateReset = (props: StateReturnValues) => {
  useStateMock.mockReset();
  useStateMock.mockReturnValueOnce([
    props.modalToggle ?? false,
    setModalToggleMock,
  ]);
  useStateMock.mockReturnValueOnce([
    props.errorModalToggle ?? false,
    setErrorModalToggleMock,
  ]);
  useStateMock.mockReturnValueOnce([
    props.cancellableAppointment ?? true,
    setCancellableAppointmentMock,
  ]);
};

describe('AppointmentConfirmationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigationMock.mockReturnValue(appointmentsStackNavigationMock);
    useRouteMock.mockReturnValue({
      params: {
        showBackButton: false,
        appointmentId: 'appointment-id',
      },
    });
    const reduxContextMock: IReduxContext = {
      getState: reduxGetStateMock,
      dispatch: reduxDispatchMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    stateReset({});
  });

  it('renders as BasicPageConnected with expected properties when navigating from scheduling a test', () => {
    const container = renderer.create(
      <AppointmentConfirmationScreen {...propsWithAppointmentMock} />
    );
    const page = container.root.findByType(BasicPageConnected);
    expect(page.props.navigateBack).toBeUndefined();
    expect(page.props.body).toBeDefined();
    expect(page.props.header).toBeUndefined();
    expect(page.props.headerViewStyle).toEqual(stylesheet.headerViewStyle);
    expect(page.props.hideNavigationMenuButton).toEqual(false);
    expect(page.props.showProfileAvatar).toEqual(true);
    expect(page.props.translateContent).toEqual(true);
  });

  it('update url with appointment deep link if useRoute provides appointmentLink', () => {
    useRouteMock.mockReturnValueOnce({
      params: {
        appointmentLink: appointmentLinkMock,
      },
    });

    renderer.create(
      <AppointmentConfirmationScreen {...propsWithAppointmentMock} />
    );

    expect(useUrlMock).toHaveBeenCalledWith(
      `/appointment/${appointmentLinkMock}`
    );
  });

  it('update url with appointment deep link if props provides appointmentLink', () => {
    const propsWithAppointmentWithAppointmentLinkMock = {
      ...mockAppointmentBookingConfirmationScreenProps,
      getAppointment: getAppointmentMock,
      appointment: {
        ...appointmentMock,
        appointmentLink: appointmentLinkMock,
      },
    };
    renderer.create(
      <AppointmentConfirmationScreen
        {...propsWithAppointmentWithAppointmentLinkMock}
      />
    );

    expect(useUrlMock).toHaveBeenCalledWith(
      `/appointment/${appointmentLinkMock}`
    );
  });

  it('renders as BasicPageConnected with expected properties when navigating from Home/Appointments page', () => {
    useRouteMock.mockReturnValueOnce({
      params: {
        showBackButton: true,
        appointmentId: 'appointment-id',
      },
    });

    const container = renderer.create(
      <AppointmentConfirmationScreen {...propsWithAppointmentMock} />
    );

    const page = container.root.findByType(BasicPageConnected);
    expect(page.props.navigateBack).toBeDefined();
    expect(page.props.body).toBeDefined();
    expect(page.props.header).toBeUndefined();
    expect(page.props.headerViewStyle).toEqual(stylesheet.headerViewStyle);
    expect(page.props.hideNavigationMenuButton).toEqual(false);
    expect(page.props.showProfileAvatar).toEqual(true);
    expect(page.props.translateContent).toEqual(true);
  });

  it('renders body as expected after calling appointment API (when appointmentDetails are available) ', async () => {
    const container = renderer.create(
      <AppointmentConfirmationScreen {...propsWithAppointmentMock} />
    );
    const page = container.root.findByType(BasicPageConnected);
    const appointmentBody = page.props.body;
    const headerView = appointmentBody.props.children[0];
    expect(headerView.props.testID).toBe('appointmentConfirmationView');

    const appointmentHeader = headerView.props.children[0];
    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), []);

    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();

    expect(getAppointmentMock).toHaveBeenCalledWith(
      appointmentsStackNavigationMock,
      'appointment-id'
    );
    expect(appointmentHeader.props.children).toEqual(
      mockAppointmentBookingConfirmationScreenProps.confirmationTitle
    );
    const homeCancelButtonsView = appointmentBody.props.children[2];

    const homeButton = homeCancelButtonsView.props.children[0];
    expect(homeButton.type).toEqual(HomeButton);
    expect(homeButton.props.disabled).toEqual(false);
    expect(homeButton.props.onPress).toEqual(expect.any(Function));
    expect(homeButton.props.testID).toEqual(
      'appointmentConfirmationHomeButton'
    );
  });

  it('dispatches navigating to home screen when home button is pressed ', () => {
    const localProps = {
      ...propsWithAppointmentMock,
      naviateToHome: jest.fn(),
    };
    const container = renderer.create(
      <AppointmentConfirmationScreen {...localProps} />
    );
    const page = container.root.findByType(BasicPageConnected);
    const appointmentBody = page.props.body;
    const homeCancelButtonsView = appointmentBody.props.children[2];
    const homeButton = homeCancelButtonsView.props.children[0];
    homeButton.props.onPress();
    expect(navigateHomeScreenNoApiRefreshDispatchMock).toBeCalledWith(
      reduxGetStateMock,
      appointmentsStackNavigationMock
    );
  });

  it('renders empty body when appointment details are not present(before calling Appointment API)', () => {
    const mockEmptyAppointmentBookingConfirmationScreenProps: IAppointmentConfirmationScreenProps &
      IAppointmentConfirmationScreenDispatchProps = {
      ...propsWithAppointmentMock,
      appointmentInfoAvailable: false,
    };
    const container = renderer.create(
      <AppointmentConfirmationScreen
        {...mockEmptyAppointmentBookingConfirmationScreenProps}
      />
    );
    const page = container.root.findByType(BasicPageConnected);
    const appointmentBody = page.props.body;
    expect(appointmentBody.props.testID).toEqual('emptyAppointment');
    expect(appointmentBody.props.style).toEqual(
      appointmentConfirmationScreenStyle.bodyViewStyle
    );
  });

  it('renders appointmentReceipt with expected properties ', () => {
    const container = renderer.create(
      <AppointmentConfirmationScreen {...propsWithAppointmentMock} />
    );
    const page = container.root.findByType(BasicPageConnected);
    const body = page.props.body;
    const receipt = body.props.children[1];
    expect(receipt.type).toEqual(AppointmentReceipt);
    expect(receipt.props.patientName).toEqual(
      mockAppointmentBookingConfirmationScreenProps.patientName
    );
    expect(receipt.props.appointment).toEqual(
      mockAppointmentBookingConfirmationScreenProps.appointment
    );
  });

  it('does not render appointmentReceipt when payment status is unpaid ', () => {
    const container = renderer.create(
      <AppointmentConfirmationScreen
        {...propsWithAppointmentMock}
        appointment={{
          ...propsWithAppointmentMock.appointment,
          paymentStatus: 'unpaid',
        }}
      />
    );
    const page = container.root.findByType(BasicPageConnected);
    const body = page.props.body;
    const receipt = body.props.children[1];

    expect(receipt).toBeUndefined();
  });

  it('renders cancel appointment button when isCancellableAppointment is true', () => {
    const container = renderer.create(
      <AppointmentConfirmationScreen
        {...propsWithAppointmentMock}
        isCancellableAppointment={true}
      />
    );

    const page = container.root.findByType(BasicPageConnected);
    const body = page.props.body;
    const cancelButton = body.props.children[2].props.children[1];

    expect(cancelButton.props.children).toEqual(
      appointmentConfirmationScreenContent.cancelButtonLabel
    );
    expect(cancelButton.props.disabled).toBe(false);
    expect(cancelButton.props.testID).toEqual(
      'appointmentConfirmationCancelButton'
    );
  });

  it('renders popup modal correctly', () => {
    stateReset({ modalToggle: true });
    const container = renderer.create(
      <AppointmentConfirmationScreen
        {...propsWithAppointmentMock}
        isCancellableAppointment={true}
      />
    );

    const page = container.root.findByType(BasicPageConnected);
    const cancelModal = page.props.modals[0];

    expect(cancelModal.type).toEqual(PopupModal);
    expect(cancelModal.key).toEqual('appointment-cancel');
    expect(cancelModal.props.content).toEqual(
      appointmentConfirmationScreenContent.modalTopContent
    );
    expect(cancelModal.props.isOpen).toEqual(true);
    expect(cancelModal.props.primaryButtonLabel).toEqual(
      appointmentConfirmationScreenContent.modalPrimaryContent
    );
    expect(cancelModal.props.secondaryButtonLabel).toEqual(
      appointmentConfirmationScreenContent.modalSecondaryContent
    );
    expect(cancelModal.props.primaryButtonTestID).toEqual(
      'appointmentConfirmationPopupModelCancelButton'
    );
    expect(cancelModal.props.secondaryButtonTestID).toEqual(
      'appointmentConfirmationPopupModelKeepButton'
    );
  });

  it('renders greyed out cancel appointment button when isCancellableAppointment is false', () => {
    const container = renderer.create(
      <AppointmentConfirmationScreen
        {...propsWithAppointmentMock}
        isCancellableAppointment={false}
      />
    );

    const page = container.root.findByType(BasicPageConnected);
    const body = page.props.body;
    const cancelButton = body.props.children[2].props.children[1];

    expect(cancelButton.props.children).toEqual(
      appointmentConfirmationScreenContent.cancelButtonLabel
    );
    expect(cancelButton.props.disabled).toBe(true);
    expect(cancelButton.props.testID).toEqual(
      'appointmentConfirmationCancelButton'
    );
  });

  it('renders appointmentReceipt when servicetype is vaccine', () => {
    const container = renderer.create(
      <AppointmentConfirmationScreen
        {...propsWithAppointmentMock}
        appointment={{
          ...propsWithAppointmentMock.appointment,
          serviceType: 'C19Vaccine',
        }}
      />
    );
    const page = container.root.findByType(BasicPageConnected);
    const body = page.props.body;
    const receipt = body.props.children[1];

    expect(receipt.type).toEqual(AppointmentReceipt);
    expect(receipt.props.patientName).toEqual(
      propsWithAppointmentMock.patientName
    );
    expect(receipt.props.appointment).toEqual({
      ...propsWithAppointmentMock.appointment,
      serviceType: 'C19Vaccine',
    });
  });

  it('dispatches navigateAppointmentsListScreenDispatch when back button is clicked and backToButton is true', () => {
    useRouteMock.mockReturnValueOnce({
      params: {
        showBackButton: true,
        appointmentId: 'appointment-id',
        backToHome: true,
      },
    });

    const container = renderer.create(
      <AppointmentConfirmationScreen {...propsWithAppointmentMock} />
    );

    const page = container.root.findByType(BasicPageConnected);
    page.props.navigateBack();
    expect(navigateAppointmentsListScreenDispatchMock).toHaveBeenCalledWith(
      appointmentsStackNavigationMock,
      true
    );
  });

  it('dispatches navigateAppointmentsListScreenDispatch when back button is clicked and backToButton is false', () => {
    useRouteMock.mockReturnValueOnce({
      params: {
        showBackButton: true,
        appointmentId: 'appointment-id',
      },
    });

    const container = renderer.create(
      <AppointmentConfirmationScreen {...propsWithAppointmentMock} />
    );

    const page = container.root.findByType(BasicPageConnected);
    page.props.navigateBack();
    expect(navigateAppointmentsListScreenDispatchMock).toHaveBeenCalledWith(
      appointmentsStackNavigationMock,
      false
    );
  });
});

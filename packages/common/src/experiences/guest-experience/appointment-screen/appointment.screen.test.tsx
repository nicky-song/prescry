// Copyright 2020 Prescryptive Health, Inc.

import React, { useEffect, useReducer, useRef, useState } from 'react';
import { View } from 'react-native';
import renderer, {
  ReactTestInstance,
  ReactTestRenderer,
} from 'react-test-renderer';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import {
  IAppointmentScreenActionProps,
  AppointmentScreen,
  IAppointmentScreenProps,
} from './appointment.screen';
import { AppointmentInstructions } from '../../../components/member/appointment-instructions/appointment-instructions';
import { AppointmentLocation } from '../../../components/member/appointment-location/appointment-location';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { TimeSlotPicker } from '../../../components/member/time-slot-picker/time-slot-picker';
import { SurveyAnswerType } from '../../../models/survey-questions';
import {
  IDependentInformation,
  IMemberAddress,
} from '../../../models/api-request-body/create-booking.request-body';
import { appointmentScreenContent } from './appointment.screen.content';
import { CreateAppointmentForm } from '../../../components/member/create-appointment-form/create-appointment-form';
import {
  IServiceQuestion,
  ServiceTypes,
} from '../../../models/provider-location';
import { LinkCheckbox } from '../../../components/member/checkboxes/link/link.checkbox';
import { ISelectedSlot } from '../store/appointment/actions/change-slot.action';
import moment from 'moment';
import { RxGroupTypesEnum } from '../../../models/member-profile/member-profile-info';
import { getChildren } from '../../../testing/test.helper';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { appointmentScreenStyles } from './appointment.screen.styles';
import { BaseText } from '../../../components/text/base-text/base-text';
import { Heading } from '../../../components/member/heading/heading';
import { SurveyItem } from '../../../components/member/survey/survey-item/survey-item';
import { AppointmentCalendar } from '../../../components/member/appointment-calendar/appointment-calendar';
import { IAppointmentScreenState } from './appointment.screen.state';
import { availableSlotMock } from './__mocks__/available-slot.mock';
import { memberAddressMock } from './__mocks__/member-address.mock';
import {
  questionAnswer1Mock,
  questionAnswer2Mock,
} from './__mocks__/question-answer.mock';
import { IQuestionAnswer } from '../../../models/question-answer';
import { appointmentScreenReducer } from './appointment.screen.reducer';
import { setAnswerDispatch } from './dispatch/set-answer.dispatch';
import { slotSelectedDispatch } from './dispatch/slot-selected.dispatch';
import { dateSelectedDispatch } from './dispatch/date-selected.dispatch';
import { monthSelectedDispatch } from './dispatch/month-selected.dispatch';
import { IServiceInfo } from '../../../models/api-response/provider-location-details-response';
import dateFormatter from '../../../utils/formatters/date.formatter';
import { dependentInfoMock } from './__mocks__/dependent-info.mock';
import { slotExpiredDispatch } from './dispatch/slot-expired.dispatch';
import { useNavigation, useRoute } from '@react-navigation/native';
import { appointmentsStackNavigationMock } from '../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import {
  areRequiredQuestionsAnswered,
  getAnswerAsString,
} from '../../../utils/answer.helper';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../context-providers/redux/redux.context';
import { consentNavigateAsyncAction } from '../store/navigation/actions/consent-navigate.async-action';
import { navigateHomeScreenNoApiRefreshDispatch } from '../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { LogoClickActionEnum } from '../../../components/app/application-header/application-header';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
  useReducer: jest.fn(),
  useRef: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;
const useReducerMock = useReducer as jest.Mock;
const useRefMock = useRef as jest.Mock;

jest.mock('@react-navigation/native');
const useRouteMock = useRoute as jest.Mock;
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../store/navigation/actions/consent-navigate.async-action');
const consentNavigateAsyncActionMock = consentNavigateAsyncAction as jest.Mock;

interface IStateCalls {
  paymentMethod: [{ id: string; value: string }, jest.Mock];
  insuranceQuestions: [IQuestionAnswer[], jest.Mock];
}

function stateReset({
  paymentMethod = [{ id: '', value: 'creditDebitCard' }, jest.fn()],
  insuranceQuestions = [[] as IQuestionAnswer[], jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(paymentMethod);
  useStateMock.mockReturnValueOnce(insuranceQuestions);
  useStateMock.mockReturnValue([true, jest.fn()]);
}

jest.mock(
  '../../../components/member/appointment-calendar/appointment-calendar',
  () => ({
    AppointmentCalendar: () => <div />,
  })
);

jest.mock(
  '../../../components/member/appointment-location/appointment-location',
  () => ({
    AppointmentLocation: () => <div />,
  })
);

jest.mock('../../../components/member/checkboxes/link/link.checkbox', () => ({
  LinkCheckbox: () => <div />,
}));

jest.mock(
  '../../../components/member/create-appointment-form/create-appointment-form',
  () => ({
    CreateAppointmentForm: () => <div />,
  })
);

jest.mock('../../../components/member/survey/survey-item/survey-item', () => ({
  SurveyItem: () => <div />,
}));

jest.mock(
  '../../../components/member/time-slot-picker/time-slot-picker',
  () => ({
    TimeSlotPicker: () => <div />,
  })
);
jest.mock('../../../utils/answer.helper');

const getAnswerAsStringMock = getAnswerAsString as jest.Mock;

jest.mock('./dispatch/set-answer.dispatch');
const setAnswerDispatchMock = setAnswerDispatch as jest.Mock;

jest.mock('./dispatch/slot-selected.dispatch');
const slotSelectedDispatchMock = slotSelectedDispatch as jest.Mock;

jest.mock('./dispatch/date-selected.dispatch');
const dateSelectedDispatchMock = dateSelectedDispatch as jest.Mock;

jest.mock('./dispatch/month-selected.dispatch');
const monthSelectedDispatchMock = monthSelectedDispatch as jest.Mock;

jest.mock('./dispatch/slot-expired.dispatch');
const slotExpiredDispatchMock = slotExpiredDispatch as jest.Mock;

jest.mock('../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock(
  '../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch'
);
const navigateHomeScreenNoApiRefreshDispatchMock =
  navigateHomeScreenNoApiRefreshDispatch as jest.Mock;

const areRequiredQuestionsAnsweredMock =
  areRequiredQuestionsAnswered as jest.Mock;

const aboutQuestionsDescriptionMyRxMock =
  'Pharmacist will use the information below to better assist you during your appointment';

const mockServiceType = {
  type: 'serviceType',
  serviceNameMyRx: 'serviceName',
  aboutQuestionsDescriptionMyRx: aboutQuestionsDescriptionMyRxMock,
};

const service = {
  serviceName: 'COVID-19 AntiBody Test',
  serviceType: 'COVID-19 Antigen Testing',
  questions: [
    {
      id: '1',
      label:
        'Vehicle - Make / Model / Color (appointment will be delayed if vehicle is not correct)',
      markdownLabel:
        '**Vehicle - Make / Model / Color (appointment will be delayed if vehicle is not correct)**',
      isRequired: true,
      type: 'text' as SurveyAnswerType,
      priority: 1,
    },
    {
      id: '2',
      label: 'Medication Allergies',
      markdownLabel: '**Medication Allergies**',
      description: 'Enter none if no allergies',
      isRequired: true,
      type: 'text' as SurveyAnswerType,
      priority: 1,
    },
    {
      id: '3',
      label: 'Chronic Conditions',
      markdownLabel: '**Chronic Conditions**',
      isRequired: false,
      type: 'text' as SurveyAnswerType,
      priority: 1,
    },
  ],
  screenTitle: 'Schedule Appointment',
  screenDescription:
    'Choose appointment date and time. Testing takes approximately 15 minutes.',
  confirmationTitle: 'Appointment Confirmed',
  confirmationDescription: "You're all set for your appointment on ",
  minLeadDays: 'P6D',
  maxLeadDays: 'P30D',
};
const onBookPressMock = jest.fn();
const onSlotChangeMock = jest.fn();
const onMonthChangeMock = jest.fn();
const mockAppointmentScreenProps: IAppointmentScreenActionProps &
  IAppointmentScreenProps = {
  onBookPressAsync: onBookPressMock,
  onDateSelectedAsync: jest.fn(),
  onSlotChangeAsync: onSlotChangeMock,
  onMonthChangeAsync: onMonthChangeMock,
  resetNewDependentError: jest.fn(),
  slotForDate: [],
  markedDates: {},
  selectedService: service,
  selectedLocation: {
    id: '5e6a23ad138c5d191c68c892',
    providerName: 'Bartell Drugs',
    locationName: 'Seattle',
    address1: '22054 188th Ave W',
    city: 'Seattle',
    state: 'WA',
    zip: '97610',
    phoneNumber: '(425) 937-2481',
    timezone: 'America/Los_Angeles',
    serviceInfo: [service],
  },
  minDay: '2020-07-20',
  maxDay: '2020-08-20',
  rxGroupType: RxGroupTypesEnum.COVID19,
  isMember: false,
  availableSlots: [],
  memberAddress: {} as IMemberAddress,
  cancelWindowHours: '6',
  childMembers: [],
  adultMembers: [],
  serviceTypeInfo: mockServiceType,
};

function getAppointmentForm(
  testRenderer: ReactTestRenderer
): ReactTestInstance {
  const bodyContainer = getBodyContainer(testRenderer);
  return getChildren(bodyContainer)[7];
}

function getCreateAppointmentForm(
  testRenderer: ReactTestRenderer
): ReactTestInstance {
  const form = getAppointmentForm(testRenderer);
  return getChildren(form)[0];
}

function getBodyContainer(testRenderer: ReactTestRenderer): ReactTestInstance {
  const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
  return basicPageConnected.props.body;
}

function getErrorCompoment(testRenderer: ReactTestRenderer): ReactTestInstance {
  const bodyContainer = getBodyContainer(testRenderer);
  return getChildren(bodyContainer)[6];
}

function getQuestionsComponent(
  testRenderer: ReactTestRenderer
): ReactTestInstance {
  const form = getAppointmentForm(testRenderer);
  return getChildren(form)[1];
}

function getBaseButtonComponent(
  testRenderer: ReactTestRenderer
): ReactTestInstance {
  const form = getAppointmentForm(testRenderer);
  return getChildren(form)[3];
}

let savedDateNow: () => number;

const defaultScreenState: Partial<IAppointmentScreenState> = {
  questionAnswers: [],
};

const bookBaseButtonText = 'appointmentScreen-Book-Button';
const continueBaseButtonText = 'appointmentScreen-Continue-Button';

describe('AppointmentScreen', () => {
  const reduxDispatchMock = jest.fn();
  const reduxGetStateMock = jest.fn().mockReturnValue({ features: {} });
  const reduxContextMock: IReduxContext = {
    dispatch: reduxDispatchMock,
    getState: reduxGetStateMock,
  };
  beforeEach(() => {
    jest.clearAllMocks();

    useReduxContextMock.mockReturnValue(reduxContextMock);
    savedDateNow = Date.now;
    Date.now = jest.fn().mockReturnValue(new Date('2021-06-20T13:00:00+0000'));

    useReducerMock.mockReturnValue([defaultScreenState, jest.fn()]);
    useRefMock.mockReturnValue({ current: {} });
    useRouteMock.mockReturnValue({
      params: { showBackButton: true },
    });
    useNavigationMock.mockReturnValue(appointmentsStackNavigationMock);
    areRequiredQuestionsAnsweredMock.mockReturnValue(false);
    stateReset({});
  });

  afterEach(() => {
    Date.now = savedDateNow;
  });

  it('creates initial state correctly', () => {
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);
    renderer.create(<AppointmentScreen {...mockAppointmentScreenProps} />);

    const expectedInitialState: Partial<IAppointmentScreenState> = {
      questionAnswers: [
        {
          questionId: '1',
          questionText:
            'Vehicle - Make / Model / Color (appointment will be delayed if vehicle is not correct)',
          answer: '',
          required: true,
        },
        {
          questionId: '2',
          questionText: 'Medication Allergies',
          answer: '',
          required: true,
        },
        {
          questionId: '3',
          questionText: 'Chronic Conditions',
          answer: '',
          required: false,
        },
      ],
      memberAddress: mockAppointmentScreenProps.memberAddress,
      selectedDate: false,
      selectedOnce: false,
      selectedMemberType: -1,
      dependentInfo: undefined,
      consentAccepted: false,
      hasSlotExpired: false,
    };

    expect(useReducerMock).toHaveBeenCalledTimes(1);
    expect(useReducerMock).toHaveBeenNthCalledWith(
      1,
      appointmentScreenReducer,
      expectedInitialState
    );
  });

  it('has expected number of effect handlers', () => {
    renderer.create(<AppointmentScreen {...mockAppointmentScreenProps} />);

    expect(useEffectMock).toHaveBeenCalledTimes(3);
  });

  it.each([[undefined], ['error']])(
    'scrolls to error, if present (error: %p)',
    (errorMock: undefined | string) => {
      useRefMock.mockReset();

      const scrollViewRefMock = { current: { scrollTo: jest.fn() } };
      useRefMock.mockReturnValueOnce(scrollViewRefMock);

      const errorMessageRefMock = { current: { measure: jest.fn() } };
      useRefMock.mockReturnValueOnce(errorMessageRefMock);

      const dependentErrorMessageRefMock = {
        current: { measure: jest.fn() },
      };
      useRefMock.mockReturnValueOnce(dependentErrorMessageRefMock);

      renderer.create(
        <AppointmentScreen {...mockAppointmentScreenProps} error={errorMock} />
      );

      expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
        errorMock,
      ]);

      const effectHandler = useEffectMock.mock.calls[0][0];
      effectHandler();

      if (!errorMock) {
        expect(errorMessageRefMock.current.measure).not.toHaveBeenCalled();
      } else {
        expect(errorMessageRefMock.current.measure).toHaveBeenCalledWith(
          expect.any(Function)
        );

        const measureHandler =
          errorMessageRefMock.current.measure.mock.calls[0][0];

        const yMock = 100;
        measureHandler(1, yMock);
        expect(scrollViewRefMock.current.scrollTo).toHaveBeenCalledWith(yMock);
      }
    }
  );

  it.each([[undefined], ['error']])(
    'scrolls to dependent error, if present (dependentError: %p)',
    (errorMock: undefined | string) => {
      useRefMock.mockReset();

      const scrollViewRefMock = { current: { scrollTo: jest.fn() } };
      useRefMock.mockReturnValueOnce(scrollViewRefMock);

      const errorMessageRefMock = { current: { measure: jest.fn() } };
      useRefMock.mockReturnValueOnce(errorMessageRefMock);

      const dependentErrorMessageRefMock = {
        current: { measure: jest.fn() },
      };
      useRefMock.mockReturnValueOnce(dependentErrorMessageRefMock);

      renderer.create(
        <AppointmentScreen
          {...mockAppointmentScreenProps}
          dependentError={errorMock}
        />
      );

      expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [
        errorMock,
      ]);

      const effectHandler = useEffectMock.mock.calls[1][0];
      effectHandler();

      if (!errorMock) {
        expect(
          dependentErrorMessageRefMock.current.measure
        ).not.toHaveBeenCalled();
      } else {
        expect(
          dependentErrorMessageRefMock.current.measure
        ).toHaveBeenCalledWith(expect.any(Function));

        const measureHandler =
          dependentErrorMessageRefMock.current.measure.mock.calls[0][0];

        const yMock = 100;
        measureHandler(1, yMock);

        expect(scrollViewRefMock.current.scrollTo).toHaveBeenCalledWith(yMock);
      }
    }
  );

  it('resets slot on expiration', () => {
    jest.useFakeTimers();
    const start = moment(Date());
    const slotExpirationDate = start.add(15, 'minutes');

    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([defaultScreenState, dispatchMock]);

    const currentSlotMock: ISelectedSlot = {
      slotName: '11:00 am',
      start: start.toString(),
      day: start.toString(),
      bookingId: '9be1a6f8-8a84-4453-a2d7-8ce08a355db8',
      slotExpirationDate: slotExpirationDate.toDate(),
    };

    renderer.create(
      <AppointmentScreen
        {...mockAppointmentScreenProps}
        currentSlot={currentSlotMock}
      />
    );

    expect(useEffectMock).toHaveBeenNthCalledWith(3, expect.any(Function), [
      currentSlotMock,
    ]);

    const effectHandler = useEffectMock.mock.calls[2][0];
    effectHandler();

    expect(setTimeout).toHaveBeenCalledTimes(1);
    jest.runOnlyPendingTimers();

    expect(slotExpiredDispatchMock).toHaveBeenCalledWith(dispatchMock);
  });

  it('clears timer if user previously selected a timeslot and set timer to execute after 10 mins from last slot selection', () => {
    jest.useFakeTimers();
    const start = moment(Date());
    const slotExpirationDate = start.add(15, 'minutes');

    const currentSlotMock: ISelectedSlot = {
      slotName: '11:00 am',
      start: start.toString(),
      day: start.toString(),
      bookingId: '9be1a6f8-8a84-4453-a2d7-8ce08a355db8',
      slotExpirationDate: slotExpirationDate.toDate(),
    };

    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([defaultScreenState, dispatchMock]);

    renderer.create(
      <AppointmentScreen
        {...mockAppointmentScreenProps}
        currentSlot={currentSlotMock}
      />
    );

    const effectHandler = useEffectMock.mock.calls[2][0];
    effectHandler();
    effectHandler();

    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledTimes(2);
  });

  it('renders as BasicPageConnected with expected properties', () => {
    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    expect(pageProps.header).toBeUndefined();
    expect(pageProps.navigateBack).toBeDefined();
    expect(pageProps.showProfileAvatar).toBeTruthy();
    expect(pageProps.footer).toBeFalsy();
    expect(pageProps.logoClickAction).toEqual(LogoClickActionEnum.CONFIRM);
    expect(pageProps.translateContent).toEqual(true);
  });
  it('navigate back should be unefined button when both showBackButton & showBackToHome are false', () => {
    useRouteMock.mockReturnValueOnce({
      params: { showBackButton: false, showBackToHome: false },
    });
    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    expect(pageProps.header).toBeUndefined();
    expect(pageProps.navigateBack).toBeUndefined();
    expect(pageProps.showProfileAvatar).toBeTruthy();
    expect(pageProps.footer).toBeFalsy();
  });
  it('navigate back should call navigation.goBack when showBackButton is true', () => {
    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    expect(pageProps.navigateBack).toBeDefined();
    pageProps.navigateBack();
    expect(appointmentsStackNavigationMock.goBack).toBeCalled();
  });
  it('navigate back should call navigateHomeScreenNoApiRefreshDispatch when showBackToHome is true', () => {
    useRouteMock.mockReturnValueOnce({
      params: { showBackButton: false, showBackToHome: true },
    });
    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    expect(pageProps.navigateBack).toBeDefined();
    pageProps.navigateBack();
    expect(appointmentsStackNavigationMock.goBack).not.toBeCalled();
    expect(navigateHomeScreenNoApiRefreshDispatchMock).toBeCalledWith(
      reduxGetStateMock,
      appointmentsStackNavigationMock
    );
  });
  it('renders body without banner for COVID/PCR Tests', () => {
    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPageConnected.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.testID).toEqual('appointmentScreenBody');
    expect(bodyContainer.props.title).toEqual(
      mockAppointmentScreenProps.selectedService.screenTitle
    );
    expect(getChildren(bodyContainer).length).toEqual(8);
  });

  it('renders body with AppointmentInstructions', () => {
    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPageConnected.props.body;
    const appointmentInstructions = getChildren(bodyContainer)[0];

    expect(appointmentInstructions.type).toEqual(AppointmentInstructions);
    expect(appointmentInstructions.props.screenDescription).toEqual(
      mockAppointmentScreenProps.selectedService.screenDescription
    );
    expect(appointmentInstructions.props.cancelWindowHours).toEqual(
      mockAppointmentScreenProps.cancelWindowHours
    );
    expect(appointmentInstructions.props.cancellationPolicy).toEqual(
      mockAppointmentScreenProps.serviceTypeInfo.cancellationPolicyMyRx
    );
  });

  it('renders body with AppointmentLocation', () => {
    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPageConnected.props.body;
    const appointmentLocation = getChildren(bodyContainer)[1];

    expect(appointmentLocation.type).toEqual(AppointmentLocation);
    expect(appointmentLocation.props.selectedLocation).toEqual(
      mockAppointmentScreenProps.selectedLocation
    );
  });

  it('renders body with TimeSlotPicker', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedDate: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPageConnected.props.body;
    const timeSlotPicker = getChildren(bodyContainer)[5];

    expect(timeSlotPicker.type).toEqual(TimeSlotPicker);
  });

  it('renders CreateAppointmentForm with expected props', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      memberAddress: memberAddressMock,
      selectedSlot: availableSlotMock,
      selectedOnce: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );

    const createAppointmentForm = getCreateAppointmentForm(testRenderer);

    expect(createAppointmentForm.type).toEqual(CreateAppointmentForm);
    expect(createAppointmentForm.props.showAboutYou).toEqual(true);
    expect(createAppointmentForm.props.guardianAddress).toEqual(
      memberAddressMock
    );
    expect(createAppointmentForm.props.onDependentInfoChange).toBeDefined();
    expect(createAppointmentForm.props.onMemberTypeSelected).toBeDefined();
  });

  it('renders body with error if error is there', () => {
    const mockScreenPropwithError = { ...mockAppointmentScreenProps };
    mockScreenPropwithError.error = 'test-error';
    const testRenderer = renderer.create(
      <AppointmentScreen {...mockScreenPropwithError} />
    );
    const errorComponent = getErrorCompoment(testRenderer);
    expect(errorComponent.type).toEqual(View);
  });

  it('renders body with no error if error is not there', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedSlot: availableSlotMock,
      selectedOnce: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );

    const error = getErrorCompoment(testRenderer);
    expect(error).toBeNull();
  });

  it('renders body with "slots unavailability error" if there are no available slots in the current month', () => {
    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPageConnected.props.body;
    const errorView = getChildren(bodyContainer)[3];

    expect(errorView.type).toEqual(View);
    expect(errorView.props.testID).toEqual('appointmentScreenError');
    expect(getChildren(errorView).length).toEqual(1);

    const textField = getChildren(errorView)[0];

    expect(textField.type).toEqual(BaseText);
    expect(textField.props.children).toEqual(
      appointmentScreenContent.noSlotsAvailabilityError
    );
  });

  it('renders body with "slots unavailability error for maxed out dates" if there are no available slots in the max month', () => {
    const mockAppointmentScreenPropsMaxMonth = {
      ...mockAppointmentScreenProps,
      availableSlots: [
        {
          start: '2020-12-21T15:30:00',
          slotName: '3:30 pm',
          day: '2020-12-21',
        },
        {
          start: '2020-12-26T15:30:00',
          slotName: '3:30 pm',
          day: '2020-12-26',
        },
      ],
      minDay: '2020-11-20',
      maxDay: '2020-12-20',
      currentMonth: '2020-12-01',
    };
    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenPropsMaxMonth} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPageConnected.props.body;
    const errorView = getChildren(bodyContainer)[3];

    expect(errorView.type).toEqual(View);
    expect(errorView.props.testID).toEqual('appointmentScreenError');
    expect(getChildren(errorView).length).toEqual(1);

    const textField = getChildren(errorView)[0];

    expect(textField.type).toEqual(BaseText);
    expect(textField.props.children).toEqual(
      appointmentScreenContent.noSlotsAvailabilityErrorForMaxDate
    );
  });

  it.each([
    [false, false, true],
    [false, true, false],
    [true, false, false],
    [true, true, false],
  ])(
    'renders body with unfinished questions (isConsentAccepted: %p, hasSlotExpired: %p)',
    (
      isConsentAcceptedMock: boolean,
      hasSlotExpiredMock: boolean,
      isMessageExpected: boolean
    ) => {
      const answeredRequiredQuestionMock: IQuestionAnswer = {
        ...questionAnswer1Mock,
        required: true,
        answer: 'yes',
      };
      const stateMock: Partial<IAppointmentScreenState> = {
        ...defaultScreenState,
        selectedOnce: true,
        questionAnswers: [answeredRequiredQuestionMock],
        selectedSlot: availableSlotMock,
        dependentInfo: {
          firstName: 'first name',
          lastName: 'last name',
          dateOfBirth: 'december-01-2010',
          address: {
            address1: '1010 Cooley LN',
            city: 'Vanderpool',
            county: 'Kerr',
            state: 'TX',
            zip: '78885',
          },
        },
        selectedMemberType: 1,
        memberAddress: memberAddressMock,
        consentAccepted: isConsentAcceptedMock,
        hasSlotExpired: hasSlotExpiredMock,
      };
      useReducerMock.mockReturnValue([stateMock, jest.fn()]);

      if (
        isConsentAcceptedMock === false &&
        hasSlotExpiredMock === false &&
        isMessageExpected === true
      ) {
        areRequiredQuestionsAnsweredMock.mockReturnValue(true);
      }

      if (
        isConsentAcceptedMock === false &&
        hasSlotExpiredMock === true &&
        isMessageExpected === false
      ) {
        areRequiredQuestionsAnsweredMock.mockReturnValue(true);
      }

      if (
        isConsentAcceptedMock === true &&
        hasSlotExpiredMock === false &&
        isMessageExpected === false
      ) {
        areRequiredQuestionsAnsweredMock.mockReturnValue(true);
      }

      if (
        isConsentAcceptedMock === true &&
        hasSlotExpiredMock === true &&
        isMessageExpected === false
      ) {
        areRequiredQuestionsAnsweredMock.mockReturnValue(true);
      }

      const testRenderer = renderer.create(
        <AppointmentScreen {...mockAppointmentScreenProps} />
      );

      const questionsContainer = getQuestionsComponent(testRenderer);
      const unfinishedQuestions = getChildren(questionsContainer)[4];

      if (isMessageExpected) {
        expect(unfinishedQuestions.type).toEqual(BaseText);
        expect(unfinishedQuestions.props.style).toEqual(
          appointmentScreenStyles.unfinishedQuestionsTextStyle
        );
        expect(unfinishedQuestions.props.children).toEqual(
          appointmentScreenContent.unfinishedQuestionsText
        );
      } else {
        expect(unfinishedQuestions).toBeNull();
      }
    }
  );

  it('renders body with expected question header for vaccine', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      questionAnswers: [questionAnswer1Mock],
      selectedSlot: availableSlotMock,
      selectedOnce: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen
        {...mockAppointmentScreenProps}
        selectedService={{
          ...mockAppointmentScreenProps.selectedService,
          serviceType: ServiceTypes.c19Vaccine,
        }}
      />
    );

    const questionsContainer = getQuestionsComponent(testRenderer);
    const questionsHeaderContainer = questionsContainer.props.children[0];

    const header = questionsHeaderContainer.props.children[0];
    expect(header.type).toEqual(Heading);
    expect(header.props.level).toEqual(2);
    expect(header.props.children).toEqual(
      appointmentScreenContent.questionsHeader
    );

    const subHeader = questionsHeaderContainer.props.children[1];
    expect(subHeader.type).toEqual(BaseText);
    expect(subHeader.props.children).toEqual(aboutQuestionsDescriptionMyRxMock);
  });

  it.each([[undefined], [false], [true]])(
    'renders body with expired slot message (hasSlotExpired: %p)',
    (hasSlotExpiredMock: boolean | undefined) => {
      const stateMock: Partial<IAppointmentScreenState> = {
        ...defaultScreenState,
        selectedOnce: true,
        hasSlotExpired: hasSlotExpiredMock,
      };
      useReducerMock.mockReturnValue([stateMock, jest.fn()]);

      const testRenderer = renderer.create(
        <AppointmentScreen {...mockAppointmentScreenProps} />
      );
      const form = getAppointmentForm(testRenderer);
      const slotExpiredMessage = getChildren(form)[2];

      if (!hasSlotExpiredMock) {
        expect(slotExpiredMessage).toBeNull();
      } else {
        expect(slotExpiredMessage.type).toEqual(BaseText);
        expect(slotExpiredMessage.props.style).toEqual(
          appointmentScreenStyles.unfinishedQuestionsTextStyle
        );
        expect(slotExpiredMessage.props.children).toEqual(
          appointmentScreenContent.slotExpiredText
        );
      }
    }
  );

  it('renders body with Book button', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      questionAnswers: [questionAnswer1Mock],
      selectedSlot: availableSlotMock,
      selectedOnce: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );

    const bookButton = getBaseButtonComponent(testRenderer);
    expect(bookButton.type).toEqual(BaseButton);
    expect(bookButton.props.children).toEqual(
      appointmentScreenContent.bookButtonCaption
    );
    expect(bookButton.props.testID).toEqual(bookBaseButtonText);
  });

  it('display Continue button for direct to consumers', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      questionAnswers: [questionAnswer1Mock],
      selectedSlot: availableSlotMock,
      selectedOnce: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const mockAppointmentScreenScreenPropsForCashUsers = {
      ...mockAppointmentScreenProps,
      rxGroupType: RxGroupTypesEnum.CASH,
      selectedService: {
        ...service,
        paymentRequired: true,
      },
    };
    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenScreenPropsForCashUsers} />
    );

    const continueButton = getBaseButtonComponent(testRenderer);
    expect(continueButton.type).toEqual(BaseButton);
    expect(continueButton.props.children).toEqual(
      appointmentScreenContent.continueButtonCaption
    );
    expect(continueButton.props.testID).toEqual(continueBaseButtonText);
  });

  it('display Book button for direct to consumers if payment is not required', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      questionAnswers: [questionAnswer1Mock],
      selectedSlot: availableSlotMock,
      selectedOnce: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const mockAppointmentScreenScreenPropsForCashUsers = {
      ...mockAppointmentScreenProps,
      rxGroupType: RxGroupTypesEnum.CASH,
      selectedService: {
        ...service,
        paymentRequired: false,
      },
    };
    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenScreenPropsForCashUsers} />
    );

    const bookButton = getBaseButtonComponent(testRenderer);
    expect(bookButton.type).toEqual(BaseButton);
    expect(bookButton.props.children).toEqual(
      appointmentScreenContent.bookButtonCaption
    );
    expect(bookButton.props.testID).toEqual(bookBaseButtonText);
  });

  it('Update answer in state correctly', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      questionAnswers: [questionAnswer1Mock],
      selectedOnce: true,
    };
    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([stateMock, dispatchMock]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    getAnswerAsStringMock.mockReturnValue('answer-2');

    const surveyItem = bodyRenderer.root.findAllByType(SurveyItem)[0];
    surveyItem.props.onAnswerChange('question-id-1', 'answer-2');

    expect(getAnswerAsStringMock).toHaveBeenCalledWith('answer-2');

    expect(setAnswerDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      'question-id-1',
      'answer-2'
    );
  });

  it('reset selectedSlot in state when error is received in props', async () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      questionAnswers: [questionAnswer1Mock],
      selectedOnce: true,
    };
    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([stateMock, dispatchMock]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} error='test-error' />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const timeSlotPicker = bodyRenderer.root.findByType(TimeSlotPicker);
    const onSlotSelected = timeSlotPicker.props.onSlotSelected;

    const surveyItem = bodyRenderer.root.findAllByType(SurveyItem)[0];
    surveyItem.props.onAnswerChange('1', 'answer1');
    surveyItem.props.onAnswerChange('2', 'answer2');

    await onSlotSelected(undefined);

    expect(slotSelectedDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      undefined
    );
  });

  it('Updates selectedDate in state when date selected', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedDate: false,
    };
    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([stateMock, dispatchMock]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const appointmentCalendar =
      bodyRenderer.root.findByType(AppointmentCalendar);
    appointmentCalendar.props.onDateSelected(new Date());

    expect(dateSelectedDispatchMock).toHaveBeenCalledWith(dispatchMock);
  });

  it('Updates selectedDate in state when month changed', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedDate: true,
    };
    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([stateMock, dispatchMock]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const calendar = bodyRenderer.root.findByType(AppointmentCalendar);
    const onMonthChange = calendar.props.onMonthChange;

    onMonthChange('2020-12-01');

    expect(onMonthChangeMock).toHaveBeenCalledWith(
      appointmentsStackNavigationMock,
      undefined
    );

    expect(monthSelectedDispatchMock).toHaveBeenCalledWith(dispatchMock);
  });

  it('disables Book button if any of the member address is not valid', () => {
    const answeredRequiredQuestionMock: IQuestionAnswer = {
      ...questionAnswer1Mock,
      required: true,
      answer: 'yes',
    };

    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedOnce: true,
      questionAnswers: [answeredRequiredQuestionMock],
      selectedSlot: availableSlotMock,
      selectedMemberType: 1,
      memberAddress: undefined,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} isMember={true} />
    );

    const bookButton = getBaseButtonComponent(testRenderer);
    expect(bookButton.type).toEqual(BaseButton);
    expect(bookButton.props.disabled).toEqual(true);
    expect(bookButton.props.viewStyle).toEqual(
      appointmentScreenStyles.bookButtonDisabledViewStyle
    );
    expect(bookButton.props.testID).toEqual(bookBaseButtonText);
  });

  it('disables Book button if any of the mandatory dependent Info fields are not filled', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedOnce: true,
      questionAnswers: [],
      selectedSlot: availableSlotMock,
      dependentInfo: {
        lastName: 'last name',
        dateOfBirth: 'december-01-2010',
        addressSameAsParent: true,
      },
      selectedMemberType: 1,
      memberAddress: memberAddressMock,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} isMember={true} />
    );

    const bookButton = getBaseButtonComponent(testRenderer);
    expect(bookButton.type).toEqual(BaseButton);
    expect(bookButton.props.disabled).toEqual(true);
    expect(bookButton.props.viewStyle).toEqual(
      appointmentScreenStyles.bookButtonDisabledViewStyle
    );
    expect(bookButton.props.testID).toEqual(bookBaseButtonText);
  });

  it('disables Book button if address of dependent is not filled and address is not same as parent', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedOnce: true,
      questionAnswers: [],
      selectedSlot: availableSlotMock,
      dependentInfo: {
        firstName: 'first Name',
        lastName: 'last name',
        dateOfBirth: 'december-01-2010',
        addressSameAsParent: false,
      },
      selectedMemberType: 1,
      memberAddress: memberAddressMock,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} isMember={true} />
    );

    const bookButton = getBaseButtonComponent(testRenderer);
    expect(bookButton.type).toEqual(BaseButton);
    expect(bookButton.props.disabled).toEqual(true);
    expect(bookButton.props.viewStyle).toEqual(
      appointmentScreenStyles.bookButtonDisabledViewStyle
    );
    expect(bookButton.props.testID).toEqual(bookBaseButtonText);
  });

  it.each([
    ['', true],
    ['error', false],
  ])(
    'enables Book button if all required details are filled including dependent Info fields (dependentError: %p)',
    (dependentErrorMock: string, isEnabledExpected: boolean) => {
      const answeredRequiredQuestionMock: IQuestionAnswer = {
        ...questionAnswer1Mock,
        required: true,
        answer: 'yes',
      };
      const stateMock: Partial<IAppointmentScreenState> = {
        ...defaultScreenState,
        selectedOnce: true,
        questionAnswers: [answeredRequiredQuestionMock],
        selectedSlot: availableSlotMock,
        dependentInfo: {
          firstName: 'first name',
          lastName: 'last name',
          dateOfBirth: 'december-01-2010',
          address: {
            address1: '1010 Cooley LN',
            city: 'Vanderpool',
            county: 'Kerr',
            state: 'TX',
            zip: '78885',
          },
        },
        selectedMemberType: 1,
        memberAddress: memberAddressMock,
        consentAccepted: true,
      };
      useReducerMock.mockReturnValue([stateMock, jest.fn()]);

      areRequiredQuestionsAnsweredMock.mockReturnValue(true);

      const testRenderer = renderer.create(
        <AppointmentScreen
          {...mockAppointmentScreenProps}
          dependentError={dependentErrorMock}
        />
      );

      const bookButton = getBaseButtonComponent(testRenderer);
      expect(bookButton.props.disabled).toEqual(!isEnabledExpected);
    }
  );

  it.each([
    ['', false],
    ['error', false],
  ])(
    'disables Book button if no time slot locked and all required details are filled including dependent Info fields (dependentError: %p)',
    (dependentErrorMock: string, isEnabledExpected: boolean) => {
      const answeredRequiredQuestionMock: IQuestionAnswer = {
        ...questionAnswer1Mock,
        required: true,
        answer: 'yes',
      };
      const stateMock: Partial<IAppointmentScreenState> = {
        ...defaultScreenState,
        selectedOnce: true,
        questionAnswers: [answeredRequiredQuestionMock],
        selectedSlot: availableSlotMock,
        dependentInfo: {
          firstName: 'first name',
          lastName: 'last name',
          dateOfBirth: 'december-01-2010',
          address: {
            address1: '1010 Cooley LN',
            city: 'Vanderpool',
            county: 'Kerr',
            state: 'TX',
            zip: '78885',
          },
        },
        selectedMemberType: 1,
        memberAddress: memberAddressMock,
        consentAccepted: true,
      };
      useReducerMock.mockReturnValue([stateMock, jest.fn()]);

      const mockScreenPropwithError = { ...mockAppointmentScreenProps };
      mockScreenPropwithError.error = 'test-error';
      const testRenderer = renderer.create(
        <AppointmentScreen
          {...mockScreenPropwithError}
          dependentError={dependentErrorMock}
        />
      );

      const bookButton = getBaseButtonComponent(testRenderer);
      expect(bookButton.props.disabled).toEqual(!isEnabledExpected);
    }
  );

  it.each([
    ['', '', true],
    ['1234567', '12345678', true],
    ['12345678', '1234567', true],
    ['12345678', '12345678', false],
  ])(
    'disables Book button if answers for required questions invalid (answer1: %p, answer2: %p)',
    (
      answerText1Mock: string,
      answerText2Mock: string,
      isDisabledExpected: boolean
    ) => {
      const serviceQuestionMock: IServiceQuestion = {
        id: 'service-question',
        isRequired: true,
        label: '',
        priority: 1,
        type: 'text',
        markdownLabel: '',
        validation: '^([0-9]){8}$',
      };
      const surveyQuestionMock: IServiceQuestion = {
        id: 'survey-question',
        isRequired: true,
        label: '',
        priority: 1,
        type: 'text',
        markdownLabel: '',
        validation: '^([0-9]){8}$',
      };

      const serviceMock: IServiceInfo = {
        ...service,
        questions: [serviceQuestionMock, surveyQuestionMock],
      };

      const answer1Mock: IQuestionAnswer = {
        questionId: 'service-question',
        questionText: '',
        required: true,
        answer: answerText1Mock,
      };
      const answer2Mock: IQuestionAnswer = {
        questionId: 'survey-question',
        questionText: '',
        required: true,
        answer: answerText2Mock,
      };

      const stateMock: Partial<IAppointmentScreenState> = {
        ...defaultScreenState,
        selectedOnce: true,
        questionAnswers: [answer1Mock, answer2Mock],
        selectedSlot: availableSlotMock,
        dependentInfo: {
          firstName: 'first name',
          lastName: 'last name',
          dateOfBirth: 'december-01-2010',
          address: {
            address1: '1010 Cooley LN',
            city: 'Vanderpool',
            county: 'Kerr',
            state: 'TX',
            zip: '78885',
          },
        },
        selectedMemberType: 1,
        memberAddress: memberAddressMock,
        consentAccepted: true,
      };
      useReducerMock.mockReturnValue([stateMock, jest.fn()]);

      if (isDisabledExpected === false) {
        areRequiredQuestionsAnsweredMock.mockReturnValue(true);
      }

      const testRenderer = renderer.create(
        <AppointmentScreen
          {...mockAppointmentScreenProps}
          selectedService={serviceMock}
        />
      );

      const bookButton = getBaseButtonComponent(testRenderer);
      expect(bookButton.props.disabled).toEqual(isDisabledExpected);
    }
  );

  it('enables Book button when no service questions and consent is checked ', () => {
    const answeredRequiredQuestionMock: IQuestionAnswer = {
      ...questionAnswer1Mock,
      required: true,
      answer: 'yes',
    };
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedSlot: availableSlotMock,
      memberAddress: memberAddressMock,
      questionAnswers: [answeredRequiredQuestionMock],
      selectedOnce: true,
      dependentInfo: {
        firstName: 'first name',
        lastName: 'last name',
        dateOfBirth: 'december-01-2010',
        address: {
          address1: '1010 Cooley LN',
          city: 'Vanderpool',
          county: 'Kerr',
          state: 'TX',
          zip: '78885',
        } as IMemberAddress,
        addressSameAsParent: false,
      },
      selectedMemberType: 1,
      consentAccepted: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const selectedServiceMock: IServiceInfo = {
      serviceName: 'COVID-19 AntiBody Test',
      serviceType: 'COVID-19 Antigen Testing',
      questions: [],
      screenTitle: 'Schedule Appointment',
      screenDescription:
        'Choose appointment date and time. Testing takes approximately 15 minutes.',
      minLeadDays: 'P6D',
      maxLeadDays: 'P30D',
    };

    const testRenderer = renderer.create(
      <AppointmentScreen
        {...mockAppointmentScreenProps}
        selectedService={selectedServiceMock}
      />
    );

    const bookButton = getBaseButtonComponent(testRenderer);
    expect(bookButton.type).toEqual(BaseButton);
    expect(bookButton.props.disabled).toBeFalsy();
    expect(bookButton.props.viewStyle).toEqual(
      appointmentScreenStyles.bookButtonEnabledViewStyle
    );
    expect(bookButton.props.testID).toEqual(bookBaseButtonText);
  });

  it('disables Book button when no slot lock and no service questions and consent is checked ', () => {
    const answeredRequiredQuestionMock: IQuestionAnswer = {
      ...questionAnswer1Mock,
      required: true,
      answer: 'yes',
    };
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedSlot: availableSlotMock,
      memberAddress: memberAddressMock,
      questionAnswers: [answeredRequiredQuestionMock],
      selectedOnce: true,
      dependentInfo: {
        firstName: 'first name',
        lastName: 'last name',
        dateOfBirth: 'december-01-2010',
        address: {
          address1: '1010 Cooley LN',
          city: 'Vanderpool',
          county: 'Kerr',
          state: 'TX',
          zip: '78885',
        } as IMemberAddress,
        addressSameAsParent: false,
      },
      selectedMemberType: 1,
      consentAccepted: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const selectedServiceMock: IServiceInfo = {
      serviceName: 'COVID-19 AntiBody Test',
      serviceType: 'COVID-19 Antigen Testing',
      questions: [],
      screenTitle: 'Schedule Appointment',
      screenDescription:
        'Choose appointment date and time. Testing takes approximately 15 minutes.',
      minLeadDays: 'P6D',
      maxLeadDays: 'P30D',
    };

    const mockScreenPropwithError = { ...mockAppointmentScreenProps };
    mockScreenPropwithError.error = 'test-error';

    const testRenderer = renderer.create(
      <AppointmentScreen
        {...mockScreenPropwithError}
        selectedService={selectedServiceMock}
      />
    );

    const bookButton = getBaseButtonComponent(testRenderer);
    expect(bookButton.type).toEqual(BaseButton);
    expect(bookButton.props.disabled).toBeTruthy();
    expect(bookButton.props.viewStyle).toEqual(
      appointmentScreenStyles.bookButtonDisabledViewStyle
    );
    expect(bookButton.props.testID).toEqual(bookBaseButtonText);
  });

  it('should send dependent details to API when dependent is selected and Book/continue button is clicked', () => {
    const dependentDateOfBirth = 'december-01-2010';
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedSlot: availableSlotMock,
      memberAddress: memberAddressMock,
      questionAnswers: [questionAnswer1Mock, questionAnswer2Mock],
      selectedOnce: true,
      dependentInfo: {
        firstName: 'first name',
        lastName: 'last name',
        dateOfBirth: dependentDateOfBirth,
        address: {
          address1: '1010 Cooley LN',
          city: 'Vanderpool',
          county: 'Kerr',
          state: 'TX',
          zip: '78885',
        },
        addressSameAsParent: false,
      },
      selectedMemberType: 1,
      consentAccepted: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    areRequiredQuestionsAnsweredMock.mockReturnValue(true);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bookOrContinueButton = bodyRenderer.root.findByType(BaseButton);
    bookOrContinueButton.props.onPress();

    const expectedDependentInfo: IDependentInformation = {
      ...stateMock.dependentInfo,
      dateOfBirth: dateFormatter.formatToMonthDDYYYY(dependentDateOfBirth),
    };

    expect(onBookPressMock).toHaveBeenCalledWith(
      appointmentsStackNavigationMock,
      stateMock.questionAnswers,
      [],
      stateMock.selectedSlot,
      stateMock.memberAddress,
      expectedDependentInfo
    );
  });

  it('not to send dependent details to API when selected memberType is "myself" and Book/continue button is clicked', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedSlot: availableSlotMock,
      memberAddress: memberAddressMock,
      questionAnswers: [questionAnswer1Mock, questionAnswer2Mock],
      selectedOnce: true,
      dependentInfo: {
        firstName: 'first name',
        lastName: 'last name',
        dateOfBirth: 'December-01-2010',
        address: {
          address1: '1010 Cooley LN',
          city: 'Vanderpool',
          county: 'Kerr',
          state: 'TX',
          zip: '78885',
        },
        addressSameAsParent: false,
      },
      selectedMemberType: 0,
      consentAccepted: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bookOrContinueButton = bodyRenderer.root.findByType(BaseButton);
    bookOrContinueButton.props.onPress();

    expect(onBookPressMock).toHaveBeenCalledWith(
      appointmentsStackNavigationMock,
      stateMock.questionAnswers,
      [],
      stateMock.selectedSlot,
      stateMock.memberAddress,
      undefined
    );
  });

  it('should not hide time slot picker once displayed on screen and when month is changed', async () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedOnce: true,
    };
    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([stateMock, dispatchMock]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const timeSlotPicker = bodyRenderer.root.findByType(TimeSlotPicker);
    const onSlotSelected = timeSlotPicker.props.onSlotSelected;

    const appointmentCalendar =
      bodyRenderer.root.findByType(AppointmentCalendar);
    appointmentCalendar.props.onDateSelected(new Date());

    await onSlotSelected(availableSlotMock);

    appointmentCalendar.props.onMonthChange(new Date());

    expect(onSlotChangeMock).toBeCalledWith(
      appointmentsStackNavigationMock,
      availableSlotMock,
      appointmentScreenContent.mainLoadingMessageForChangeSlot
    );

    expect(slotSelectedDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      availableSlotMock
    );
  });

  it('should call onSlotChange', async () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedOnce: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const timeSlotPicker = bodyRenderer.root.findByType(TimeSlotPicker);
    const onSlotSelected = timeSlotPicker.props.onSlotSelected;

    await onSlotSelected(availableSlotMock);

    expect(onSlotChangeMock).toHaveBeenCalledWith(
      appointmentsStackNavigationMock,
      availableSlotMock,
      appointmentScreenContent.mainLoadingMessageForChangeSlot
    );
  });

  it('renders aboutyou section if member address is invalid', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedOnce: true,
      memberAddress: undefined,
      selectedSlot: availableSlotMock,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} />
    );
    const createAppointmentForm = getCreateAppointmentForm(testRenderer);

    expect(createAppointmentForm.props.showAboutYou).toBeTruthy();
  });

  it('renders aboutyou section if user is a member and existing member address is invalid', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedOnce: true,
      memberAddress: memberAddressMock,
      selectedSlot: availableSlotMock,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen
        {...mockAppointmentScreenProps}
        isMember={true}
        memberAddress={{
          address1: '',
          city: '',
          state: '',
          zip: '',
          county: '',
        }}
      />
    );

    const createAppointmentForm = getCreateAppointmentForm(testRenderer);
    expect(createAppointmentForm.props.showAboutYou).toBeTruthy();
  });

  it('does not render aboutyou section if member address is valid', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedOnce: true,
      selectedSlot: availableSlotMock,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const address: IMemberAddress = {
      address1: 'address1',
      city: 'renton',
      county: 'King',
      state: 'WA',
      zip: '98055',
    };
    const testRenderer = renderer.create(
      <AppointmentScreen
        {...mockAppointmentScreenProps}
        memberAddress={address}
        isMember={true}
      />
    );

    const createAppointmentForm = getCreateAppointmentForm(testRenderer);
    expect(createAppointmentForm.props.showAboutYou).toBeFalsy();
  });

  it('enables Book button if consent IS checked', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      memberAddress: memberAddressMock,
      selectedSlot: availableSlotMock,
      selectedOnce: true,
      questionAnswers: [questionAnswer1Mock],
      dependentInfo: dependentInfoMock,
      selectedMemberType: 1,
      consentAccepted: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    areRequiredQuestionsAnsweredMock.mockReturnValue(true);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} isMember={true} />
    );

    const bookButton = getBaseButtonComponent(testRenderer);
    expect(bookButton.type).toEqual(BaseButton);
    expect(bookButton.props.disabled).toEqual(false);
    expect(bookButton.props.viewStyle).toEqual(
      appointmentScreenStyles.bookButtonEnabledViewStyle
    );
    expect(bookButton.props.testID).toEqual(bookBaseButtonText);
  });

  it('disables Book button if no slot lock and consent IS checked', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      memberAddress: memberAddressMock,
      selectedSlot: availableSlotMock,
      selectedOnce: true,
      questionAnswers: [questionAnswer1Mock],
      dependentInfo: dependentInfoMock,
      selectedMemberType: 1,
      consentAccepted: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const mockScreenPropwithError = { ...mockAppointmentScreenProps };
    mockScreenPropwithError.error = 'test-error';
    const testRenderer = renderer.create(
      <AppointmentScreen {...mockScreenPropwithError} isMember={true} />
    );

    const bookButton = getBaseButtonComponent(testRenderer);
    expect(bookButton.type).toEqual(BaseButton);
    expect(bookButton.props.disabled).toEqual(true);
    expect(bookButton.props.viewStyle).toEqual(
      appointmentScreenStyles.bookButtonDisabledViewStyle
    );
    expect(bookButton.props.testID).toEqual(bookBaseButtonText);
  });

  it('disables Book button if consent is not checked', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedSlot: availableSlotMock,
      selectedOnce: true,
      questionAnswers: [questionAnswer1Mock],
      dependentInfo: dependentInfoMock,
      selectedMemberType: 1,
      consentAccepted: false,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} isMember={true} />
    );

    const bookButton = getBaseButtonComponent(testRenderer);
    expect(bookButton.type).toEqual(BaseButton);
    expect(bookButton.props.disabled).toEqual(true);
    expect(bookButton.props.viewStyle).toEqual(
      appointmentScreenStyles.bookButtonDisabledViewStyle
    );
    expect(bookButton.props.testID).toEqual(bookBaseButtonText);
  });

  it('disables Book button if no slot lock and consent is checked', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedSlot: availableSlotMock,
      selectedOnce: true,
      questionAnswers: [questionAnswer1Mock],
      dependentInfo: dependentInfoMock,
      selectedMemberType: 1,
      consentAccepted: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const mockScreenPropwithError = { ...mockAppointmentScreenProps };
    mockScreenPropwithError.error = 'test-error';
    const testRenderer = renderer.create(
      <AppointmentScreen {...mockScreenPropwithError} isMember={true} />
    );

    const bookButton = getBaseButtonComponent(testRenderer);
    expect(bookButton.type).toEqual(BaseButton);
    expect(bookButton.props.disabled).toEqual(true);
    expect(bookButton.props.viewStyle).toEqual(
      appointmentScreenStyles.bookButtonDisabledViewStyle
    );
    expect(bookButton.props.testID).toEqual(bookBaseButtonText);
  });

  it('renders consent link', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedSlot: availableSlotMock,
      selectedOnce: true,
      questionAnswers: [questionAnswer1Mock],
      dependentInfo: dependentInfoMock,
      selectedMemberType: 1,
      consentAccepted: false,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} isMember={true} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPageConnected.props.body;
    const innerContainer = getChildren(bodyContainer)[7];
    const questionsContainer = innerContainer.props.children[1];
    const consentLink = questionsContainer.props.children[3];

    const checkboxLink = getChildren(consentLink)[0];
    expect(checkboxLink.type).toEqual(LinkCheckbox);
    expect(checkboxLink.props.onCheckboxPress).toEqual(expect.any(Function));
    expect(checkboxLink.props.onLinkPress).toEqual(expect.any(Function));
    expect(checkboxLink.props.markdown).toEqual(
      appointmentScreenContent.consentMarkdown
    );
    expect(checkboxLink.props.checkboxValue).toEqual(
      'consentToScheduleAppointment'
    );
    expect(checkboxLink.props.checkboxChecked).toEqual(false);
    expect(checkboxLink.props.testID).toBe('appointmentTermsAndConditions');

    const onViewConsent = checkboxLink.props.onLinkPress;
    const useLinker = onViewConsent();

    expect(consentNavigateAsyncActionMock).toHaveBeenCalledWith();
    expect(useLinker).toEqual(false);
  });

  it('renders consent checkbox state as consentAccepted', () => {
    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedSlot: availableSlotMock,
      selectedOnce: true,
      questionAnswers: [questionAnswer1Mock],
      dependentInfo: dependentInfoMock,
      selectedMemberType: 1,
      consentAccepted: true,
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen {...mockAppointmentScreenProps} isMember={true} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPageConnected.props.body;
    const innerContainer = getChildren(bodyContainer)[7];
    const questionsContainer = innerContainer.props.children[1];
    const consentLink = questionsContainer.props.children[3];

    const checkboxLink = getChildren(consentLink)[0];
    expect(checkboxLink.props.checkboxChecked).toEqual(true);
  });

  it('renders body with question header only if there are questions', () => {
    const serviceMockWithoutQuestions: IServiceInfo = {
      serviceName: 'COVID-19 AntiBody Test',
      serviceType: 'COVID-19 Antigen Testing',
      questions: [],
      screenTitle: 'Schedule Appointment',
      screenDescription:
        'Choose appointment date and time. Testing takes approximately 15 minutes.',
      minLeadDays: 'P6D',
      maxLeadDays: 'P30D',
    };

    const stateMock: Partial<IAppointmentScreenState> = {
      ...defaultScreenState,
      selectedSlot: availableSlotMock,
      selectedOnce: true,
      questionAnswers: [questionAnswer1Mock],
    };
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    const testRenderer = renderer.create(
      <AppointmentScreen
        {...mockAppointmentScreenProps}
        selectedService={serviceMockWithoutQuestions}
      />
    );

    const questionsContainer = getQuestionsComponent(testRenderer);
    const questionsHeader = questionsContainer.props.children[0];
    expect(questionsHeader).toBeNull();
  });
});

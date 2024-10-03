// Copyright 2020 Prescryptive Health, Inc.

import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { ScrollView, View } from 'react-native';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { TimeSlotPicker } from '../../../components/member/time-slot-picker/time-slot-picker';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { appointmentScreenContent } from './appointment.screen.content';
import { IAvailableSlot } from '../../../models/api-response/available-slots-response';
import { AppointmentInstructions } from '../../../components/member/appointment-instructions/appointment-instructions';
import { AppointmentLocation } from '../../../components/member/appointment-location/appointment-location';
import {
  IMarkedDate,
  AppointmentCalendar,
} from '../../../components/member/appointment-calendar/appointment-calendar';
import {
  IMemberAddress,
  IDependentInformation,
} from '../../../models/api-request-body/create-booking.request-body';
import { initializeAppointmentQuestions } from './appointment.screen.helper';
import { SurveyItem } from '../../../components/member/survey/survey-item/survey-item';
import DateFormatter from '../../../utils/formatters/date.formatter';
import { IServiceQuestion } from '../../../models/provider-location';
import moment from 'moment';
import { CreateAppointmentForm } from '../../../components/member/create-appointment-form/create-appointment-form';
import DateValidator from '../../../utils/validators/date.validator';
import AddressValidator from '../../../utils/validators/address.validator';
import { LinkCheckbox } from '../../../components/member/checkboxes/link/link.checkbox';
import {
  ILocation,
  IServiceInfo,
} from '../../../models/api-response/provider-location-details-response';
import { ISelectedSlot } from '../store/appointment/actions/change-slot.action';
import { IServiceTypeState } from '../store/service-type/service-type.reducer';
import {
  IDependentProfile,
  RxGroupTypes,
} from '../../../models/member-profile/member-profile-info';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { appointmentScreenStyles } from './appointment.screen.styles';
import { BaseText } from '../../../components/text/base-text/base-text';
import { Heading } from '../../../components/member/heading/heading';
import { appointmentScreenReducer } from './appointment.screen.reducer';
import { dateSelectedDispatch } from './dispatch/date-selected.dispatch';
import { IAppointmentScreenState } from './appointment.screen.state';
import { slotExpiredDispatch } from './dispatch/slot-expired.dispatch';
import { setMemberAddressDispatch } from './dispatch/set-member-address.dispatch';
import { slotSelectedDispatch } from './dispatch/slot-selected.dispatch';
import { setConsentDispatch } from './dispatch/set-consent.dispatch';
import { setAnswerDispatch } from './dispatch/set-answer.dispatch';
import { resetAnswersDispatch } from './dispatch/reset-answers.dispatch';
import { IQuestionAnswer } from '../../../models/question-answer';
import { setDependentInfoDispatch } from './dispatch/set-dependent-info.dispatch';
import { monthSelectedDispatch } from './dispatch/month-selected.dispatch';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  areRequiredQuestionsAnswered,
  getAnswerAsString,
  getCurrentAnswer,
} from '../../../utils/answer.helper';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { InsuranceInformation } from '../../../components/insurance-information/insurance-information';
import { Insurance } from '../../../components/insurance/insurance';
import { insuranceContent } from '../../../components/insurance/insurance.content';
import {
  AppointmentRouteProp,
  AppointmentsStackNavigationProp,
} from '../navigation/stack-navigators/appointments/appointments.stack-navigator';
import { DateData } from 'react-native-calendars';
import { consentNavigateAsyncAction } from '../store/navigation/actions/consent-navigate.async-action';
import { navigateHomeScreenNoApiRefreshDispatch } from '../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { LogoClickActionEnum } from '../../../components/app/application-header/application-header';

const isDependentInfoFilled = (
  dependentInfo?: IDependentInformation
): boolean => {
  if (!dependentInfo) {
    return false;
  }

  const {
    firstName,
    lastName,
    address,
    dateOfBirth,
    addressSameAsParent,
    identifier,
  } = dependentInfo;

  return !!(
    (identifier !== 'newDependent' &&
      identifier !== 'default' &&
      identifier !== undefined) ||
    (firstName &&
      firstName.trim().length > 0 &&
      lastName &&
      lastName.trim().length > 0 &&
      (addressSameAsParent
        ? true
        : address
        ? AddressValidator.isAddressValid(address)
        : false) &&
      (dateOfBirth ? DateValidator.isDateOfBirthValid(dateOfBirth) : false))
  );
};

export interface IAppointmentScreenRouteProps {
  showBackButton: boolean;
  showBackToHome?: boolean;
}

export interface IAppointmentScreenActionProps {
  onBookPressAsync?: (
    navigation: AppointmentsStackNavigationProp,
    questions: IQuestionAnswer[],
    insuranceQuestions: IQuestionAnswer[],
    selectedSlot: IAvailableSlot,
    address?: IMemberAddress,
    dependentInfo?: IDependentInformation
  ) => void;
  onSlotChangeAsync: (
    navigation: AppointmentsStackNavigationProp,
    slotStartDate: IAvailableSlot,
    mainLoadingMessage: string
  ) => void;
  onDateSelectedAsync: (date: string) => void;
  onMonthChangeAsync: (
    navigation: AppointmentsStackNavigationProp,
    date: string
  ) => void;
  resetNewDependentError: () => void;
}

export interface IAppointmentScreenProps {
  error?: string;
  dependentError?: string;
  markedDates: IMarkedDate;
  slotForDate: IAvailableSlot[];
  maxDay: string;
  minDay: string;
  currentMonth?: string;
  selectedLocation?: ILocation;
  selectedService: IServiceInfo;
  rxGroupType: RxGroupTypes;
  isMember: boolean;
  availableSlots: IAvailableSlot[];
  memberAddress: IMemberAddress;
  cancelWindowHours: string;
  childMembers: IDependentProfile[];
  adultMembers: IDependentProfile[];
  currentSlot?: ISelectedSlot;
  serviceTypeInfo: IServiceTypeState;
}
type IAppointmentScreenCombinedProps = IAppointmentScreenProps &
  IAppointmentScreenActionProps;

export const AppointmentScreen = ({
  selectedLocation,
  currentMonth,
  maxDay,
  minDay,
  markedDates,
  availableSlots,
  error,
  onSlotChangeAsync,
  currentSlot,
  onDateSelectedAsync,
  slotForDate,
  memberAddress,
  isMember,
  dependentError,
  childMembers,
  adultMembers,
  selectedService,
  serviceTypeInfo,
  onBookPressAsync,
  rxGroupType,
  cancelWindowHours,
  resetNewDependentError,
  onMonthChangeAsync,
}: IAppointmentScreenCombinedProps): ReactElement => {
  const navigation = useNavigation<AppointmentsStackNavigationProp>();
  const initialState: IAppointmentScreenState = {
    questionAnswers: initializeAppointmentQuestions(selectedService),
    memberAddress: memberAddress ? memberAddress : undefined,
    selectedDate: false,
    selectedOnce: false,
    dependentInfo: undefined,
    selectedMemberType: -1,
    consentAccepted: false,
    hasSlotExpired: false,
  };

  const [state, dispatch] = useReducer(appointmentScreenReducer, initialState);
  const [paymentMethod, setPaymentMethod] = useState({ id: '', value: '' });
  const [insuranceQuestions, setInsuranceQuestions] = useState(
    [] as IQuestionAnswer[]
  );

  const { getState: reduxGetState } = useReduxContext();

  const featureFlags = reduxGetState().features;

  const useInsurance = featureFlags.useinsurance;

  const { params } = useRoute<AppointmentRouteProp>();
  const { showBackButton, showBackToHome } = params;
  const scrollViewRef = useRef<ScrollView>(null);
  const errorMessageRef = useRef<View>(null);
  const dependentErrorMessageRef = useRef<View>(null);
  useEffect(() => {
    if (!error || !scrollViewRef?.current || !errorMessageRef?.current) {
      return;
    }

    const errorMessageRefCurrent = errorMessageRef.current;
    const scrollViewRefCurrent = scrollViewRef.current;
    errorMessageRefCurrent.measure((_, y) => {
      scrollViewRefCurrent.scrollTo(y);
    });
  }, [error]);

  useEffect(() => {
    if (
      !dependentError ||
      !dependentErrorMessageRef?.current ||
      !scrollViewRef?.current
    ) {
      return;
    }
    const dependentErrorMessageRefCurrent = dependentErrorMessageRef.current;
    const scrollViewRefCurrent = scrollViewRef.current;
    dependentErrorMessageRefCurrent.measure((_, y) => {
      scrollViewRefCurrent.scrollTo(y);
    });
  }, [dependentError]);
  let autoUnlockTimeout: NodeJS.Timeout | undefined;

  useEffect(() => {
    const clearTimeoutIfDefined = () => {
      if (autoUnlockTimeout) {
        clearTimeout(autoUnlockTimeout);
        autoUnlockTimeout = undefined;
      }
    };

    clearTimeoutIfDefined();

    if (currentSlot) {
      const currentDateTime = moment.utc();
      const slotExpirationDateTime = moment(
        currentSlot.slotExpirationDate ?? currentDateTime
      );

      if (slotExpirationDateTime > currentDateTime) {
        const slotExpiresInMS =
          slotExpirationDateTime.diff(currentDateTime, 'seconds') * 1000;

        autoUnlockTimeout = global.setTimeout(() => {
          slotExpiredDispatch(dispatch);

          const selectedDate = moment(currentSlot?.day).toDate();
          onDateSelectedAsync(selectedDate.toDateString());
        }, slotExpiresInMS);
      }
    }

    return clearTimeoutIfDefined;
  }, [currentSlot]);

  const insuranceInformationChanged = (
    id: string,
    value: string | string[] | Date | undefined
  ) => {
    setPaymentMethod({ id, value: value as string });
  };

  const insuranceChanged = (questions: IQuestionAnswer[]) => {
    setInsuranceQuestions(questions);
  };

  const renderInsuranceInfo = (
    <InsuranceInformation
      insuranceInformationChanged={insuranceInformationChanged}
      answer={paymentMethod.value}
    />
  );

  const renderInsuranceQuestions =
    !!paymentMethod.value && paymentMethod.value !== 'creditDebitCard' ? (
      <Insurance insuranceChanged={insuranceChanged} />
    ) : null;

  const renderInsurance = useInsurance ? (
    <View testID='insuranceForm'>
      {renderInsuranceInfo}
      {renderInsuranceQuestions}
    </View>
  ) : null;

  const renderAppointmentLocation = selectedLocation ? (
    <AppointmentLocation selectedLocation={selectedLocation} />
  ) : null;

  const onCalendarDateSelected = async (date: DateData) => {
    dateSelectedDispatch(dispatch);

    await onDateSelectedAsync(date.dateString);
  };

  const onCalendarMonthChange = async (date: DateData) => {
    monthSelectedDispatch(dispatch);

    await onMonthChangeAsync(navigation, date.dateString);
  };

  const renderAppointmentUnavailableError = (): ReactNode => {
    const getAvailableSlotsStatus = () => {
      let status = {
        availability: true,
        error: '',
      };

      if (moment(currentMonth).month() === moment(maxDay).month()) {
        const filteredSlots = availableSlots.filter(
          (slot) => moment(slot.day).date() <= moment(maxDay).date()
        );
        status = {
          availability: filteredSlots.length > 0,
          error: appointmentScreenContent.noSlotsAvailabilityErrorForMaxDate,
        };
      } else if (availableSlots.length === 0) {
        status = {
          availability: false,
          error: appointmentScreenContent.noSlotsAvailabilityError,
        };
      }
      return status;
    };

    const { availability, error: errorMessage } = getAvailableSlotsStatus();

    return !availability ? (
      <View testID='appointmentScreenError'>
        <BaseText style={appointmentScreenStyles.errorTextStyle}>
          {errorMessage}
        </BaseText>
      </View>
    ) : null;
  };

  const renderSlotExpirationInfo = state.selectedSlot ? (
    <BaseText style={appointmentScreenStyles.expirationWarningTextStyle}>
      {appointmentScreenContent.slotExpirationWarningText}
    </BaseText>
  ) : null;

  const onSlotSelected = async (slot?: IAvailableSlot) => {
    if (slot) {
      await onSlotChangeAsync(
        navigation,
        slot,
        appointmentScreenContent.mainLoadingMessageForChangeSlot
      );
    }

    slotSelectedDispatch(dispatch, slot);
  };

  const renderTimeSlotPicker =
    state.selectedDate || state.selectedOnce ? (
      <TimeSlotPicker
        enabled={slotForDate.length > 0}
        slots={slotForDate}
        onSlotSelected={onSlotSelected}
      />
    ) : null;

  const renderError = error ? (
    <View ref={errorMessageRef} testID='appointmentScreenErrorText'>
      <BaseText style={appointmentScreenStyles.errorTextStyle}>
        {error}
      </BaseText>
    </View>
  ) : null;

  const resetQuestionAnswers = (
    selectedMemberType = state.selectedMemberType
  ) => {
    const initialQuestionAnswers =
      initializeAppointmentQuestions(selectedService);

    resetAnswersDispatch(dispatch, selectedMemberType, initialQuestionAnswers);
  };

  const onDependentInfoChange = (dependentInfo?: IDependentInformation) => {
    resetNewDependentError();

    if (dependentInfo?.identifier !== state.dependentInfo?.identifier) {
      resetQuestionAnswers();
    }

    if (dependentInfo?.identifier === 'newDependent') {
      dependentInfo.identifier = undefined;
    }
    setDependentInfoDispatch(dispatch, dependentInfo);
  };

  const onAddressChange = (address?: IMemberAddress) => {
    setMemberAddressDispatch(dispatch, address);
  };

  const onMemberTypeSelected = (selectedMemberType: number) => {
    const currentMemberType = state.selectedMemberType;

    if (currentMemberType !== selectedMemberType) {
      resetQuestionAnswers(selectedMemberType);
    }
  };

  const renderCreateAppointmentForm = (): ReactNode => {
    const address = {
      address1: memberAddress.address1,
      address2: memberAddress.address2,
      county: memberAddress.county,
      city: memberAddress.city,
      state: memberAddress.state,
      zip: memberAddress.zip,
    } as IMemberAddress;
    const showAboutYou =
      isMember && AddressValidator.isAddressValid(address) ? false : true;
    return (
      <CreateAppointmentForm
        showAboutYou={showAboutYou}
        guardianAddress={state.memberAddress}
        onDependentInfoChange={onDependentInfoChange}
        onMemberAddressChange={onAddressChange}
        onMemberTypeSelected={onMemberTypeSelected}
        error={dependentError}
        dependentInfo={state.dependentInfo}
        guardianIsMember={isMember}
        availableDependents={[...childMembers, ...adultMembers]}
        serviceType={selectedService.serviceType}
        serviceTypeInfo={serviceTypeInfo}
      />
    );
  };

  const renderQuestionsHeader = selectedService.questions.length ? (
    <View
      style={appointmentScreenStyles.questionsHeaderContainer}
      testID='appointmentScreenQuestions'
    >
      <Heading
        level={2}
        textStyle={appointmentScreenStyles.aboutDependentHeaderTextStyle}
      >
        {appointmentScreenContent.questionsHeader}
      </Heading>
      <BaseText style={appointmentScreenStyles.questionsSubHeaderTextStyle}>
        {serviceTypeInfo.aboutQuestionsDescriptionMyRx}
      </BaseText>
    </View>
  ) : null;

  const onAnswerChange = (id: string, answer?: string | string[] | Date) => {
    const answerAsString = getAnswerAsString(answer);
    setAnswerDispatch(dispatch, id, answerAsString);
  };

  const renderQuestion = (question: IServiceQuestion): ReactNode => {
    const {
      id,
      markdownLabel,
      selectOptions,
      placeholder,
      type,
      isRequired,
      description,
      validation,
      errorMessage,
    } = question;

    const answer = getCurrentAnswer(id, type, state.questionAnswers);

    return (
      <SurveyItem
        key={id}
        id={id}
        type={type}
        question={markdownLabel}
        selectOptions={new Map<string, string>(selectOptions ?? [])}
        placeholder={placeholder}
        onAnswerChange={onAnswerChange}
        viewStyle={appointmentScreenStyles.questionViewStyle}
        isRequired={isRequired}
        description={description}
        validation={validation}
        errorMessage={errorMessage}
        answer={answer}
      />
    );
  };

  const renderPharmacyQuestions = selectedService.questions.map(renderQuestion);

  const renderConsentLink = (): ReactNode => {
    const toggleConsentCheckbox = () => {
      setConsentDispatch(dispatch, !state.consentAccepted);
    };

    const onViewConsentLinkPress = (_: string): boolean => {
      void consentNavigateAsyncAction();
      return false;
    };

    return (
      <View
        style={appointmentScreenStyles.consentViewStyle}
        testID='appointmentConsentLink'
      >
        <LinkCheckbox
          testID='appointmentTermsAndConditions'
          onCheckboxPress={toggleConsentCheckbox}
          onLinkPress={onViewConsentLinkPress}
          markdown={appointmentScreenContent.consentMarkdown}
          checkboxValue='consentToScheduleAppointment'
          checkboxChecked={state.consentAccepted}
        />
      </View>
    );
  };

  const isInsuranceInfoFormValid = (): boolean => {
    if (!!paymentMethod.value && paymentMethod.value === 'creditDebitCard') {
      return true;
    }
    const questions = [
      ...insuranceContent.questions,
      ...insuranceContent.policyHolderQuestions,
    ];
    return areRequiredQuestionsAnswered(insuranceQuestions, questions);
  };

  const bookOrContinueButtonDisabled =
    !state.selectedSlot ||
    state.hasSlotExpired ||
    (selectedService.questions.length
      ? !areRequiredQuestionsAnswered(
          state.questionAnswers,
          selectedService.questions
        )
      : false) ||
    (state.memberAddress
      ? !AddressValidator.isAddressValid(state.memberAddress)
      : true) ||
    (state.selectedMemberType === 1
      ? isDependentInfoFilled(state.dependentInfo) && !dependentError
        ? false
        : true
      : false) ||
    (useInsurance ? !isInsuranceInfoFormValid() : false) ||
    !state.consentAccepted ||
    error !== undefined;

  const renderUnfinishedQuestionsText =
    bookOrContinueButtonDisabled && !state.hasSlotExpired ? (
      <BaseText style={appointmentScreenStyles.unfinishedQuestionsTextStyle}>
        {appointmentScreenContent.unfinishedQuestionsText}
      </BaseText>
    ) : null;

  const areSomeQuestionsAnswered = (): boolean => {
    return state.questionAnswers.some((question) => question.answer.trim());
  };

  const showQuestions =
    state.selectedMemberType === 0 ||
    areSomeQuestionsAnswered() ||
    (state.selectedMemberType === 1 &&
      isDependentInfoFilled(state.dependentInfo));

  const renderQuestions =
    state.selectedOnce && showQuestions ? (
      <>
        {renderQuestionsHeader}
        {renderPharmacyQuestions}
        {renderInsurance}
        {renderConsentLink()}
        {renderUnfinishedQuestionsText}
      </>
    ) : null;

  const bookOrContinueButtonViewStyle = bookOrContinueButtonDisabled
    ? appointmentScreenStyles.bookButtonDisabledViewStyle
    : appointmentScreenStyles.bookButtonEnabledViewStyle;

  const getDependentInfoForBooking = (
    dependentInfo?: IDependentInformation
  ): IDependentInformation | undefined => {
    if (!dependentInfo) {
      return undefined;
    }

    return {
      ...dependentInfo,
      dateOfBirth: dependentInfo.dateOfBirth
        ? DateFormatter.formatToMonthDDYYYY(dependentInfo.dateOfBirth)
        : undefined,
    };
  };

  const onBookOrContinueButtonPress = async () => {
    if (onBookPressAsync && state.selectedSlot) {
      await onBookPressAsync(
        navigation,
        state.questionAnswers,
        insuranceQuestions,
        state.selectedSlot,
        state.memberAddress,
        state.selectedMemberType === 1
          ? getDependentInfoForBooking(state.dependentInfo)
          : undefined
      );
    }
  };

  const renderSlotExpiredMessage = state.hasSlotExpired ? (
    <BaseText style={appointmentScreenStyles.unfinishedQuestionsTextStyle}>
      {appointmentScreenContent.slotExpiredText}
    </BaseText>
  ) : null;

  const renderBookOrContinueButton = (): ReactNode => {
    const disableButton = bookOrContinueButtonDisabled;
    const caption =
      rxGroupType !== 'COVID19' && selectedService.paymentRequired
        ? appointmentScreenContent.continueButtonCaption
        : appointmentScreenContent.bookButtonCaption;
    const buttonStyle = bookOrContinueButtonViewStyle;

    return (
      <BaseButton
        disabled={disableButton}
        viewStyle={buttonStyle}
        onPress={onBookOrContinueButtonPress}
        testID={'appointmentScreen-' + caption + '-Button'}
      >
        {caption}
      </BaseButton>
    );
  };

  const renderForm = state.selectedOnce ? (
    <View testID='createAppointmentForm' ref={dependentErrorMessageRef}>
      {renderCreateAppointmentForm()}
      {renderQuestions}
      {renderSlotExpiredMessage}
      {renderBookOrContinueButton()}
    </View>
  ) : null;

  const renderAppointmentBody = (
    <BodyContentContainer
      testID='appointmentScreenBody'
      title={selectedService.screenTitle}
    >
      <AppointmentInstructions
        screenDescription={selectedService.screenDescription}
        cancelWindowHours={cancelWindowHours}
        cancellationPolicy={serviceTypeInfo.cancellationPolicyMyRx}
      />
      {renderAppointmentLocation}

      <AppointmentCalendar
        markedDates={markedDates}
        minDay={minDay}
        maxDay={maxDay}
        currentMonth={currentMonth}
        onDateSelected={onCalendarDateSelected}
        onMonthChange={onCalendarMonthChange}
      />
      {renderAppointmentUnavailableError()}
      {renderSlotExpirationInfo}
      {renderTimeSlotPicker}
      {renderError}
      {renderForm}
    </BodyContentContainer>
  );

  const onNavigateBack = () => {
    if (showBackToHome) {
      navigateHomeScreenNoApiRefreshDispatch(reduxGetState, navigation);
    } else if (showBackButton) {
      navigation.goBack();
    }
  };

  const onBackButtonClick =
    showBackButton || showBackToHome ? onNavigateBack : undefined;

  return (
    <BasicPageConnected
      body={renderAppointmentBody}
      navigateBack={onBackButtonClick}
      showProfileAvatar={true}
      ref={scrollViewRef}
      logoClickAction={LogoClickActionEnum.CONFIRM}
      translateContent={true}
    />
  );
};

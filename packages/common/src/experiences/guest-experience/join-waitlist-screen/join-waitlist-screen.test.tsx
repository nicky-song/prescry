// Copyright 2021 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import renderer from 'react-test-renderer';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { OtherPersonInfo } from '../../../components/member/join-waitlist-form/create-other-person-info-component';
import { BasePicker } from '../../../components/member/pickers/base/base.picker';
import { RadioButtonToggle } from '../../../components/member/radio-button-toggle/radio-button-toggle';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { BaseText } from '../../../components/text/base-text/base-text';
import { MarkdownText } from '../../../components/text/markdown-text/markdown-text';
import { ICreateWaitlistRequestBody } from '../../../models/api-request-body/create-waitlist.request-body';
import {
  guestExperienceCustomEventLogger,
  CustomAppInsightEvents,
} from '../guest-experience-logger.middleware';
import { appointmentsStackNavigationMock } from '../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { IServiceTypeState } from '../store/service-type/service-type.reducer';
import {
  IJoinWaitlistScreenProps,
  JoinWaitlistScreen,
} from './join-waitlist-screen';
import { JoinWaitlistScreenContent } from './join-waitlist-screen.content';
import { joinWaitlistScreenStyle } from './join-waitlist-screen.style';

jest.mock('../../../components/member/pickers/base/base.picker', () => ({
  BasePicker: () => <div />,
}));

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));
jest.mock('../guest-experience-logger.middleware');

jest.mock('@react-navigation/native');
const navigationMock = useNavigation as jest.Mock;

const routeMock = useRoute as jest.Mock;
const routePropsMock = { params: { zipCode: '55555' } };

const serviceTypeMock: IServiceTypeState = {
  type: 'c19VaccineDose1',
  serviceNameMyRx: 'c19-vaccine-dose1',
  minimumAge: 18,
};

const mockJoinWaitlistScreenProps: IJoinWaitlistScreenProps = {
  serviceType: serviceTypeMock,
  availableWaitlistMembers: [],
  onJoinPress: jest.fn(),
  resetErrorMessage: jest.fn(),
  updateLocationPreferences: jest.fn(),
  error: undefined,
};

describe('JoinWaitlistScreen ', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    routeMock.mockReturnValue(routePropsMock);
    useStateMock.mockReturnValue(['55555', jest.fn()]);
    useEffectMock.mockReset();
    guestExperienceCustomEventLoggerMock.mockReset();
    navigationMock.mockReturnValue(appointmentsStackNavigationMock);
  });
  it('should render a BasicPageConnected with props', () => {
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    expect(pageProps.hideNavigationMenuButton).toBeFalsy();
    expect(pageProps.showProfileAvatar).toBeTruthy();
    expect(pageProps.navigateBack).toBe(appointmentsStackNavigationMock.goBack);
    expect(pageProps.translateContent).toBeTruthy();
  });

  it('renders body as expected', () => {
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;
    const instructions = bodyProp.props.children[0];
    const selectedService = bodyProp.props.children[1];
    const selectedServiceHeader = selectedService.props.children[0];
    const selectedServiceType = selectedService.props.children[1];

    expect(bodyProp.type).toEqual(View);

    expect(instructions.type).toEqual(MarkdownText);
    expect(instructions.props.children).toEqual(
      JoinWaitlistScreenContent.instructions
    );

    expect(selectedService.type).toEqual(View);
    expect(selectedService.props.style).toEqual(
      joinWaitlistScreenStyle.selectedServiceViewStyle
    );

    expect(selectedServiceHeader.type).toEqual(MarkdownText);
    expect(selectedServiceHeader.props.children).toEqual(
      JoinWaitlistScreenContent.interestedIn
    );

    expect(selectedServiceType.type).toEqual(MarkdownText);
    expect(selectedServiceType.props.textStyle).toEqual(
      joinWaitlistScreenStyle.selectedServiceTextStyle
    );
    expect(selectedServiceType.props.children).toEqual(
      mockJoinWaitlistScreenProps.serviceType.serviceNameMyRx
    );
  });

  it('renders location form fields in body as expected', () => {
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const locationForm = bodyProp.props.children[2];

    const zipCodeField = locationForm.props.children[0];
    const zipCodeCaption = zipCodeField.props.children[0];
    const zipCodeInput = zipCodeField.props.children[1];

    const distanceField = locationForm.props.children[1];
    const distanceCaption = distanceField.props.children[0];
    const distanceBasePicker = distanceField.props.children[1];

    expect(locationForm.type).toEqual(View);
    expect(locationForm.props.style).toEqual(
      joinWaitlistScreenStyle.locationFormViewStyle
    );

    expect(zipCodeField.type).toEqual(View);
    expect(zipCodeField.props.style).toEqual(
      joinWaitlistScreenStyle.leftItemViewStyle
    );

    expect(zipCodeCaption.type).toEqual(MarkdownText);
    expect(zipCodeCaption.props.textStyle).toEqual(
      joinWaitlistScreenStyle.formItemLabelTextStyle
    );
    expect(zipCodeCaption.props.markdownTextStyle).toEqual(
      joinWaitlistScreenStyle.mandatoryIconTextStyle
    );

    expect(zipCodeInput.type).toEqual(TextInput);

    expect(distanceField.type).toEqual(View);
    expect(distanceField.props.style).toEqual(
      joinWaitlistScreenStyle.rightItemViewStyle
    );

    expect(distanceCaption.type).toEqual(MarkdownText);
    expect(distanceCaption.props.textStyle).toEqual(
      joinWaitlistScreenStyle.formItemLabelTextStyle
    );
    expect(distanceCaption.props.markdownTextStyle).toEqual(
      joinWaitlistScreenStyle.mandatoryIconTextStyle
    );

    expect(distanceBasePicker.type).toEqual(BasePicker);
  });

  it('renders RadioButtonToggle in body as expected', () => {
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const radioButtonToggle = bodyProp.props.children[3];

    expect(radioButtonToggle.type).toEqual(RadioButtonToggle);
  });

  it('renders OtherPersonInfo in body as expected', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([1, jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const otherPersonDetails = bodyProp.props.children[4].props.children;

    expect(otherPersonDetails.type).toEqual(OtherPersonInfo);
  });

  it('renders BaseButton in body as expected', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([0, jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const joinButton = bodyProp.props.children[6].props.children;

    expect(joinButton.type).toEqual(BaseButton);
    expect(joinButton.props.disabled).toEqual(false);
  });
  it('renders Join button with disabled view style when zipCode not entered', () => {
    useStateMock.mockReturnValue(['', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const joinButton = bodyProp.props.children[6].props.children;

    expect(joinButton.type).toEqual(BaseButton);
    expect(joinButton.props.disabled).toEqual(true);
  });
  it('renders Join button with disabled view style when dependent not selected', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([1, jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['default', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const joinButton = bodyProp.props.children[6].props.children;

    expect(joinButton.type).toEqual(BaseButton);
    expect(joinButton.props.disabled).toEqual(true);
  });
  it('renders Join button with disabled view style when firstName not input for new dependent', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([1, jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['newDependent', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const joinButton = bodyProp.props.children[6].props.children;

    expect(joinButton.type).toEqual(BaseButton);
    expect(joinButton.props.disabled).toEqual(true);
  });
  it('renders Join button with disabled view style when lastName not input for new dependent', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([1, jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['FirstName', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['newDependent', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const joinButton = bodyProp.props.children[6].props.children;

    expect(joinButton.type).toEqual(BaseButton);
    expect(joinButton.props.disabled).toEqual(true);
  });
  it('renders Join button with disabled view style when firstName just whitespace for new dependent', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([1, jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce([' ', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['newDependent', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const joinButton = bodyProp.props.children[6].props.children;

    expect(joinButton.type).toEqual(BaseButton);
    expect(joinButton.props.disabled).toEqual(true);
  });
  it('renders Join button with disabled view style when lastName just whitespace for new dependent', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([1, jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['FirstName', jest.fn()]);
    useStateMock.mockReturnValueOnce([' ', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['newDependent', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const joinButton = bodyProp.props.children[6].props.children;

    expect(joinButton.type).toEqual(BaseButton);
    expect(joinButton.props.disabled).toEqual(true);
  });
  it('renders Join button with disabled view style when dateOfBirth not input for new dependent', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([1, jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['FirstName', jest.fn()]);
    useStateMock.mockReturnValueOnce(['LastName', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['newDependent', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const joinButton = bodyProp.props.children[6].props.children;

    expect(joinButton.type).toEqual(BaseButton);
    expect(joinButton.props.disabled).toEqual(true);
  });
  it('renders Join button with disabled view style when phoneNumber not input for new dependent', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([1, jest.fn()]);
    useStateMock.mockReturnValueOnce(['2000-01-01', jest.fn()]);
    useStateMock.mockReturnValueOnce(['FirstName', jest.fn()]);
    useStateMock.mockReturnValueOnce(['LastName', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['newDependent', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const joinButton = bodyProp.props.children[6].props.children;

    expect(joinButton.type).toEqual(BaseButton);
    expect(joinButton.props.disabled).toEqual(true);
  });
  it('renders Join button with enabled view style when all information input correctly for new dependent', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([1, jest.fn()]);
    useStateMock.mockReturnValueOnce(['01-01-2000', jest.fn()]);
    useStateMock.mockReturnValueOnce(['FirstName', jest.fn()]);
    useStateMock.mockReturnValueOnce(['LastName', jest.fn()]);
    useStateMock.mockReturnValueOnce(['5555555555', jest.fn()]);
    useStateMock.mockReturnValueOnce(['newDependent', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const joinButton = bodyProp.props.children[6].props.children;

    expect(joinButton.type).toEqual(BaseButton);
    expect(joinButton.props.disabled).toEqual(false);
  });
  it('renders Join button with enabled view style when all information input correctly for existing dependent', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([1, jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['test-id', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const joinButton = bodyProp.props.children[6].props.children;

    expect(joinButton.type).toEqual(BaseButton);
    expect(joinButton.props.disabled).toEqual(false);
  });
  it('calls onJoinPress function with expected parameters for myself', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([0, jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const joinButton = bodyProp.props.children[6].props.children;
    joinButton.props.onPress();
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.PRESSED_JOIN_WAITLIST_BUTTON,
      {}
    );
    expect(mockJoinWaitlistScreenProps.onJoinPress).toHaveBeenCalledWith(
      appointmentsStackNavigationMock,
      {
        serviceType: 'c19VaccineDose1',
        zipCode: '55555',
        maxMilesAway: 10,
        myself: true,
      } as ICreateWaitlistRequestBody
    );
  });
  it('calls onJoinPress function with expected parameters for existing dependents', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([1, jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['test-id', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const joinButton = bodyProp.props.children[6].props.children;
    joinButton.props.onPress();
    expect(mockJoinWaitlistScreenProps.onJoinPress).toHaveBeenCalledWith(
      appointmentsStackNavigationMock,
      {
        serviceType: 'c19VaccineDose1',
        zipCode: '55555',
        maxMilesAway: 10,
        myself: false,
        dependentIdentifier: 'test-id',
      } as ICreateWaitlistRequestBody
    );
  });
  it('calls onJoinPress function with expected parameters for new dependents', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([1, jest.fn()]);
    useStateMock.mockReturnValueOnce(['01-01-2000', jest.fn()]);
    useStateMock.mockReturnValueOnce(['FirstName  ', jest.fn()]);
    useStateMock.mockReturnValueOnce(['LastName  ', jest.fn()]);
    useStateMock.mockReturnValueOnce(['5555555555', jest.fn()]);
    useStateMock.mockReturnValueOnce(['newDependent', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen {...mockJoinWaitlistScreenProps} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const joinButton = bodyProp.props.children[6].props.children;
    joinButton.props.onPress();
    expect(mockJoinWaitlistScreenProps.onJoinPress).toHaveBeenCalledWith(
      appointmentsStackNavigationMock,
      {
        serviceType: 'c19VaccineDose1',
        zipCode: '55555',
        maxMilesAway: 10,
        myself: false,
        dateOfBirth: '01-01-2000',
        firstName: 'FirstName',
        lastName: 'LastName',
        phoneNumber: '+15555555555',
      } as ICreateWaitlistRequestBody
    );
  });
  it('changes fields if different from existing state values', () => {
    const setZipMock = jest.fn();
    const setDistanceMock = jest.fn();
    const setPatientTypeMock = jest.fn();
    const setFirstNameMock = jest.fn();
    const setLastNameMock = jest.fn();
    const setDateOfBirthMock = jest.fn();
    const setPhoneNumberMock = jest.fn();
    const setIdentifierMock = jest.fn();
    useStateMock.mockReturnValueOnce(['55555', setZipMock]);
    useStateMock.mockReturnValueOnce([10, setDistanceMock]);
    useStateMock.mockReturnValueOnce([1, setPatientTypeMock]);
    useStateMock.mockReturnValueOnce(['2000-01-01', setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce(['First', setFirstNameMock]);
    useStateMock.mockReturnValueOnce(['Last', setLastNameMock]);
    useStateMock.mockReturnValueOnce(['+11112223344', setPhoneNumberMock]);
    useStateMock.mockReturnValueOnce(['test-id', setIdentifierMock]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen
        {...{ ...mockJoinWaitlistScreenProps, error: 'Test Error' }}
      />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const locationForm = bodyProp.props.children[2];
    const zipCodeField = locationForm.props.children[0];
    const zipCodeInput = zipCodeField.props.children[1];
    const distanceField = locationForm.props.children[1];
    const distanceBasePicker = distanceField.props.children[1];
    const radioButtonToggle = bodyProp.props.children[3];
    const otherPersonDetails = bodyProp.props.children[4].props.children;

    zipCodeInput.props.onChangeText('55554');
    distanceBasePicker.props.onValueChange(25, 0);
    radioButtonToggle.props.onOptionSelected(1);
    otherPersonDetails.props.onOtherPersonSelected('test-id-2');
    otherPersonDetails.props.onPhoneNumberChange({
      target: { value: '1112223344' },
    } as BaseSyntheticEvent);
    otherPersonDetails.props.onFirstNameChange('NotFirst');
    otherPersonDetails.props.onLastNameChange('NotLast');
    otherPersonDetails.props.onDateOfBirthChange('1999-12-31');

    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.SELECTED_WAITLIST_DISTANCE_VALUE,
      {
        distance: '25',
      }
    );
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.SELECTED_WAITLIST_PERSON,
      {
        personSelected: JoinWaitlistScreenContent.toggleOptionOtherPerson,
      }
    );

    expect(setZipMock).toHaveBeenCalled();
    expect(setDistanceMock).toHaveBeenCalled();
    expect(setPatientTypeMock).toHaveBeenCalled();
    expect(setFirstNameMock).toHaveBeenCalled();
    expect(setLastNameMock).toHaveBeenCalled();
    expect(setDateOfBirthMock).toHaveBeenCalled();
    expect(setPhoneNumberMock).toHaveBeenCalled();
    expect(setIdentifierMock).toHaveBeenCalled();
  });
  it('does not change fields if same as existing state values', () => {
    const setZipMock = jest.fn();
    const setDistanceMock = jest.fn();
    const setPatientTypeMock = jest.fn();
    const setFirstNameMock = jest.fn();
    const setLastNameMock = jest.fn();
    const setDateOfBirthMock = jest.fn();
    const setPhoneNumberMock = jest.fn();
    const setIdentifierMock = jest.fn();
    useStateMock.mockReturnValueOnce(['55555', setZipMock]);
    useStateMock.mockReturnValueOnce([10, setDistanceMock]);
    useStateMock.mockReturnValueOnce([1, setPatientTypeMock]);
    useStateMock.mockReturnValueOnce(['2000-01-01', setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce(['First', setFirstNameMock]);
    useStateMock.mockReturnValueOnce(['Last', setLastNameMock]);
    useStateMock.mockReturnValueOnce(['1112223344', setPhoneNumberMock]);
    useStateMock.mockReturnValueOnce(['test-id', setIdentifierMock]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen
        {...{ ...mockJoinWaitlistScreenProps, error: 'Test Error' }}
      />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    const locationForm = bodyProp.props.children[2];
    const zipCodeField = locationForm.props.children[0];
    const zipCodeInput = zipCodeField.props.children[1];
    const distanceField = locationForm.props.children[1];
    const distanceBasePicker = distanceField.props.children[1];
    const radioButtonToggle = bodyProp.props.children[3];
    const otherPersonDetails = bodyProp.props.children[4].props.children;

    zipCodeInput.props.onChangeText('55555');
    distanceBasePicker.props.onValueChange(10, 0);
    radioButtonToggle.props.onOptionSelected(1);
    otherPersonDetails.props.onDateOfBirthChange('2000-01-01');
    otherPersonDetails.props.onFirstNameChange('First');
    otherPersonDetails.props.onLastNameChange('Last');
    otherPersonDetails.props.onPhoneNumberChange({
      target: { value: '1112223344' },
    } as BaseSyntheticEvent);
    otherPersonDetails.props.onOtherPersonSelected('test-id');

    expect(setZipMock).not.toHaveBeenCalled();
    expect(setDistanceMock).not.toHaveBeenCalled();
    expect(setPatientTypeMock).toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setPhoneNumberMock).not.toHaveBeenCalled();
    expect(setIdentifierMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['ABCDE', undefined, false],
    ['1BCDE', undefined, false],
    ['12345', undefined, true],
    ['12345', '12345', false],
  ])(
    'Updates zip in state when valid zip changes (zip: %p, previousZip: %p)',
    (
      zipMock: string,
      previousZipMock: string | undefined,
      isUpdateExpected: boolean
    ) => {
      const setZipMock = jest.fn();
      useStateMock.mockReturnValueOnce([previousZipMock, setZipMock]);
      const testRenderer = renderer.create(
        <JoinWaitlistScreen
          {...mockJoinWaitlistScreenProps}
          error='Test Error'
        />
      );
      const basicPageConnected =
        testRenderer.root.findByType(BasicPageConnected);
      const bodyRenderer = renderer.create(basicPageConnected.props.body);
      const zipCodeInput = bodyRenderer.root.findByType(TextInput);

      zipCodeInput.props.onChangeText(zipMock);

      if (isUpdateExpected) {
        expect(setZipMock).toHaveBeenCalledWith(zipMock);
      } else {
        expect(setZipMock).not.toHaveBeenCalled();
      }
    }
  );

  it('displays error from props if error exists and showError is true', () => {
    useStateMock.mockReturnValueOnce(['55555', jest.fn()]);
    useStateMock.mockReturnValueOnce([10, jest.fn()]);
    useStateMock.mockReturnValueOnce([1, jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['test-id', jest.fn()]);
    const testRenderer = renderer.create(
      <JoinWaitlistScreen
        {...{ ...mockJoinWaitlistScreenProps, error: 'Test Error' }}
      />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;
    const errorText = bodyProp.props.children[5].props.children;

    expect(errorText.type).toEqual(BaseText);
    expect(errorText.props.children).toEqual('Test Error');
  });
});

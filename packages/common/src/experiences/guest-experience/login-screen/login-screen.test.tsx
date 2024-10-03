// Copyright 2018 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { LoginScreen } from './login-screen';
import { isEmailValid } from '../../../utils/email.helper';
import dateFormatter from '../../../utils/formatters/date.formatter';
import DateValidator from '../../../utils/validators/date.validator';
import { loginScreenStyles } from './login-screen.styles';
import { Heading } from '../../../components/member/heading/heading';
import { MarkdownText } from '../../../components/text/markdown-text/markdown-text';
import { ITestContainer } from '../../../testing/test.container';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { differenceInYear, UTCDate } from '../../../utils/date-time-helper';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useMembershipContext } from '../context-providers/membership/use-membership-context.hook';
import { IMembershipContext } from '../context-providers/membership/membership.context';
import {
  defaultMembershipState,
  IMembershipState,
} from '../state/membership/membership.state';
import { LoginBody } from '../../../components/member/login-body/login-body';
import { IConfigContext } from '../context-providers/config/config.context';
import { useConfigContext } from '../context-providers/config/use-config-context.hook';
import { GuestExperienceConfig } from '../guest-experience-config';
import {
  ILimitedAccount,
  IPrimaryProfile,
  IProfile,
} from '../../../models/member-profile/member-profile-info';
import { MemberNameFormatter } from '../../../utils/formatters/member-name-formatter';
import { ErrorConstants } from '../../../theming/constants';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../context-providers/redux/redux.context';
import { memberAddOrLoginDataLoadingAsyncAction } from '../store/member-login/async-actions/member-add-or-login-data-loading.async.action';
import { useRoute } from '@react-navigation/native';
import { callPhoneNumber } from '../../../utils/link.helper';
import { ICommunicationContent } from '../../../models/cms-content/communication.content';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { ISignInContent } from '../../../models/cms-content/sign-in.ui-content';
import { ISignUpContent } from '../../../models/cms-content/sign-up.ui-content';

jest.mock(
  '../store/member-login/async-actions/member-add-or-login-data-loading.async.action'
);
const memberAddOrLoginDataLoadingAsyncActionMock =
  memberAddOrLoginDataLoadingAsyncAction as jest.Mock;

jest.mock('../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('../../../utils/formatters/date.formatter');
const firefoxCompatibleDateFormatMock =
  dateFormatter.firefoxCompatibleDateFormat as jest.Mock;
const formatToMonthDDYYYYMock = dateFormatter.formatToMonthDDYYYY as jest.Mock;

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../../../components/text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../../utils/validators/date.validator');
const isDateOfBirthValidMock = DateValidator.isDateOfBirthValid as jest.Mock;

jest.mock('../../../components/member/login-body/login-body');

jest.mock('../../../utils/email.helper');
const isEmailValidMock = isEmailValid as jest.Mock;

jest.mock('../../../utils/date-time-helper');

const UTCDateMock = UTCDate as jest.Mock;
const differenceInYearMock = differenceInYear as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../context-providers/config/use-config-context.hook');
const useConfigContextMock = useConfigContext as jest.Mock;

jest.mock('../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('@react-navigation/native');
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../utils/link.helper');
const callPhoneNumberMock = callPhoneNumber as jest.Mock;

jest.mock('../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const useStateTimesCalled = 10;
const useEffectTimesCalled = 3;

const dateOfBirthMock1 = undefined;
const firstNameMock1 = undefined;
const lastNameMock1 = undefined;
const emailAddressMock1 = undefined;
const emailAddressErrorMock1 = false;
const primaryMemberRxIdMock1 = undefined;
const allCurrentFieldsValidMock1 = false;
const currentLabelMock1 = undefined;
const loginBodyRefreshKeyMock1 = 0;

const dateOfBirthMock2 = '08-19-1963';
const firstNameMock2 = 'John';
const lastNameMock2 = 'Stamos';
const emailAddressMock2 = 'john.stamos@prescryptive.com';
const emailAddressErrorMock2 = false;
const primaryMemberRxIdMock2 = 'FULLPRESCRIPTION';
const allCurrentFieldsValidMock2 = true;
const currentLabelMock2 = undefined;
const loginBodyRefreshKeyMock2 = 0;

const dateOfBirthMock3 = '12-17-2021';
const firstNameMock3 = 'David';
const lastNameMock3 = 'Schwimmer';
const emailAddressMock3 = 'david.schwimmer';
const emailAddressErrorMock3 = true;
const primaryMemberRxIdMock3 = 'FRIENDLY PHARMACIST';
const allCurrentFieldsValidMock3 = false;
const currentLabelMock3 = 'Email address';
const loginBodyRefreshKeyMock3 = 1;

const errorMessageMock = ErrorConstants.errorInvalidMemberDetails(
  'support@prescryptive.com'
);

const setDateOfBirthMock = jest.fn();
const setFirstNameMock = jest.fn();
const setLastNameMock = jest.fn();
const setEmailAddressMock = jest.fn();
const setEmailAddressErrorMock = jest.fn();
const setPrimaryMemberRxIdMock = jest.fn();
const setAllCurrentFieldsValidMock = jest.fn();
const setCurrentLabelMock = jest.fn();
const setLoginBodyRefreshKeyMock = jest.fn();
const setErrorMessageMock = jest.fn();

const primaryProfileMock: IPrimaryProfile = {
  identifier: 'identifier',
  firstName: firstNameMock2,
  lastName: lastNameMock2,
  dateOfBirth: dateOfBirthMock2,
  phoneNumber: 'phone-number',
  rxGroupType: 'CASH',
  rxSubGroup: 'CASH01',
  primaryMemberRxId: primaryMemberRxIdMock2,
};
const profileMock: IProfile = {
  primary: primaryProfileMock,
  rxGroupType: 'CASH',
};

const uiContentMock = {
  firstNamePlaceholder: 'first-name-placeholder-mock',
  lastNamePlaceholder: 'last-name-placeholder-mock',
  emailPlaceholder: 'email-placeholder-mock',
  loginScreenErrorMessage: 'login-screen-error-message-mock',
  claimAlertHeader: 'claim-alert-header-mock',
  addMembershipHeader: 'add-membership-header-mock',
  createAccountHeader: 'create-account-header-mock',
  pbmMemberInstructions: 'pbm-member-instructions-mock',
  createAccountInstructions: 'create-account-instructions-mock',
  addMembership: 'add-membership-mock',
  createAccount: 'create-account-mock',
} as ISignInContent;

const communicationUIContentMock: Partial<ICommunicationContent> = {
  supportPBMPhone: 'support-pbm-phone-mock',
} as ICommunicationContent;

const signUpUIContentMock: Partial<ISignUpContent> = {
  memberIdHelpText: 'sign-up-member-id-help-text-mock',
  memberIdPlaceholder: 'member-id-placeholder-mock',
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    differenceInYearMock.mockReturnValue(30);
    isDateOfBirthValidMock.mockReturnValue(true);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const configContextMock: IConfigContext = {
      configState: GuestExperienceConfig,
    };
    useConfigContextMock.mockReturnValue(configContextMock);

    const membershipStateMock: IMembershipState = {
      account: { phoneNumber: '', favoritedPharmacies: [] },
      profileList: [profileMock],
      favoritingStatus: 'none',
    };
    const membershipContextMock: Partial<IMembershipContext> = {
      membershipState: membershipStateMock,
    };
    useMembershipContextMock.mockReturnValue(membershipContextMock);

    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: 'token' } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    useRouteMock.mockReturnValue({
      params: { claimAlertId: undefined },
    });

    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });
  });

  it('should have body with props', async () => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const childMemberAgeLimitMock = 10;
    const configContextMock: IConfigContext = {
      configState: {
        ...GuestExperienceConfig,
        childMemberAgeLimit: childMemberAgeLimitMock,
      },
    };
    useConfigContextMock.mockReturnValue(configContextMock);

    const accountMock: ILimitedAccount = {
      phoneNumber: '+11234567890',
      firstName: 'first-name',
      lastName: 'last-name',
      favoritedPharmacies: [],
    };
    const membershipContextMock: Partial<IMembershipContext> = {
      membershipState: {
        account: accountMock,
        profileList: [profileMock],
        favoritingStatus: 'none',
      },
    };
    useMembershipContextMock.mockReturnValueOnce(membershipContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock1,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([errorMessageMock, setErrorMessageMock]);
    useContentMock.mockReturnValue({
      content: communicationUIContentMock,
      isContentLoading: false,
    });

    const testRenderer = renderer.create(<LoginScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    expect(basicPage.props.translateContent).toEqual(true);
    expect(basicPage.props.navigateBack).toEqual(expect.any(Function));
    basicPage.props.navigateBack();
    expect(rootStackNavigationMock.goBack).toBeCalledTimes(1);
    expect(basicPage.props.memberProfileName).toEqual(
      MemberNameFormatter.formatName(
        accountMock.firstName,
        accountMock.lastName
      )
    );

    const body = basicPage.props.body;

    const loginBody = body.props.children[2];
    expect(loginBody.type).toEqual(LoginBody);

    const loginBodyProps = loginBody.props;

    expect(loginBodyProps.childMemberAgeLimit).toEqual(childMemberAgeLimitMock);
    expect(loginBodyProps.loggedInUserInfo).toEqual(accountMock);
    const linkPressResult = await loginBodyProps.onContactUsLinkPress();

    expect(callPhoneNumberMock).toHaveBeenCalledWith(
      communicationUIContentMock.supportPBMPhone
    );
    expect(linkPressResult).toBe(false);

    const memberLoginFields = loginBodyProps.memberLoginFields;

    expect(memberLoginFields.length).toEqual(3);
    expect(memberLoginFields[0].onChangeText).toBeDefined();
    expect(memberLoginFields[1].onChangeText).toBeDefined();
    expect(memberLoginFields[2].onChangeText).toBeDefined();
    expect(loginBodyProps.onDateOfBirthChangeHandler).toBeDefined();
    expect(loginBodyProps.enableLogin).toBeFalsy();
    const loginButtons = body.props.children[3];
    expect(loginButtons).toBeDefined();
    const loginButtonProps = loginButtons.props;

    expect(loginButtonProps.onPress).toBeDefined();

    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).toHaveBeenNthCalledWith(1, false);
    expect(setPrimaryMemberRxIdMock).toHaveBeenNthCalledWith(1, undefined);
    expect(setAllCurrentFieldsValidMock).toHaveBeenNthCalledWith(1, false);
    expect(setCurrentLabelMock).toHaveBeenNthCalledWith(1, undefined);
    expect(setLoginBodyRefreshKeyMock).toHaveBeenNthCalledWith(1, 1);

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('login flow - should have BasicPageConnected with Props', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock1,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([errorMessageMock, setErrorMessageMock]);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const basicPageProps = basicPage.props;

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);

    expect(basicPage).toBeDefined();
    expect(basicPageProps.headerViewStyle).toEqual(
      loginScreenStyles.basicPageHeaderViewStyle
    );
    expect(basicPageProps.bodyViewStyle).toEqual(
      loginScreenStyles.basicPageBodyViewStyle
    );
    expect(basicPageProps.navigateBack).toBeUndefined();

    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setCurrentLabelMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('add membership flow - should have BasicPageConnected with Props', () => {
    useStateMock.mockReturnValueOnce([dateOfBirthMock2, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock2, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock2, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock1,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([errorMessageMock, setErrorMessageMock]);

    const testRenderer = renderer.create(<LoginScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const basicPageProps = basicPage.props;

    expect(basicPage).toBeDefined();
    expect(basicPageProps.hideApplicationHeader).toBeFalsy();
    expect(basicPageProps.header).toBeUndefined();
    expect(basicPageProps.hideNavigationMenuButton).toBeFalsy();
    expect(basicPageProps.navigateBack).toBeDefined();
    expect(basicPageProps.showProfileAvatar).toBeTruthy();
    expect(basicPageProps.memberProfileName).toBeDefined();
    expect(basicPageProps.headerViewStyle).toEqual(
      loginScreenStyles.basicPageHeaderViewStyle
    );
    expect(basicPageProps.bodyViewStyle).toEqual(
      loginScreenStyles.basicPageBodyViewStyle
    );

    const body = basicPage.props.body;

    expect(body.props.children[2].props.memberLoginFields[0].defaultValue).toBe(
      firstNameMock2
    );
    expect(body.props.children[2].props.memberLoginFields[1].defaultValue).toBe(
      lastNameMock2
    );

    const backButton = body.props.children[3];
    expect(backButton).toBeDefined();
    const backButtonProps = backButton.props;

    expect(backButtonProps.onPress).toBeDefined();

    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setCurrentLabelMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('renders body container', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock1,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

    const testRenderer = renderer.create(<LoginScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(View);
    expect(bodyContainer.props.style).toEqual(loginScreenStyles.bodyViewStyle);
    expect(bodyContainer.props.children.length).toEqual(4);

    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setCurrentLabelMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it.each([
    [
      true,
      false,
      'joinEmployerScreenHeader',
      'loginScreen-AuthJoinEmployerPlan-Button',
    ],
    [false, false, 'loginScreenHeader', 'loginScreen-CreateAccount-Button'],
    [false, true, 'claimAlertScreenHeader', 'loginScreen-CreateAccount-Button'],
  ])(
    'renders testID for heading container (isAddMembershipFlow: %p, isClaimAlertOrPrescriptionFlow: %p)',
    (
      isAddMembershipFlowMock: boolean,
      isClaimAlertOrPrescriptionFlowMock: boolean,
      expectedTestId: string,
      expectedBaseButtonTestId: string
    ) => {
      useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
      useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
      useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
      useStateMock.mockReturnValueOnce([
        emailAddressMock1,
        setEmailAddressMock,
      ]);
      useStateMock.mockReturnValueOnce([
        emailAddressErrorMock1,
        setEmailAddressErrorMock,
      ]);
      useStateMock.mockReturnValueOnce([
        primaryMemberRxIdMock1,
        setPrimaryMemberRxIdMock,
      ]);
      useStateMock.mockReturnValueOnce([
        allCurrentFieldsValidMock1,
        setAllCurrentFieldsValidMock,
      ]);
      useStateMock.mockReturnValueOnce([
        currentLabelMock1,
        setCurrentLabelMock,
      ]);
      useStateMock.mockReturnValueOnce([
        loginBodyRefreshKeyMock1,
        setLoginBodyRefreshKeyMock,
      ]);
      useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

      const reduxContextMock: IReduxContext = {
        getState: jest
          .fn()
          .mockReturnValue({ settings: { token: isAddMembershipFlowMock } }),
        dispatch: jest.fn(),
      };
      useReduxContextMock.mockReturnValueOnce(reduxContextMock);
      useRouteMock.mockReturnValueOnce({
        params: isClaimAlertOrPrescriptionFlowMock
          ? { claimAlertId: 'identifier', prescriptionId: undefined }
          : {},
      });

      const testRenderer = renderer.create(<LoginScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyContainer = basicPage.props.body;
      const headingContainer = bodyContainer.props.children[0];
      const button = bodyContainer.props.children[3];

      expect(headingContainer.type).toEqual(View);
      expect(headingContainer.props.testID).toEqual(expectedTestId);
      expect(button.props.testID).toEqual(expectedBaseButtonTestId);
    }
  );

  it.each([
    [true, false, uiContentMock.addMembershipHeader],
    [false, true, uiContentMock.claimAlertHeader],
    [false, false, uiContentMock.createAccountHeader],
  ])(
    'renders title (isAddMembershipFlow: %p, isClaimAlertOrPrescriptionFlow: %p)',
    (
      isAddMembershipFlowMock: boolean,
      isClaimAlertOrPrescriptionFlowMock: boolean,
      expectedTitle: string
    ) => {
      useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
      useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
      useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
      useStateMock.mockReturnValueOnce([
        emailAddressMock1,
        setEmailAddressMock,
      ]);
      useStateMock.mockReturnValueOnce([
        emailAddressErrorMock1,
        setEmailAddressErrorMock,
      ]);
      useStateMock.mockReturnValueOnce([
        primaryMemberRxIdMock1,
        setPrimaryMemberRxIdMock,
      ]);
      useStateMock.mockReturnValueOnce([
        allCurrentFieldsValidMock1,
        setAllCurrentFieldsValidMock,
      ]);
      useStateMock.mockReturnValueOnce([
        currentLabelMock1,
        setCurrentLabelMock,
      ]);
      useStateMock.mockReturnValueOnce([
        loginBodyRefreshKeyMock1,
        setLoginBodyRefreshKeyMock,
      ]);
      useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

      const reduxContextMock: IReduxContext = {
        getState: jest
          .fn()
          .mockReturnValue({ settings: { token: isAddMembershipFlowMock } }),
        dispatch: jest.fn(),
      };
      useReduxContextMock.mockReturnValueOnce(reduxContextMock);
      useRouteMock.mockReturnValueOnce({
        params: isClaimAlertOrPrescriptionFlowMock
          ? { claimAlertId: 'identifier', prescriptionId: undefined }
          : {},
      });
      const testRenderer = renderer.create(<LoginScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyContainer = basicPage.props.body;
      const headingContainer = bodyContainer.props.children[0];
      const title = headingContainer.props.children[0];

      expect(title.type).toEqual(Heading);
      expect(title.props.textStyle).toEqual(loginScreenStyles.headingTextStyle);
      expect(title.props.children).toEqual(expectedTitle);
      expect(title.props.isSkeleton).toEqual(false);
    }
  );

  it.each([
    [true, false, uiContentMock.pbmMemberInstructions],
    [false, false, uiContentMock.createAccountInstructions],
    [false, true, uiContentMock.pbmMemberInstructions],
  ])(
    'renders instructions (isAddMembershipFlow: %p,  isClaimAlertOrPrescriptionFlow: %p)',
    (
      isAddMembershipFlowMock: boolean,
      isClaimAlertOrPrescriptionFlowMock: boolean,
      expectedInstructions: string
    ) => {
      useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
      useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
      useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
      useStateMock.mockReturnValueOnce([
        emailAddressMock1,
        setEmailAddressMock,
      ]);
      useStateMock.mockReturnValueOnce([
        emailAddressErrorMock1,
        setEmailAddressErrorMock,
      ]);
      useStateMock.mockReturnValueOnce([
        primaryMemberRxIdMock1,
        setPrimaryMemberRxIdMock,
      ]);
      useStateMock.mockReturnValueOnce([
        allCurrentFieldsValidMock1,
        setAllCurrentFieldsValidMock,
      ]);
      useStateMock.mockReturnValueOnce([
        currentLabelMock1,
        setCurrentLabelMock,
      ]);
      useStateMock.mockReturnValueOnce([
        loginBodyRefreshKeyMock1,
        setLoginBodyRefreshKeyMock,
      ]);
      useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

      const reduxContextMock: IReduxContext = {
        getState: jest
          .fn()
          .mockReturnValue({ settings: { token: isAddMembershipFlowMock } }),
        dispatch: jest.fn(),
      };
      useReduxContextMock.mockReturnValueOnce(reduxContextMock);
      useRouteMock.mockReturnValueOnce({
        params: isClaimAlertOrPrescriptionFlowMock
          ? { prescriptionId: 'identifier', claimAlertId: undefined }
          : {},
      });
      const testRenderer = renderer.create(<LoginScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyContainer = basicPage.props.body;
      const headingContainer = bodyContainer.props.children[0];
      const instructions = headingContainer.props.children[1];

      expect(instructions.type).toEqual(MarkdownText);
      expect(instructions.props.children).toEqual(expectedInstructions);
      expect(instructions.props.isSkeleton).toEqual(false);
    }
  );

  it('should default state', () => {
    const firstNameMock = 'first-name';
    const lastNameMock = 'last-name';
    const dateOfBirthMock = '2000-01-01';
    const recoveryEmailMock = 'recovery@somewhere.com';
    const primaryMemberRxIdMock = 'primary-rx-id';

    const membershipStateMock: IMembershipState = {
      ...defaultMembershipState,
      account: {
        firstName: firstNameMock,
        lastName: lastNameMock,
        dateOfBirth: dateOfBirthMock,
        recoveryEmail: recoveryEmailMock,
        phoneNumber: '',
        favoritedPharmacies: [],
      },
      profileList: [profileMock],
    };
    const membershipContextMock: Partial<IMembershipContext> = {
      membershipState: membershipStateMock,
    };
    useMembershipContextMock.mockReturnValueOnce(membershipContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock, setLastNameMock]);
    useStateMock.mockReturnValueOnce([recoveryEmailMock, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([false, setEmailAddressErrorMock]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([false, setAllCurrentFieldsValidMock]);
    useStateMock.mockReturnValueOnce([
      uiContentMock.emailLabel,
      setCurrentLabelMock,
    ]);
    useStateMock.mockReturnValueOnce([0, setLoginBodyRefreshKeyMock]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    renderer.create(<LoginScreen />);

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);

    expect(useStateMock).toHaveBeenNthCalledWith(1, dateOfBirthMock);
    expect(useStateMock).toHaveBeenNthCalledWith(2, firstNameMock);
    expect(useStateMock).toHaveBeenNthCalledWith(3, lastNameMock);
    expect(useStateMock).toHaveBeenNthCalledWith(4, recoveryEmailMock);
    expect(useStateMock).toHaveBeenNthCalledWith(5, false); // emailAddressError
    expect(useStateMock).toHaveBeenNthCalledWith(6); // primaryMemberRxId
    expect(useStateMock).toHaveBeenNthCalledWith(7, false); // allCurrentFieldsValid
    expect(useStateMock).toHaveBeenNthCalledWith(8); // currentLabel
    expect(useStateMock).toHaveBeenNthCalledWith(9, 1); // loginBodyRefreshKey

    expect(useEffectMock).toHaveBeenCalledTimes(3);

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
      dateOfBirthMock,
      firstNameMock,
      lastNameMock,
      recoveryEmailMock,
      primaryMemberRxIdMock,
    ]);
    expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [
      recoveryEmailMock,
    ]);
    expect(useEffectMock).toHaveBeenNthCalledWith(3, expect.any(Function), [
      false,
    ]);

    const handleIsEmailValid = useEffectMock.mock.calls[1][0];
    handleIsEmailValid();

    expect(setEmailAddressErrorMock).toHaveBeenCalledWith(true);

    const handleEmailLoginBodyRefresh = useEffectMock.mock.calls[2][0];
    handleEmailLoginBodyRefresh();

    expect(setLoginBodyRefreshKeyMock).toHaveBeenCalled();
  });

  it('onFirstNameChangeHandler should change firstName in state', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);
    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock1,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([errorMessageMock, setErrorMessageMock]);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    const memberLoginFields = loginBody.props.memberLoginFields;
    const firstNameField = memberLoginFields[0];
    firstNameField.onChangeText(firstNameMock2);

    expect(setFirstNameMock).toHaveBeenCalledWith(firstNameMock2);
    expect(setCurrentLabelMock).toHaveBeenCalledWith(
      uiContentMock.firstNameLabel
    );
    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('onLastNameChangeHandler should change lastName in state', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock1,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([errorMessageMock, setErrorMessageMock]);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    const memberLoginFields = loginBody.props.memberLoginFields;
    const lastNameField = memberLoginFields[1];
    lastNameField.onChangeText(lastNameMock2);

    expect(setLastNameMock).toHaveBeenCalledWith(lastNameMock2);
    expect(setCurrentLabelMock).toHaveBeenCalledWith(
      uiContentMock.lastNameLabel
    );
    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('onEmailAddressChangeHandler should change emailAddress in state', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);
    isEmailValidMock.mockReturnValueOnce(true);

    useStateMock.mockReturnValueOnce([dateOfBirthMock3, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock3, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock3, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock3, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock3,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock3,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock3, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock3,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    const memberLoginFields = loginBody.props.memberLoginFields;
    const emailAddressField = memberLoginFields[2];

    emailAddressField.onChangeText(emailAddressMock2);

    expect(setEmailAddressMock).toHaveBeenCalledWith(emailAddressMock2);
    expect(setCurrentLabelMock).toHaveBeenCalledWith(uiContentMock.emailLabel);
    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useEffectMock.mock.calls[0][1]).toEqual([
      dateOfBirthMock3,
      firstNameMock3,
      lastNameMock3,
      emailAddressMock3,
      primaryMemberRxIdMock3,
    ]);
    expect(useEffectMock.mock.calls[1][1]).toEqual([emailAddressMock3]);
    expect(useEffectMock.mock.calls[2][1]).toEqual([false]);

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('onMemberRxIDChangeHandler should change memberRxId in state', () => {
    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock1,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    const memberLoginFields = loginBody.props.memberLoginFields;
    const primaryMemberRxIdField = memberLoginFields[2];
    primaryMemberRxIdField.onChangeText(primaryMemberRxIdMock2);

    expect(setPrimaryMemberRxIdMock).toHaveBeenCalledWith(
      primaryMemberRxIdMock2
    );
    expect(setCurrentLabelMock).toHaveBeenCalledWith(
      uiContentMock.memberIdLabel
    );
    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('onMemberRxIDChangeHandler should remove extra characters before updating memberRxId in state', () => {
    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock1,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    const memberLoginFields = loginBody.props.memberLoginFields;
    const primaryMemberRxIdField = memberLoginFields[2];
    primaryMemberRxIdField.onChangeText(primaryMemberRxIdMock3);

    expect(setPrimaryMemberRxIdMock).toHaveBeenCalledWith(
      primaryMemberRxIdMock3.trim().replace(/[^\w]*/gi, '')
    );
    expect(setCurrentLabelMock).toHaveBeenCalledWith(
      uiContentMock.memberIdLabel
    );
    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('onMemberRxIDChangeHandler should change memberRxId in state', () => {
    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock3,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);
    useContentMock.mockReturnValue({
      content: signUpUIContentMock,
    });

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    const memberLoginFields = loginBody.props.memberLoginFields;
    const primaryMemberRxIdField = memberLoginFields[2];

    primaryMemberRxIdField.onChangeText(primaryMemberRxIdMock2);

    expect(primaryMemberRxIdField.helpText).toEqual(
      signUpUIContentMock.memberIdHelpText
    );
    expect(primaryMemberRxIdField.placeholder).toEqual(
      signUpUIContentMock.memberIdPlaceholder
    );
    expect(setPrimaryMemberRxIdMock).toHaveBeenCalledWith(
      primaryMemberRxIdMock2
    );

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('onDateOfBirthChangeHandler should change date of birth in state', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock1,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce(['', setErrorMessageMock]);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    loginBody.props.onDateOfBirthChangeHandler(dateOfBirthMock3);
    expect(setDateOfBirthMock).toHaveBeenCalledWith(dateOfBirthMock3);
    expect(setCurrentLabelMock).toHaveBeenCalledWith(undefined);
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('onDateOfBirthChangeHandler: should calculate age and update dob error in login body', () => {
    firefoxCompatibleDateFormatMock.mockReturnValue(
      new Date('1968-08-19T08:00:00.0')
    );
    differenceInYearMock.mockReturnValueOnce(5);
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock1,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce(['', setErrorMessageMock]);

    isDateOfBirthValidMock.mockReturnValueOnce(true);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    loginBody.props.onDateOfBirthChangeHandler(dateOfBirthMock3);
    expect(loginBody.props.showDateOfBirthError).toEqual(false);

    expect(setDateOfBirthMock).toHaveBeenCalledWith(dateOfBirthMock3);
    expect(setCurrentLabelMock).toHaveBeenCalledWith(undefined);
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('[Add Membership] onDateOfBirthChangeHandler: should NOT calculate age and update dob error state even if valid', () => {
    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock1,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce(['', setErrorMessageMock]);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    loginBody.props.onDateOfBirthChangeHandler(dateOfBirthMock3);
    expect(UTCDateMock).not.toBeCalled();

    expect(setDateOfBirthMock).toHaveBeenCalledWith(dateOfBirthMock3);
    expect(setCurrentLabelMock).toHaveBeenCalledWith(undefined);
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('should call memberLogin when onLoginPress is called', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock2, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock2, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock2, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock2, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock2,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock2,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock2,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock2, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock2,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const loginScreen = renderer.create(<LoginScreen />);

    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const button = body.props.children[3];
    button.props.onPress();

    expect(memberAddOrLoginDataLoadingAsyncActionMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      {
        firstName: firstNameMock2,
        lastName: lastNameMock2,
        emailAddress: emailAddressMock2,
        dateOfBirth: dateOfBirthMock2,
        primaryMemberRxId: primaryMemberRxIdMock2,
      }
    );

    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setCurrentLabelMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('should call memberLogin with claim alert ID when onLoginPress is called and claim alert ID exists', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock2, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock2, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock2, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock2, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock2,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock2,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock2,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock2, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock2,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    useRouteMock.mockReturnValue({
      params: { claimAlertId: 'identifier' },
    });

    const loginScreen = renderer.create(<LoginScreen />);

    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const button = body.props.children[3];
    button.props.onPress();

    expect(memberAddOrLoginDataLoadingAsyncActionMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      {
        firstName: firstNameMock2,
        lastName: lastNameMock2,
        emailAddress: emailAddressMock2,
        dateOfBirth: dateOfBirthMock2,
        primaryMemberRxId: primaryMemberRxIdMock2,
        claimAlertId: 'identifier',
      }
    );

    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setCurrentLabelMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it.each([[undefined], [true]])(
    'should call memberLogin with prescriptionId when onLoginPress is called and prescriptionID exists (isBlockchain: %p)',
    (isBlockchainMock?: boolean) => {
      const reduxContextMock: IReduxContext = {
        getState: jest.fn().mockReturnValue({ settings: { token: false } }),
        dispatch: jest.fn(),
      };
      useReduxContextMock.mockReturnValueOnce(reduxContextMock);

      useStateMock.mockReturnValueOnce([dateOfBirthMock2, setDateOfBirthMock]);
      useStateMock.mockReturnValueOnce([firstNameMock2, setFirstNameMock]);
      useStateMock.mockReturnValueOnce([lastNameMock2, setLastNameMock]);
      useStateMock.mockReturnValueOnce([
        emailAddressMock2,
        setEmailAddressMock,
      ]);
      useStateMock.mockReturnValueOnce([
        emailAddressErrorMock2,
        setEmailAddressErrorMock,
      ]);
      useStateMock.mockReturnValueOnce([
        primaryMemberRxIdMock2,
        setPrimaryMemberRxIdMock,
      ]);
      useStateMock.mockReturnValueOnce([
        allCurrentFieldsValidMock2,
        setAllCurrentFieldsValidMock,
      ]);
      useStateMock.mockReturnValueOnce([
        currentLabelMock2,
        setCurrentLabelMock,
      ]);
      useStateMock.mockReturnValueOnce([
        loginBodyRefreshKeyMock2,
        setLoginBodyRefreshKeyMock,
      ]);
      useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

      useNavigationMock.mockReturnValue(rootStackNavigationMock);

      useRouteMock.mockReturnValue({
        params: {
          prescriptionId: 'prescription-id-mock',
          isBlockchain: isBlockchainMock,
        },
      });

      const loginScreen = renderer.create(<LoginScreen />);

      const basicPage = loginScreen.root.findByType(BasicPageConnected);
      const body = basicPage.props.body;
      const button = body.props.children[3];
      button.props.onPress();

      expect(memberAddOrLoginDataLoadingAsyncActionMock).toHaveBeenCalledWith(
        rootStackNavigationMock,
        {
          firstName: firstNameMock2,
          lastName: lastNameMock2,
          emailAddress: emailAddressMock2,
          dateOfBirth: dateOfBirthMock2,
          primaryMemberRxId: primaryMemberRxIdMock2,
          prescriptionId: 'prescription-id-mock',
          isBlockchain: isBlockchainMock,
        }
      );
    }
  );

  it('should call setErrorMessage when onLoginPress is called and member id does not match', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock3, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock3, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock3, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock3, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock3,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock3,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock3,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock2, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock3,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const loginScreen = renderer.create(<LoginScreen />);

    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const button = body.props.children[3];
    button.props.onPress();

    expect(memberAddOrLoginDataLoadingAsyncActionMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      {
        firstName: firstNameMock3,
        lastName: lastNameMock3,
        emailAddress: emailAddressMock3,
        dateOfBirth: dateOfBirthMock3,
        primaryMemberRxId: primaryMemberRxIdMock3,
      }
    );

    expect(setErrorMessageMock).toHaveBeenNthCalledWith(
      1,
      uiContentMock.loginScreenErrorMessage
    );
  });

  it('should not format dateofbirth when onLoginButtonPress is called', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);
    useStateMock.mockReturnValueOnce([dateOfBirthMock3, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock3, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock3, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock3, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock3,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock3,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock3,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock3, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock3,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const loginScreen = renderer.create(<LoginScreen />);

    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const button = body.props.children[3];
    button.props.onPress();
    expect(memberAddOrLoginDataLoadingAsyncActionMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      {
        firstName: firstNameMock3,
        lastName: lastNameMock3,
        emailAddress: emailAddressMock3,
        dateOfBirth: dateOfBirthMock3,
        primaryMemberRxId: primaryMemberRxIdMock3,
      }
    );
    expect(formatToMonthDDYYYYMock).not.toBeCalled();

    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setCurrentLabelMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('should call memberLogin when member Id is not provided and onLoginPress is called', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock3, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock3, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock3, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock3, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock3,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock1,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock3,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock3, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock3,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const button = body.props.children[3];
    button.props.onPress();

    expect(memberAddOrLoginDataLoadingAsyncActionMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      {
        firstName: firstNameMock3,
        lastName: lastNameMock3,
        emailAddress: emailAddressMock3,
        dateOfBirth: dateOfBirthMock3,
      }
    );

    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setCurrentLabelMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('should change Login button styles when all fields on Login form are filled', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock2, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock2, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock2, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock2, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock2,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock2,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock2,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock2, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock2,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    const dateOfBirthField = loginBody.props.onDateOfBirthChangeHandler;
    const memberLoginFields = loginBody.props.memberLoginFields;
    const firstNameField = memberLoginFields[0];
    const lastNameField = memberLoginFields[1];
    const emailAddressField = memberLoginFields[2];

    dateOfBirthField(dateOfBirthMock3);
    firstNameField.onChangeText(firstNameMock3);
    lastNameField.onChangeText(lastNameMock3);
    emailAddressField.onChangeText(emailAddressMock3);

    expect(setDateOfBirthMock).toHaveBeenCalledWith(dateOfBirthMock3);
    expect(setFirstNameMock).toHaveBeenCalledWith(firstNameMock3);
    expect(setLastNameMock).toHaveBeenCalledWith(lastNameMock3);
    expect(setEmailAddressMock).toHaveBeenCalledWith(emailAddressMock3);
    expect(setCurrentLabelMock).toHaveBeenCalledTimes(4);
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    const button = body.props.children[3];

    expect(button.props.viewStyle).toBe(loginScreenStyles.buttonViewStyle);

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('renders email address help text when not in "isAddMembershipFlow"', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock2, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock2, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock2, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock1,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    const memberLoginFields = loginBody.props.memberLoginFields;
    const firstNameField = memberLoginFields[0];
    const lastNameField = memberLoginFields[1];
    const emailAddressField = memberLoginFields[2];

    expect(firstNameField.identifier).toEqual('firstName');
    expect(lastNameField.identifier).toEqual('lastName');
    expect(emailAddressField.identifier).toEqual('emailAddress');

    expect(memberLoginFields.length).toEqual(3);

    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setCurrentLabelMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('doesn\'t display email address field when in "isAddMembershipFlow"', () => {
    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock2, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock2, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock2,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMessageMock]);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    const memberLoginFields = loginBody.props.memberLoginFields;
    const firstNameField = memberLoginFields[0];
    const lastNameField = memberLoginFields[1];
    const primaryMemberRxIdField = memberLoginFields[2];

    expect(firstNameField.identifier).toEqual('firstName');
    expect(lastNameField.identifier).toEqual('lastName');
    expect(primaryMemberRxIdField.identifier).toEqual('primaryMemberRxId');

    expect(memberLoginFields.length).toEqual(3);

    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setCurrentLabelMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('MemberId should not be present when not in "isAddMembershipFlow"', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock1,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([errorMessageMock, setErrorMessageMock]);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    const memberLoginFields = loginBody.props.memberLoginFields;
    const firstNameField = memberLoginFields[0];
    const lastNameField = memberLoginFields[1];
    const emailAddressField = memberLoginFields[2];

    expect(firstNameField.identifier).toEqual('firstName');
    expect(lastNameField.identifier).toEqual('lastName');
    expect(emailAddressField.identifier).toEqual('emailAddress');

    expect(memberLoginFields.length).toEqual(3);

    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setCurrentLabelMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('should show member id when in "isAddMembershipFlow"', () => {
    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock2,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([errorMessageMock, setErrorMessageMock]);
    useContentMock.mockClear();
    useContentMock.mockReturnValue({
      content: signUpUIContentMock,
    });

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    const memberLoginFields = loginBody.props.memberLoginFields;
    const primaryMemberRxIdField = memberLoginFields[2];

    expect(primaryMemberRxIdField.identifier).toBe('primaryMemberRxId');
    expect(primaryMemberRxIdField.textContentType).toBe('name');
    expect(primaryMemberRxIdField.defaultValue).toBe(primaryMemberRxIdMock2);
    expect(primaryMemberRxIdField.helpText).toBe(
      signUpUIContentMock.memberIdHelpText
    );

    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setCurrentLabelMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it('should not show member id when not in "isAddMembershipFlow"', () => {
    const reduxContextMock: IReduxContext = {
      getState: jest.fn().mockReturnValue({ settings: { token: false } }),
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    useStateMock.mockReturnValueOnce([dateOfBirthMock1, setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce([firstNameMock1, setFirstNameMock]);
    useStateMock.mockReturnValueOnce([lastNameMock1, setLastNameMock]);
    useStateMock.mockReturnValueOnce([emailAddressMock1, setEmailAddressMock]);
    useStateMock.mockReturnValueOnce([
      emailAddressErrorMock1,
      setEmailAddressErrorMock,
    ]);
    useStateMock.mockReturnValueOnce([
      primaryMemberRxIdMock2,
      setPrimaryMemberRxIdMock,
    ]);
    useStateMock.mockReturnValueOnce([
      allCurrentFieldsValidMock1,
      setAllCurrentFieldsValidMock,
    ]);
    useStateMock.mockReturnValueOnce([currentLabelMock1, setCurrentLabelMock]);
    useStateMock.mockReturnValueOnce([
      loginBodyRefreshKeyMock1,
      setLoginBodyRefreshKeyMock,
    ]);
    useStateMock.mockReturnValueOnce([errorMessageMock, setErrorMessageMock]);

    const loginScreen = renderer.create(<LoginScreen />);
    const basicPage = loginScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const loginBody = body.props.children[2];
    const memberLoginFields = loginBody.props.memberLoginFields;
    const firstField = memberLoginFields[0];
    const secondField = memberLoginFields[1];
    const emailField = memberLoginFields[2];

    expect(memberLoginFields.length).toEqual(3);

    expect(firstField.identifier).toBe('firstName');
    expect(firstField.textContentType).toBe('name');

    expect(secondField.identifier).toBe('lastName');
    expect(secondField.textContentType).toBe('name');

    expect(emailField.identifier).toBe('emailAddress');
    expect(emailField.textContentType).toBe('emailAddress');
    expect(emailField.helpText).toBe(uiContentMock.emailHelperText);

    expect(setDateOfBirthMock).not.toHaveBeenCalled();
    expect(setFirstNameMock).not.toHaveBeenCalled();
    expect(setLastNameMock).not.toHaveBeenCalled();
    expect(setEmailAddressMock).not.toHaveBeenCalled();
    expect(setEmailAddressErrorMock).not.toHaveBeenCalled();
    expect(setPrimaryMemberRxIdMock).not.toHaveBeenCalled();
    expect(setAllCurrentFieldsValidMock).not.toHaveBeenCalled();
    expect(setCurrentLabelMock).not.toHaveBeenCalled();
    expect(setLoginBodyRefreshKeyMock).not.toHaveBeenCalled();

    expect(useStateMock).toHaveBeenCalledTimes(useStateTimesCalled);
    expect(useEffectMock).toHaveBeenCalledTimes(useEffectTimesCalled);
  });

  it.each([[true], [false]])(
    'shows PBM member phone number when  "member support" link is pressed (isCommunicationContentLoading: %s)',
    async (isCommunicationContentLoading: boolean) => {
      const reduxContextMock: IReduxContext = {
        getState: jest.fn().mockReturnValue({ settings: { token: false } }),
        dispatch: jest.fn(),
      };
      useReduxContextMock.mockReturnValueOnce(reduxContextMock);

      useStateMock.mockReturnValueOnce([dateOfBirthMock3, setDateOfBirthMock]);
      useStateMock.mockReturnValueOnce([firstNameMock3, setFirstNameMock]);
      useStateMock.mockReturnValueOnce([lastNameMock3, setLastNameMock]);
      useStateMock.mockReturnValueOnce([
        emailAddressMock3,
        setEmailAddressMock,
      ]);
      useStateMock.mockReturnValueOnce([
        emailAddressErrorMock3,
        setEmailAddressErrorMock,
      ]);
      useStateMock.mockReturnValueOnce([
        primaryMemberRxIdMock3,
        setPrimaryMemberRxIdMock,
      ]);
      useStateMock.mockReturnValueOnce([
        allCurrentFieldsValidMock3,
        setAllCurrentFieldsValidMock,
      ]);
      useStateMock.mockReturnValueOnce([
        currentLabelMock2,
        setCurrentLabelMock,
      ]);
      useStateMock.mockReturnValueOnce([
        loginBodyRefreshKeyMock3,
        setLoginBodyRefreshKeyMock,
      ]);
      useStateMock.mockReturnValueOnce([errorMessageMock, setErrorMessageMock]);

      useNavigationMock.mockReturnValue(rootStackNavigationMock);

      useContentMock.mockReset();
      useContentMock.mockReturnValueOnce({
        content: uiContentMock,
        isContentLoading: false,
      });

      useContentMock.mockReturnValueOnce({
        content: communicationUIContentMock,
        isContentLoading: isCommunicationContentLoading,
      });

      useContentMock.mockReturnValueOnce({
        content: signUpUIContentMock,
      });

      const loginScreen = renderer.create(<LoginScreen />);

      const basicPage = loginScreen.root.findByType(BasicPageConnected);
      const body = basicPage.props.body;
      const linkPressResult = await body.props.children[1].props.onLinkPress();

      if (isCommunicationContentLoading) {
        expect(callPhoneNumberMock).toHaveBeenCalledTimes(0);
        expect(linkPressResult).toEqual(true);
      } else {
        expect(callPhoneNumberMock).toHaveBeenCalledWith(
          communicationUIContentMock.supportPBMPhone
        );
        expect(linkPressResult).toEqual(false);
      }
    }
  );
});

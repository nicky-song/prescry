// Copyright 2021 Prescryptive Health, Inc.

import React, { BaseSyntheticEvent, useState } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { VerifyIdentityScreen } from './verify-identity.screen';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../guest-experience-logger.middleware';
import { PrimaryTextInput } from '../../../../components/inputs/primary-text/primary-text.input';
import { ITestContainer } from '../../../../testing/test.container';
import { verifyIdentityScreenStyles } from './verify-identity.screen.styles';
import { DatePicker } from '../../../../components/member/pickers/date/date.picker';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import dateFormatter from '../../../../utils/formatters/date.formatter';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { identityVerificationDataLoadingAsyncAction } from '../../store/identity-verification/async-actions/identity-verification-data-loading.async-action';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../../context-providers/redux/redux.context';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { ISignInContent } from '../../../../models/cms-content/sign-in.ui-content';
import { IFormsContent } from '../../../../models/cms-content/forms.ui-content';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('@react-navigation/native');
const navigationMock = useNavigation as jest.Mock;

jest.mock('../../../../components/text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  'react-text-mask',
  () =>
    (
      props: JSX.IntrinsicAttributes &
        React.ClassAttributes<HTMLInputElement> &
        React.InputHTMLAttributes<HTMLInputElement>
    ) =>
      <input type='text' {...{ ...props }} />
);

jest.mock(
  '../../../../components/inputs/primary-text/primary-text.input',
  () => {
    return {
      PrimaryTextInput: ({ children }: ITestContainer) => <div>{children}</div>,
    };
  }
);

jest.mock('../../../../components/member/pickers/date/date.picker', () => {
  return {
    DatePicker: () => <div />,
  };
});

jest.mock(
  '../../store/identity-verification/async-actions/identity-verification-data-loading.async-action'
);
const identityVerificationDataLoadingAsyncActionMock =
  identityVerificationDataLoadingAsyncAction as jest.Mock;

jest.mock('../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../../utils/email.helper');

jest.mock('../../../../utils/validators/date.validator');

jest.mock('../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

jest.mock('../../../../utils/formatters/date.formatter', () => ({
  formatToYMD: jest.fn(),
}));
const formatToYMDMock = dateFormatter.formatToYMD as jest.Mock;

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const signInContentMock = {
  emailPlaceholder: 'email-placeholder-mock',
  invalidEmailErrorText: 'invalid-email-error-text-mock',
  emailLabel: 'email-label-mock',
  verifyIdentityHeader: 'verify-identity-header-mock',
  verifyIdentityInstructions: 'verify-identity-instructions-mock',
  continueButtonCaption: 'continue-button-caption-mock',
} as ISignInContent;

const formsContentMock = {
  dayLabel: 'day-label-mock',
  dobLabel: 'dob-label-mock',
  monthLabel: 'month-label-mock',
  yearLabel: 'year-label-mock',
  months: {
    januaryLabel: 'january-label-mock',
    februaryLabel: 'february-label-mock',
    marchLabel: 'march-label-mock',
    aprilLabel: 'april-label-mock',
    mayLabel: 'may-label-mock',
    juneLabel: 'june-label-mock',
    julyLabel: 'july-label-mock',
    augustLabel: 'august-label-mock',
    septemberLabel: 'september-label-mock',
    octoberLabel: 'october-label-mock',
    novemberLabel: 'november-label-mock',
    decemberLabel: 'december-label-mock',
  },
  phoneNumberLabel: 'phone-number-label-mock',
  phoneNumberPlaceholder: 'phone-number-placeholder-mock',
} as IFormsContent;

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();

describe('VerifyIdentityScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStateMock.mockReturnValue(['', jest.fn()]);
    navigationMock.mockReturnValue(rootStackNavigationMock);
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    useContentMock.mockReturnValue({
      isContentLoading: false,
      content: signInContentMock,
    });
  });

  it('should have BasicPageConnected with Props', () => {
    const verifyIdentityScreen = renderer.create(<VerifyIdentityScreen />);
    const basicPage = verifyIdentityScreen.root.findByType(BasicPageConnected);
    const basicPageProps = basicPage.props;

    expect(basicPage).toBeDefined();
    expect(basicPageProps.footer).toBeDefined();
    expect(basicPageProps.headerViewStyle).toEqual(
      verifyIdentityScreenStyles.basicPageHeaderViewStyle
    );
    expect(basicPageProps.bodyViewStyle).toEqual(
      verifyIdentityScreenStyles.basicPageBodyViewStyle
    );
    expect(basicPageProps.hideNavigationMenuButton).toEqual(true);
    expect(basicPageProps.translateContent).toEqual(true);
  });

  it('should have body with props', () => {
    const setIdentityErrorMock = jest.fn();
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([
      'Invalid pin reset info',
      setIdentityErrorMock,
    ]);
    const verifyIdentityScreen = renderer.create(<VerifyIdentityScreen />);
    const verifyIdentityBody =
      verifyIdentityScreen.root.findByType(BasicPageConnected).props.body;

    expect(verifyIdentityBody.type).toEqual(View);
    expect(verifyIdentityBody.props.style).toEqual(
      verifyIdentityScreenStyles.bodyViewStyle
    );
    expect(verifyIdentityBody.props.children.length).toEqual(3);
    const verifyIdentityBodyChild = verifyIdentityBody.props.children[2];
    const verifyIdentityBodyProps = verifyIdentityBodyChild.props;

    expect(verifyIdentityBodyChild.props.children[0].props.testID).toEqual(
      'verifyIdentityScreenPhoneNumberView'
    );

    expect(
      verifyIdentityBody.props.children[1].props.children.props.children
    ).toBe('Invalid pin reset info');

    expect(verifyIdentityBody).toBeDefined();
    expect(verifyIdentityBodyProps.enableVerifyIdentity).toBeFalsy();
  });

  it('renders "Continue" button as footer', () => {
    const testRenderer = renderer.create(<VerifyIdentityScreen />);
    const button =
      testRenderer.root.findByType(BasicPageConnected).props.footer;

    expect(button.type).toEqual(BaseButton);
    expect(button.props.isSkeleton).toEqual(false);
    expect(button.props.children).toEqual(
      signInContentMock.continueButtonCaption
    );
    expect(button.props.testID).toEqual(
      'verifyIdentityScreenBaseButtonContinue'
    );
  });

  it('onPhoneNumberChangeHandler should change phoneNumber in state', () => {
    const setPhoneNumberMock = jest.fn();
    const setIdentityErrorMock = jest.fn();
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', setPhoneNumberMock]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([
      'Invalid pin reset info',
      setIdentityErrorMock,
    ]);
    const verifyIdentityScreen = renderer.create(<VerifyIdentityScreen />);
    verifyIdentityScreen.root
      .findByType(BasicPageConnected)
      .props.body.props.children[2].props.children[0].props.children[1].props.onChange(
        { target: { value: '1112223344' } } as BaseSyntheticEvent
      );
    expect(setPhoneNumberMock).toBeCalledWith('1112223344');
    expect(setIdentityErrorMock).toBeCalledTimes(1);
  });

  it('onEmailAddressChangeHandler should change emailAddress in state', () => {
    const setEmailAddressMock = jest.fn();
    const setIdentityErrorMock = jest.fn();
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', setEmailAddressMock]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([
      'Invalid pin reset info',
      setIdentityErrorMock,
    ]);

    const verifyIdentityScreen = renderer.create(<VerifyIdentityScreen />);
    verifyIdentityScreen.root
      .findByType(BasicPageConnected)
      .props.body.props.children[2].props.children[1][0].props.children.props.onChangeText(
        'personal email'
      );
    expect(setEmailAddressMock).toBeCalledWith('personal email');
    expect(setIdentityErrorMock).toBeCalledTimes(1);
  });

  it('onDateOfBirthChangeHandler should change date of birth in state', () => {
    const setDateOfBirthMock = jest.fn();
    const setIdentityErrorMock = jest.fn();
    useStateMock.mockReturnValueOnce(['', setDateOfBirthMock]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([
      'Invalid pin reset info',
      setIdentityErrorMock,
    ]);

    const testRenderer = renderer.create(<VerifyIdentityScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const datePicker = bodyRenderer.root.findByType(DatePicker);
    const getSelectedDate = datePicker.props.getSelectedDate;
    getSelectedDate('07-31-2019');

    expect(setDateOfBirthMock).toBeCalledWith('07-31-2019');
    expect(setIdentityErrorMock).toBeCalledTimes(1);
  });

  it('should call verifyIdentity when onContinuePress is called', () => {
    formatToYMDMock.mockReturnValueOnce('2000-07-31');
    useStateMock.mockReturnValueOnce(['July-31-2000', jest.fn()]);
    useStateMock.mockReturnValueOnce(['test@gmail.com', jest.fn()]);
    useStateMock.mockReturnValueOnce(['1234567890', jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);

    const testRenderer = renderer.create(<VerifyIdentityScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const footerRenderer = renderer.create(basicPage.props.footer);
    const button = footerRenderer.root.findByType(BaseButton);

    button.props.onPress();
    expect(guestExperienceCustomEventLoggerMock).toBeCalledWith(
      CustomAppInsightEvents.CLICKED_CONTINUE_VERIFY_IDENTITY_SCREEN,
      {}
    );
    expect(formatToYMDMock).toBeCalledWith('July-31-2000');
    expect(identityVerificationDataLoadingAsyncActionMock).toHaveBeenCalledWith(
      {
        reduxDispatch: reduxDispatchMock,
        reduxGetState: reduxGetStateMock,
        navigation: rootStackNavigationMock,
        requestBody: {
          dateOfBirth: '2000-07-31',
          emailAddress: 'test@gmail.com',
          phoneNumber: '+11234567890',
        },
      }
    );
  });

  it('should set error when API fails onContinuePress', () => {
    const setIdentityErrorMock = jest.fn();
    formatToYMDMock.mockReturnValueOnce('2000-07-31');
    useStateMock.mockReturnValueOnce(['July-31-2000', jest.fn()]);
    useStateMock.mockReturnValueOnce(['test@gmail.com', jest.fn()]);
    useStateMock.mockReturnValueOnce(['1234567890', jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([undefined, setIdentityErrorMock]);
    const mockError = new Error('Some Error!');
    identityVerificationDataLoadingAsyncActionMock.mockImplementation(() => {
      throw mockError;
    });
    const testRenderer = renderer.create(<VerifyIdentityScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const footerRenderer = renderer.create(basicPage.props.footer);
    const button = footerRenderer.root.findByType(BaseButton);

    button.props.onPress();
    expect(guestExperienceCustomEventLoggerMock).toBeCalledWith(
      CustomAppInsightEvents.CLICKED_CONTINUE_VERIFY_IDENTITY_SCREEN,
      {}
    );
    expect(identityVerificationDataLoadingAsyncActionMock).toHaveBeenCalledWith(
      {
        reduxDispatch: reduxDispatchMock,
        reduxGetState: reduxGetStateMock,
        navigation: rootStackNavigationMock,
        requestBody: {
          dateOfBirth: '2000-07-31',
          emailAddress: 'test@gmail.com',
          phoneNumber: '+11234567890',
        },
      }
    );
    expect(setIdentityErrorMock).toHaveBeenNthCalledWith(1, 'Some Error!');
    expect(formatToYMDMock).toBeCalledWith('July-31-2000');
  });

  it('renders email address field container', () => {
    const verifyIdentityScreen = renderer.create(<VerifyIdentityScreen />);

    const basicPage = verifyIdentityScreen.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const fieldContainer = body.props.children[2];
    const identityFieldsContainer = fieldContainer.props.children[1];
    const emailFieldContainer = identityFieldsContainer[0];

    expect(emailFieldContainer.props.style).toEqual(
      verifyIdentityScreenStyles.textFieldsViewStyle
    );
    expect(emailFieldContainer.props.testID).toEqual(
      'verifyIdentityScreenView-emailAddress'
    );
  });

  it('should render expected text boxes when errorMessage has new line character', () => {
    const setIdentityErrorMock = jest.fn();
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([
      'First line of error. \n Second Line of error.',
      setIdentityErrorMock,
    ]);

    const verifyIdentityScreen = renderer.create(<VerifyIdentityScreen />);
    const errorMessageHolder =
      verifyIdentityScreen.root.findByType(BasicPageConnected).props.body.props
        .children[1];
    expect(errorMessageHolder.props.children.props.children).toEqual(
      'First line of error. \n Second Line of error.'
    );
  });

  it.each([
    [false, undefined],
    [true, signInContentMock.invalidEmailErrorText],
  ])(
    'has PrimaryTextInput (hasEmailError: %p)',
    (hasEmailErrorMock: boolean, expectedErrorMessage: string | undefined) => {
      useStateMock.mockReturnValueOnce([undefined, jest.fn()]);
      useStateMock.mockReturnValueOnce([undefined, jest.fn()]);
      useStateMock.mockReturnValueOnce([undefined, jest.fn()]);
      useStateMock.mockReturnValueOnce([hasEmailErrorMock, jest.fn()]);

      const testRenderer = renderer.create(<VerifyIdentityScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const body = basicPage.props.body;
      const fieldContainer = body.props.children[2];
      const identityFieldsContainer = fieldContainer.props.children[1];
      const emailFieldContainer = identityFieldsContainer[0];
      const emailInput = emailFieldContainer.props.children;

      expect(emailInput.type).toEqual(PrimaryTextInput);
      expect(emailInput.props.label).toEqual(signInContentMock.emailLabel);
      expect(emailInput.props.isRequired).toEqual(true);
      expect(emailInput.props.textContentType).toBe('emailAddress');
      expect(emailInput.props.placeholder).toBe(
        signInContentMock.emailPlaceholder
      );
      expect(emailInput.props.defaultValue).toBeUndefined();
      expect(emailInput.props.helpMessage).toBeUndefined();
      expect(emailInput.props.errorMessage).toEqual(expectedErrorMessage);
    }
  );

  it('should have DatePicker', () => {
    const dateMock = new Date().toDateString();
    useStateMock.mockReturnValueOnce([dateMock, jest.fn()]);
    const isContentLoadingMock = false;
    useContentMock.mockReturnValue({
      isContentLoading: isContentLoadingMock,
      content: formsContentMock,
    });

    const testRenderer = renderer.create(<VerifyIdentityScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const datePicker = bodyRenderer.root.findByType(DatePicker);

    expect(datePicker.props.isRequired).toEqual(true);
    expect(datePicker.props.getSelectedDate).toEqual(expect.any(Function));
    expect(datePicker.props.defaultValue).toEqual(dateMock);
    expect(datePicker.props.label).toEqual(formsContentMock.dobLabel);
    expect(datePicker.props.dayLabel).toEqual(formsContentMock.dayLabel);
    expect(datePicker.props.monthLabel).toEqual(formsContentMock.monthLabel);
    expect(datePicker.props.yearLabel).toEqual(formsContentMock.yearLabel);
    expect(datePicker.props.monthList).toEqual(
      Object.values(formsContentMock.months)
    );
    expect(datePicker.props.isSkeleton).toEqual(isContentLoadingMock);
  });

  it('navigates back correctly', () => {
    rootStackNavigationMock.canGoBack = jest.fn().mockReturnValue(true);
    const testRenderer = renderer.create(<VerifyIdentityScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    basicPage.props.navigateBack();

    expect(rootStackNavigationMock.goBack).toBeCalledTimes(1);
  });
});

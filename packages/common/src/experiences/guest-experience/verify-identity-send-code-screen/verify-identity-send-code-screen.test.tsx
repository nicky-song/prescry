// Copyright 2021 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import renderer from 'react-test-renderer';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { RadioButtonToggle } from '../../../components/member/radio-button-toggle/radio-button-toggle';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { MarkdownText } from '../../../components/text/markdown-text/markdown-text';
import { ITestContainer } from '../../../testing/test.container';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../guest-experience-logger.middleware';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import {
  IVerifyIdentitySendCodeScreenProps,
  VerifyIdentitySendCodeScreen,
} from './verify-identity-send-code-screen';
import { verifyIdentitySendCodeScreenStyle } from './verify-identity-send-code-screen.style';
import { sendVerificationCodeDataLoadingAsyncAction } from '../store/identity-verification/async-actions/send-verification-code-data-loading.async-action';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../context-providers/redux/redux.context';
import { ISignInContent } from '../../../models/cms-content/sign-in.ui-content';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../../../components/text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../guest-experience-logger.middleware');
jest.mock('@react-navigation/native');
const navigationMock = useNavigation as jest.Mock;
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

jest.mock(
  '../store/identity-verification/async-actions/send-verification-code-data-loading.async-action'
);
const sendVerificationCodeDataLoadingAsyncActionMock =
  sendVerificationCodeDataLoadingAsyncAction as jest.Mock;

jest.mock('../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const verifyIdentitySendCodeScreenProps: IVerifyIdentitySendCodeScreenProps = {
  maskedPhoneNumber: 'phone-number',
  maskedEmailAddress: 'email-address',
};

const contentMock = {
  verifyIdentitySendCodeHeader: 'verify-identity-send-code-header-mock',
  verifyIdentitySendCodeInstructions:
    'verify-identity-send-code-instructions-mock',
  continueButtonCaption: 'continue-button-caption-mock',
} as ISignInContent;

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();

describe('VerifyIdentitySendCodeScreen ', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useStateMock.mockReturnValue([undefined, jest.fn()]);

    navigationMock.mockReturnValue(rootStackNavigationMock);
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    useContentMock.mockReturnValue({
      isContentLoading: false,
      content: contentMock,
    });
  });

  it('should render a BasicPageConnected with props', () => {
    const testRenderer = renderer.create(
      <VerifyIdentitySendCodeScreen {...verifyIdentitySendCodeScreenProps} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPage.props;

    expect(pageProps.hideNavigationMenuButton).toBeTruthy();
    expect(pageProps.showProfileAvatar).toBeFalsy();
    expect(pageProps.navigateBack).toBe(rootStackNavigationMock.goBack);
    expect(pageProps.hideApplicationHeader).toBeFalsy();
    expect(pageProps.translateContent).toBeTruthy();
  });

  it('renders body as expected', () => {
    useStateMock.mockReturnValueOnce([undefined, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([undefined, jest.fn()]);
    const testRenderer = renderer.create(
      <VerifyIdentitySendCodeScreen {...verifyIdentitySendCodeScreenProps} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPage.props;
    const bodyProp = pageProps.body.props.children[0];

    const headerContainer = bodyProp.props.children[0];
    const header = headerContainer.props.children[0];
    const headerText = header.props.children;
    const instructions = headerContainer.props.children[1];
    const instructionsText = instructions.props.children;

    expect(headerContainer.props.style).toEqual(
      verifyIdentitySendCodeScreenStyle.headerViewStyle
    );
    expect(header.type).toEqual(Text);
    expect(header.props.style).toEqual(
      verifyIdentitySendCodeScreenStyle.headerTextStyle
    );
    expect(headerText).toEqual(contentMock.verifyIdentitySendCodeHeader);
    expect(instructions.type).toEqual(MarkdownText);
    expect(instructions.props.isSkeleton).toEqual(false);
    expect(instructionsText).toEqual(
      contentMock.verifyIdentitySendCodeInstructions
    );
  });

  it('renders RadioButtonToggle in body as expected', () => {
    useStateMock.mockReturnValueOnce([undefined, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([undefined, jest.fn()]);
    const testRenderer = renderer.create(
      <VerifyIdentitySendCodeScreen {...verifyIdentitySendCodeScreenProps} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPage.props;
    const bodyProp = pageProps.body.props.children[0];
    const bodyContainer = bodyProp.props.children[1];
    const radioButtonToggle = bodyContainer.props.children[1];

    expect(bodyContainer.type).toEqual(View);
    expect(bodyContainer.props.style).toEqual(
      verifyIdentitySendCodeScreenStyle.bodyContainer
    );

    expect(radioButtonToggle.type).toEqual(RadioButtonToggle);
    expect(radioButtonToggle.props.viewStyle).toEqual(
      verifyIdentitySendCodeScreenStyle.toggleContainerViewStyle
    );
    expect(radioButtonToggle.props.checkBoxContainerViewStyle).toEqual(
      verifyIdentitySendCodeScreenStyle.toggleViewStyle
    );
    expect(radioButtonToggle.props.optionAText).toEqual(
      verifyIdentitySendCodeScreenProps.maskedPhoneNumber
    );
    expect(radioButtonToggle.props.optionBText).toEqual(
      verifyIdentitySendCodeScreenProps.maskedEmailAddress
    );
    expect(radioButtonToggle.props.buttonViewStyle).toEqual(
      verifyIdentitySendCodeScreenStyle.buttonViewStyle
    );
  });

  it('renders error in body when expected', () => {
    const errorMessage = 'error';
    useStateMock.mockReturnValueOnce([undefined, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([errorMessage, jest.fn()]);
    const testRenderer = renderer.create(
      <VerifyIdentitySendCodeScreen {...verifyIdentitySendCodeScreenProps} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPage.props;
    const bodyProp = pageProps.body.props.children[0];
    const bodyContainer = bodyProp.props.children[1];
    const errorContainer = bodyContainer.props.children[0];
    const error = errorContainer.props.children;

    expect(errorContainer.type).toEqual(View);
    expect(errorContainer.props.style).toEqual(
      verifyIdentitySendCodeScreenStyle.errorContainerViewStyle
    );
    expect(error.type).toEqual(MarkdownText);
    expect(error.props.children).toEqual(errorMessage);
  });

  it('renders button with disabled view style by default', () => {
    useStateMock.mockReturnValueOnce([undefined, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([undefined, jest.fn()]);
    const testRenderer = renderer.create(
      <VerifyIdentitySendCodeScreen {...verifyIdentitySendCodeScreenProps} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPage.props;
    const footer = pageProps.body.props.children[1];

    expect(footer.type).toEqual(BaseButton);
    expect(footer.props.disabled).toEqual(true);
    expect(footer.props.isSkeleton).toEqual(false);
    expect(footer.props.children).toEqual(contentMock.continueButtonCaption);
    expect(footer.props.testID).toEqual(
      'verifyIdentitySendCodeScreenBaseButtonContinue'
    );
  });

  it('should call guestExperienceCustomEventLogger and onContinuePress when continue button pressed', () => {
    useStateMock.mockReturnValueOnce([0, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([undefined, jest.fn()]);
    const testRenderer = renderer.create(
      <VerifyIdentitySendCodeScreen {...verifyIdentitySendCodeScreenProps} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const continueButton = basicPage.props.body.props.children[1];
    continueButton.props.onPress();
    expect(guestExperienceCustomEventLoggerMock).toBeCalledWith(
      CustomAppInsightEvents.CLICKED_CONTINUE_VERIFY_IDENTITY_SEND_CODE_SCREEN,
      {
        verificationType: 'PHONE',
      }
    );
    expect(sendVerificationCodeDataLoadingAsyncActionMock).toBeCalledWith({
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
      verificationType: 'PHONE',
    });
  });

  it('should set error onContinuePress when API throws exception', () => {
    const setErrorMock = jest.fn();
    useStateMock.mockReturnValueOnce([0, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([undefined, setErrorMock]);
    const mockError = new Error('Some Error!');
    sendVerificationCodeDataLoadingAsyncActionMock.mockImplementation(() => {
      throw mockError;
    });
    const testRenderer = renderer.create(
      <VerifyIdentitySendCodeScreen {...verifyIdentitySendCodeScreenProps} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const continueButton = basicPage.props.body.props.children[1];
    continueButton.props.onPress();
    expect(guestExperienceCustomEventLoggerMock).toBeCalledWith(
      CustomAppInsightEvents.CLICKED_CONTINUE_VERIFY_IDENTITY_SEND_CODE_SCREEN,
      {
        verificationType: 'PHONE',
      }
    );
    expect(sendVerificationCodeDataLoadingAsyncActionMock).toBeCalledWith({
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
      verificationType: 'PHONE',
    });
    expect(setErrorMock).toBeCalledTimes(2);
    expect(setErrorMock).toHaveBeenNthCalledWith(1, undefined);
    expect(setErrorMock).toHaveBeenNthCalledWith(2, 'Some Error!');
  });
});

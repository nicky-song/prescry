// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import {
  IVerifyIdentityVerificationCodeScreenProps,
  VerifyIdentityVerificationCodeScreen,
} from './verify-identity-verification-code.screen';
import { verifyIdentityVerificationCodeStyles } from './verify-identity-verification-code.screen.styles';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { getChildren } from '../../../../../testing/test.helper';
import { Heading } from '../../../../../components/member/heading/heading';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { PrimaryTextInput } from '../../../../../components/inputs/primary-text/primary-text.input';
import { InlineLink } from '../../../../../components/member/links/inline/inline.link';
import { VerificationTypes } from '../../../../../models/api-request-body/send-verification-code.request-body';
import { IResetPinRequestBody } from '../../../../../models/api-request-body/reset-pin.request-body';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../../../context-providers/redux/redux.context';

import { resendVerificationCodeDataLoadingAsyncAction } from '../../../store/identity-verification/async-actions/resend-verification-code-data-loading.async-action';
import { resetPinVerificationCodeDataLoadingAsyncAction } from '../../../store/identity-verification/actions/reset-pin-verification-code-data-loading-async-action';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { ISignInContent } from '../../../../../models/cms-content/sign-in.ui-content';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../../../guest-experience-logger.middleware');

jest.mock(
  '../../../../../components/inputs/primary-text/primary-text.input',
  () => ({
    PrimaryTextInput: () => <div />,
  })
);
jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

jest.mock(
  '../../../store/identity-verification/async-actions/resend-verification-code-data-loading.async-action'
);
const resendVerificationCodeDataLoadingAsyncActionMock =
  resendVerificationCodeDataLoadingAsyncAction as jest.Mock;
jest.mock(
  '../../../store/identity-verification/actions/reset-pin-verification-code-data-loading-async-action'
);
const resetPinVerificationCodeDataLoadingAsyncActionMock =
  resetPinVerificationCodeDataLoadingAsyncAction as jest.Mock;

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const mockVerificationCodeScreenProps: IVerifyIdentityVerificationCodeScreenProps =
  {
    verificationType: 'EMAIL',
    maskedValue: 'd.******@gmail.com',
  };

const contentMock = {
  verificationCodeConfirmationText: 'verification-code-confirmation-text-mock',
  enterCode: 'enter-code-mock',
  verificationCodeInstructions: 'verification-code-instructions-mock',
  otcPlaceholderText: 'otc-placeholder-text-mock',
  resendCodeQuestionText: 'resend-code-question-text-mock',
  resendCodeText: 'resend-code-text-mock',
  verifyButtonLabel: 'verify-button-label-mock',
} as ISignInContent;

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();
describe('VerifyIdentityVerificationCodeScreen ', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStateMock.mockReturnValue([undefined, jest.fn()]);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);
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

  it('initializes state', () => {
    renderer.create(
      <VerifyIdentityVerificationCodeScreen
        {...mockVerificationCodeScreenProps}
      />
    );

    expect(useStateMock).toHaveBeenCalledTimes(2);
    expect(useStateMock).toHaveBeenNthCalledWith(1, '');
    expect(useStateMock).toHaveBeenNthCalledWith(2, undefined);
  });

  it('renders as BasicPageConnected', () => {
    const testRenderer = renderer.create(
      <VerifyIdentityVerificationCodeScreen
        {...mockVerificationCodeScreenProps}
      />
    );
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    const pageProps = basicPage.props;

    expect(pageProps.hideNavigationMenuButton).toEqual(true);
    expect(pageProps.bodyViewStyle).toEqual({});
    expect(pageProps.allowBodyGrow).toEqual(true);
    expect(pageProps.navigateBack).toBe(rootStackNavigationMock.goBack);
    expect(pageProps.translateContent).toEqual(true);
  });

  it('renders body in content container', () => {
    const testRenderer = renderer.create(
      <VerifyIdentityVerificationCodeScreen
        {...mockVerificationCodeScreenProps}
      />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyContentContainer = basicPage.props.body;

    expect(bodyContentContainer.type).toEqual(BodyContentContainer);
    expect(bodyContentContainer.props.viewStyle).toEqual(
      verifyIdentityVerificationCodeStyles.bodyContainerViewStyle
    );
    expect(getChildren(bodyContentContainer).length).toEqual(2);
  });

  it('renders top content container', () => {
    const testRenderer = renderer.create(
      <VerifyIdentityVerificationCodeScreen
        {...mockVerificationCodeScreenProps}
      />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContentContainer =
      bodyRenderer.root.findByType(BodyContentContainer);
    const topContentContainer = getChildren(bodyContentContainer)[0];

    expect(topContentContainer.type).toEqual(View);
    expect(topContentContainer.props.style).toEqual(
      verifyIdentityVerificationCodeStyles.bodyViewStyle
    );
    expect(topContentContainer.props.testID).toEqual(
      'pinResetVerificationCode'
    );
    expect(getChildren(topContentContainer).length).toEqual(6);
  });

  it('renders heading in top content container', () => {
    const testRenderer = renderer.create(
      <VerifyIdentityVerificationCodeScreen
        {...mockVerificationCodeScreenProps}
      />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContentContainer =
      bodyRenderer.root.findByType(BodyContentContainer);
    const topContentContainer = getChildren(bodyContentContainer)[0];
    const heading = getChildren(topContentContainer)[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.textStyle).toEqual(
      verifyIdentityVerificationCodeStyles.headingTextStyle
    );
    expect(heading.props.isSkeleton).toEqual(false);
    expect(heading.props.children).toEqual(contentMock.enterCode);
  });

  it('renders instructions in top content container', () => {
    const maskedValueMock = '(xxx) xxx-6848';
    const testRenderer = renderer.create(
      <VerifyIdentityVerificationCodeScreen
        {...mockVerificationCodeScreenProps}
        maskedValue={maskedValueMock}
      />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContentContainer =
      bodyRenderer.root.findByType(BodyContentContainer);
    const topContentContainer = getChildren(bodyContentContainer)[0];
    const confirmationText = getChildren(topContentContainer)[1];

    expect(confirmationText.type).toEqual(BaseText);
    expect(confirmationText.props.testID).toEqual(
      'pinResetVerificationCodeScreenHeader'
    );
    expect(confirmationText.props.isSkeleton).toEqual(false);
    expect(confirmationText.props.children[0]).toEqual(
      contentMock.verificationCodeInstructions
    );
    expect(confirmationText.props.children[1]).toEqual(' ');
    expect(confirmationText.props.children[2]).toEqual(maskedValueMock);
  });

  it.each([[undefined], ['error-message']])(
    'renders error message (%p) in top content container',
    (errorMessageMock: undefined | string) => {
      const setVerificationCodeMock = jest.fn();
      const setErrorMessageMock = jest.fn();
      useStateMock.mockReturnValueOnce(['', setVerificationCodeMock]);
      useStateMock.mockReturnValueOnce([errorMessageMock, setErrorMessageMock]);
      const testRenderer = renderer.create(
        <VerifyIdentityVerificationCodeScreen
          {...mockVerificationCodeScreenProps}
        />
      );
      const basicPage = testRenderer.root.findByType(BasicPageConnected);

      const bodyRenderer = renderer.create(basicPage.props.body);
      const bodyContentContainer =
        bodyRenderer.root.findByType(BodyContentContainer);
      const topContentContainer = getChildren(bodyContentContainer)[0];
      const errorContent = getChildren(topContentContainer)[2];

      if (!errorMessageMock) {
        expect(errorContent).toBeNull();
      } else {
        expect(errorContent.type).toEqual(BaseText);
        expect(errorContent.props.style).toEqual(
          verifyIdentityVerificationCodeStyles.errorMessageTextStyle
        );
        expect(errorContent.props.children).toEqual(errorMessageMock);
        expect(errorContent.props.testID).toEqual(
          'verifyIdentityVerificationCodeErrorMessage'
        );
      }
    }
  );

  it.each([[undefined], [false], [true]])(
    'renders resend confirmation (isVerificationCodeSent: %p) in top content container',
    (isVerificationCodeSentMock: undefined | boolean) => {
      const testRenderer = renderer.create(
        <VerifyIdentityVerificationCodeScreen
          {...mockVerificationCodeScreenProps}
          isVerificationCodeSent={isVerificationCodeSentMock}
        />
      );
      const basicPage = testRenderer.root.findByType(BasicPageConnected);

      const bodyRenderer = renderer.create(basicPage.props.body);
      const bodyContentContainer =
        bodyRenderer.root.findByType(BodyContentContainer);
      const topContentContainer = getChildren(bodyContentContainer)[0];
      const confirmationContent = getChildren(topContentContainer)[3];

      if (!isVerificationCodeSentMock) {
        expect(confirmationContent).toBeNull();
      } else {
        expect(confirmationContent.type).toEqual(BaseText);
        expect(confirmationContent.props.style).toEqual(
          verifyIdentityVerificationCodeStyles.resendCodeConfirmationTextStyle
        );
        expect(confirmationContent.props.isSkeleton).toEqual(false);
        expect(confirmationContent.props.children).toEqual(
          contentMock.verificationCodeConfirmationText
        );
      }
    }
  );

  it('renders text input in top content container', () => {
    const setVerificationCodeMock = jest.fn();
    const verificationCodeMock = '123456';
    useStateMock.mockReturnValueOnce([
      verificationCodeMock,
      setVerificationCodeMock,
    ]);
    const setErrorMessageMock = jest.fn();
    useStateMock.mockReturnValueOnce(['', setErrorMessageMock]);
    const testRenderer = renderer.create(
      <VerifyIdentityVerificationCodeScreen
        {...mockVerificationCodeScreenProps}
      />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContentContainer =
      bodyRenderer.root.findByType(BodyContentContainer);
    const topContentContainer = getChildren(bodyContentContainer)[0];
    const textInput = getChildren(topContentContainer)[4];

    expect(textInput.type).toEqual(PrimaryTextInput);
    expect(textInput.props.textContentType).toEqual('oneTimeCode');
    expect(textInput.props.keyboardType).toEqual('phone-pad');
    expect(textInput.props.maxLength).toEqual(6);
    expect(textInput.props.placeholder).toEqual(contentMock.otcPlaceholderText);
    expect(textInput.props.onChangeText).toEqual(setVerificationCodeMock);
    expect(textInput.props.value).toEqual(verificationCodeMock);
    expect(textInput.props.viewStyle).toEqual(
      verifyIdentityVerificationCodeStyles.oneTimeCodeViewStyle
    );
    expect(textInput.props.testID).toEqual(
      'verifyIdentityVerificationCodeTextInput'
    );
  });

  it('renders "Resend" question in top content container', () => {
    const testRenderer = renderer.create(
      <VerifyIdentityVerificationCodeScreen
        {...mockVerificationCodeScreenProps}
      />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContentContainer =
      bodyRenderer.root.findByType(BodyContentContainer);
    const topContentContainer = getChildren(bodyContentContainer)[0];
    const resendContent = getChildren(topContentContainer)[5];

    expect(resendContent.type).toEqual(BaseText);
    expect(resendContent.props.testID).toEqual(
      'verificationcodeScreenResendCode'
    );
    expect(resendContent.props.style).toEqual(
      verifyIdentityVerificationCodeStyles.resendCodeViewStyle
    );
    expect(resendContent.props.isSkeleton).toEqual(false);

    const children = getChildren(resendContent);
    expect(children.length).toEqual(3);

    expect(children[0]).toEqual(contentMock.resendCodeQuestionText);
    expect(children[1]).toEqual(' ');

    const link = children[2];
    expect(link.type).toEqual(InlineLink);
    expect(link.props.onPress).toEqual(expect.any(Function));
    expect(link.props.children).toEqual(contentMock.resendCodeText);
  });

  it('handles Resend Code link press', () => {
    const setVerificationCodeMock = jest.fn();
    const setErrorMessageMock = jest.fn();
    useStateMock.mockReturnValueOnce(['', setVerificationCodeMock]);
    useStateMock.mockReturnValueOnce(['', setErrorMessageMock]);
    const verificationTypeMock: VerificationTypes = 'EMAIL';

    const testRenderer = renderer.create(
      <VerifyIdentityVerificationCodeScreen
        {...mockVerificationCodeScreenProps}
        verificationType={verificationTypeMock}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPage.props.body);
    const link = bodyRenderer.root.findByType(InlineLink);

    link.props.onPress();
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.CLICKED_VERIFY_IDENTITY_RESEND_CODE_BUTTON,
      {}
    );
    expect(setVerificationCodeMock).toHaveBeenLastCalledWith('');
    expect(
      resendVerificationCodeDataLoadingAsyncActionMock
    ).toHaveBeenLastCalledWith({
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
      verificationType: verificationTypeMock,
    });
  });

  it.each([
    ['', false],
    ['1', false],
    ['12345', false],
    ['123456', true],
  ])(
    'renders verify button (verifyCode: %p)',
    (verificationCodeMock: string, isEnabledExpected: boolean) => {
      useStateMock.mockReturnValueOnce([verificationCodeMock, jest.fn()]);
      useStateMock.mockReturnValueOnce(['', jest.fn()]);
      const testRenderer = renderer.create(
        <VerifyIdentityVerificationCodeScreen
          {...mockVerificationCodeScreenProps}
        />
      );
      const basicPage = testRenderer.root.findByType(BasicPageConnected);

      const bodyRenderer = renderer.create(basicPage.props.body);
      const bodyContentContainer =
        bodyRenderer.root.findByType(BodyContentContainer);
      const bottomContent = getChildren(bodyContentContainer)[1];

      expect(bottomContent.type).toEqual(BaseButton);
      expect(bottomContent.props.disabled).toEqual(!isEnabledExpected);
      expect(bottomContent.props.viewStyle).toEqual(
        verifyIdentityVerificationCodeStyles.buttonViewStyle
      );
      expect(bottomContent.props.onPress).toEqual(expect.any(Function));
      expect(bottomContent.props.isSkeleton).toEqual(false);
      expect(bottomContent.props.children).toEqual(
        contentMock.verifyButtonLabel
      );
      expect(bottomContent.props.testID).toEqual(
        'verifyIdentityVerificationCodeVerifyButton'
      );
    }
  );

  it('handles Verify Button press', () => {
    const verificationCodeMock = '123456';
    useStateMock.mockReturnValueOnce([verificationCodeMock, jest.fn()]);
    useStateMock.mockReturnValue(['', jest.fn()]);

    const maskedValueMock = 'masked-value';
    const verificationTypeMock: VerificationTypes = 'PHONE';

    const testRenderer = renderer.create(
      <VerifyIdentityVerificationCodeScreen
        {...mockVerificationCodeScreenProps}
        maskedValue={maskedValueMock}
        verificationType={verificationTypeMock}
      />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPage.props.body);
    const verifyButton = bodyRenderer.root.findByType(BaseButton);

    verifyButton.props.onPress();

    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.CLICKED_VERIFY_IDENTITY_VERIFY_BUTTON,
      {}
    );

    const expectedResetPinRequestBody: IResetPinRequestBody = {
      code: verificationCodeMock,
      maskedValue: maskedValueMock,
      verificationType: verificationTypeMock,
    };

    expect(
      resetPinVerificationCodeDataLoadingAsyncActionMock
    ).toHaveBeenCalledWith({
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
      requestBody: expectedResetPinRequestBody,
    });
  });
});

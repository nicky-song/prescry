// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import renderer from 'react-test-renderer';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ISignInContent } from '../../../models/cms-content/sign-in.ui-content';
import { LinkButton } from '../../buttons/link/link.button';
import { PrimaryTextInput } from '../../inputs/primary-text/primary-text.input';
import { BaseText } from '../../text/base-text/base-text';
import {
  IPhoneNumberVerificationContainerProps,
  PhoneNumberVerificationContainer,
} from './phone-number-verification-container';
import { phoneNumberVerificationContainerStyles } from './phone-number-verification-container.styles';

jest.mock('../../inputs/primary-text/primary-text.input', () => ({
  PrimaryTextInput: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const mockOnTextInputChangeHandler = jest.fn();
const mockResendCode = jest.fn();
const mockVerifyCode = jest.fn();
const mockResetPhoneNumberVerification = jest.fn();

const phoneNumberVerificationContainerProps: IPhoneNumberVerificationContainerProps =
  {
    isIncorrectCode: false,
    isOneTimePasswordSent: false,
    isScreenFocused: true,
    onTextInputChangeHandler: mockOnTextInputChangeHandler,
    resendCode: mockResendCode,
    resetVerification: mockResetPhoneNumberVerification,
    verificationCode: undefined,
    verifyCode: mockVerifyCode,
  };

const uiContentMock: Partial<ISignInContent> = {
  phoneVerificationErrorText: 'phone-verification-error-text-mock',
  phoneVerificationResentText: 'phone-verification-resent-text-mock',
  enterCodeSent: 'enter-code-sent-mock',
  enterCode: 'enter-code-mock',
  resendCodeQuestionText: 'resend-code-question-text-mock',
  resendLabel: 'resend-label-mock',
};

beforeEach(() => {
  mockOnTextInputChangeHandler.mockClear();
  mockResendCode.mockClear();
  mockVerifyCode.mockClear();
  useContentMock.mockClear();
  useContentMock.mockReturnValue({
    content: uiContentMock,
    isContentLoading: false,
  });
});

describe('PhoneNumberVerificationContainer', () => {
  it('BodyContentContainer should renders correctly with props', () => {
    const container = renderer.create(
      <PhoneNumberVerificationContainer
        {...phoneNumberVerificationContainerProps}
      />
    );
    const baseTexts = container.root.findAllByType(BaseText);
    expect(baseTexts.length).toEqual(3);
    expect(baseTexts[0].props.children).toEqual(uiContentMock.enterCodeSent);
    expect(baseTexts[1].props.children[0]).toEqual(
      uiContentMock.resendCodeQuestionText
    );
    const linkButton = baseTexts[1].props.children[1];
    expect(linkButton.type).toEqual(LinkButton);
    expect(linkButton.props.viewStyle).toEqual(
      phoneNumberVerificationContainerStyles.buttonResendCodeViewStyle
    );
    expect(linkButton.props.onPress).toEqual(mockResendCode);
    expect(linkButton.props.isSkeleton).toEqual(false);

    const primaryTextInput = container.root.findByType(PrimaryTextInput);
    expect(primaryTextInput.props.value).toEqual(undefined);
    expect(primaryTextInput.props.maxLength).toEqual(6);
    expect(primaryTextInput.props.keyboardType).toEqual('phone-pad');
    expect(primaryTextInput.props.viewStyle).toEqual(
      phoneNumberVerificationContainerStyles.verificationInputTextStyle
    );
    expect(primaryTextInput.props.placeholder).toEqual(uiContentMock.enterCode);
    expect(primaryTextInput.props.errorMessage).toEqual(undefined);
    expect(primaryTextInput.props.autoFocus).toEqual(true);
    expect(primaryTextInput.props.isSkeleton).toEqual(false);
    expect(primaryTextInput.props.testID).toEqual(
      'phoneNumberVerificationCodeInput'
    );
  });

  it('should call when click on Resend Code text', () => {
    const container = renderer.create(
      <PhoneNumberVerificationContainer
        {...phoneNumberVerificationContainerProps}
      />
    );
    const baseTexts = container.root.findAllByType(BaseText);
    const linkButton = baseTexts[1].props.children[1];
    expect(linkButton.type).toEqual(LinkButton);
    expect(linkButton.props.viewStyle).toEqual(
      phoneNumberVerificationContainerStyles.buttonResendCodeViewStyle
    );
    expect(linkButton.props.onPress).toEqual(mockResendCode);
    linkButton.props.onPress();
    expect(mockResendCode).toHaveBeenCalled();
  });

  it('BodyContentContainer should renders correctly with props when error code', () => {
    const phoneNumberVerificationContainerProps2: IPhoneNumberVerificationContainerProps =
      {
        isIncorrectCode: true,
        isOneTimePasswordSent: false,
        isScreenFocused: true,
        onTextInputChangeHandler: mockOnTextInputChangeHandler,
        resendCode: mockResendCode,
        resetVerification: mockResetPhoneNumberVerification,
        verificationCode: undefined,
        verifyCode: mockVerifyCode,
      };
    const container = renderer.create(
      <PhoneNumberVerificationContainer
        {...phoneNumberVerificationContainerProps2}
      />
    );
    const baseTexts = container.root.findAllByType(BaseText);
    expect(baseTexts.length).toEqual(3);
    expect(baseTexts[0].props.children).toEqual(uiContentMock.enterCodeSent);
    expect(baseTexts[0].props.isSkeleton).toEqual(false);
    expect(baseTexts[1].props.children[0]).toEqual(
      uiContentMock.resendCodeQuestionText
    );
    expect(baseTexts[1].props.isSkeleton).toEqual(false);
    const linkButton = baseTexts[1].props.children[1];
    expect(linkButton.type).toEqual(LinkButton);
    expect(linkButton.props.viewStyle).toEqual(
      phoneNumberVerificationContainerStyles.buttonResendCodeViewStyle
    );
    expect(linkButton.props.onPress).toEqual(mockResendCode);

    const primaryTextInput = container.root.findByType(PrimaryTextInput);
    expect(primaryTextInput.props.value).toEqual(undefined);
    expect(primaryTextInput.props.maxLength).toEqual(6);
    expect(primaryTextInput.props.keyboardType).toEqual('phone-pad');
    expect(primaryTextInput.props.viewStyle).toEqual(
      phoneNumberVerificationContainerStyles.verificationInputTextStyle
    );
    expect(primaryTextInput.props.placeholder).toEqual(uiContentMock.enterCode);
    expect(primaryTextInput.props.errorMessage).toEqual(
      uiContentMock.phoneVerificationErrorText
    );
    expect(primaryTextInput.props.autoFocus).toEqual(true);
    expect(primaryTextInput.props.testID).toEqual(
      'phoneNumberVerificationCodeInput'
    );
  });

  it('should call onTextInputChangeHandler on text change if input text is numeric digit between 0-9', () => {
    const testRenderer = renderer.create(
      <PhoneNumberVerificationContainer
        {...phoneNumberVerificationContainerProps}
      />
    );

    const input = testRenderer.root.findByType(PrimaryTextInput);
    input.props.onChangeText('123456');

    expect(
      phoneNumberVerificationContainerProps.onTextInputChangeHandler
    ).toHaveBeenCalledWith('123456');
  });

  it('BodyContentContainer should renders correctly with props when isOneTimePasswordSent is true', () => {
    const phoneNumberVerificationContainerProps3: IPhoneNumberVerificationContainerProps =
      {
        isIncorrectCode: false,
        isOneTimePasswordSent: true,
        isScreenFocused: true,
        onTextInputChangeHandler: mockOnTextInputChangeHandler,
        resendCode: mockResendCode,
        resetVerification: mockResetPhoneNumberVerification,
        verificationCode: undefined,
        verifyCode: mockVerifyCode,
      };
    const container = renderer.create(
      <PhoneNumberVerificationContainer
        {...phoneNumberVerificationContainerProps3}
      />
    );
    const baseTexts = container.root.findAllByType(BaseText);
    expect(baseTexts.length).toEqual(4);
    expect(baseTexts[1].props.style).toEqual(
      phoneNumberVerificationContainerStyles.oneTimeCodeVerificationViewStyle
    );
    expect(baseTexts[1].props.children).toEqual(
      uiContentMock.phoneVerificationResentText
    );
    const linkButton = baseTexts[2].props.children[1];
    expect(linkButton.type).toEqual(LinkButton);
    expect(linkButton.props.viewStyle).toEqual(
      phoneNumberVerificationContainerStyles.buttonResendCodeViewStyle
    );
    expect(linkButton.props.onPress).toEqual(mockResendCode);
  });

  it('should call resetVerification on unmount', () => {
    renderer.create(
      <PhoneNumberVerificationContainer
        {...phoneNumberVerificationContainerProps}
      />
    );

    setTimeout(() => {
      expect(mockResetPhoneNumberVerification).toHaveBeenCalledTimes(1);
    });
  });

  it('should call verifyCode on key press if verification code is correct length', () => {
    const testRenderer = renderer.create(
      <PhoneNumberVerificationContainer
        {...{
          ...phoneNumberVerificationContainerProps,
          verificationCode: '123456',
        }}
      />
    );

    const input = testRenderer.root.findByType(PrimaryTextInput);

    const mockNativeEvent: Partial<
      NativeSyntheticEvent<TextInputKeyPressEventData>
    > = { nativeEvent: { key: 'Enter' } };

    const onKeyPress = input.props.onKeyPress;
    onKeyPress(mockNativeEvent);

    expect(mockVerifyCode).toHaveBeenCalledTimes(1);
  });

  it('should not call verifyCode on key press if verification code is incorrect length', () => {
    const testRenderer = renderer.create(
      <PhoneNumberVerificationContainer
        {...{
          ...phoneNumberVerificationContainerProps,
          verificationCode: '123',
        }}
      />
    );

    const input = testRenderer.root.findByType(PrimaryTextInput);

    const mockNativeEvent: Partial<
      NativeSyntheticEvent<TextInputKeyPressEventData>
    > = { nativeEvent: { key: 'Enter' } };

    const onKeyPress = input.props.onKeyPress;
    onKeyPress(mockNativeEvent);

    expect(mockVerifyCode).not.toHaveBeenCalled();
  });

  it('should not call verifyCode on key press if user did not click enter', () => {
    const testRenderer = renderer.create(
      <PhoneNumberVerificationContainer
        {...{
          ...phoneNumberVerificationContainerProps,
          verificationCode: '123456',
        }}
      />
    );

    const input = testRenderer.root.findByType(PrimaryTextInput);

    const mockNativeEvent: Partial<
      NativeSyntheticEvent<TextInputKeyPressEventData>
    > = { nativeEvent: { key: '' } };

    const onKeyPress = input.props.onKeyPress;
    onKeyPress(mockNativeEvent);

    expect(mockVerifyCode).not.toHaveBeenCalled();
  });

  it('should call useContent with correct parameters', () => {
    renderer.create(
      <PhoneNumberVerificationContainer
        {...phoneNumberVerificationContainerProps}
      />
    );

    expect(useContentMock).toHaveBeenCalledWith(CmsGroupKey.signIn, 2);
  });
});

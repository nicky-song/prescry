// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement, useEffect } from 'react';
import {
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ISignInContent } from '../../../models/cms-content/sign-in.ui-content';
import { LinkButton } from '../../buttons/link/link.button';
import { PrimaryTextInput } from '../../inputs/primary-text/primary-text.input';
import { BaseText } from '../../text/base-text/base-text';
import { phoneNumberVerificationContainerStyles } from './phone-number-verification-container.styles';

export interface IPhoneNumberVerificationContainerProps {
  onTextInputChangeHandler: (inputValue: string) => void;
  resendCode: () => void;
  resetVerification: () => void;
  verifyCode: () => void;
  isIncorrectCode: boolean;
  isOneTimePasswordSent: boolean;
  verificationCode?: string;
  isScreenFocused?: boolean;
}

export const PhoneNumberVerificationContainer = ({
  onTextInputChangeHandler,
  resendCode,
  resetVerification,
  verifyCode,
  isIncorrectCode,
  isOneTimePasswordSent,
  verificationCode,
  isScreenFocused,
}: IPhoneNumberVerificationContainerProps): ReactElement => {
  useEffect(() => {
    return () => {
      resetVerification();
    };
  }, []);

  const verificationCodeLength = 6;

  const onChangeHandler = (textInputValue: string) => {
    const validTextInput = textInputValue.replace(/[^0-9]/g, '');
    if (validTextInput.length <= verificationCodeLength) {
      onTextInputChangeHandler(validTextInput);
    }
  };

  const isCodeValid = (code?: string) => {
    return code?.length === verificationCodeLength;
  };

  const onKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (event.nativeEvent.key === 'Enter' && isCodeValid(verificationCode)) {
      verifyCode();
    }
  };

  const { content, isContentLoading } = useContent<ISignInContent>(
    CmsGroupKey.signIn,
    2
  );

  const phoneNumberVerificationStatusText = isIncorrectCode
    ? content.phoneVerificationErrorText
    : undefined;

  const oneTimeCodeVerification = isOneTimePasswordSent ? (
    <BaseText
      style={
        phoneNumberVerificationContainerStyles.oneTimeCodeVerificationViewStyle
      }
      isSkeleton={isContentLoading}
    >
      {content.phoneVerificationResentText}
    </BaseText>
  ) : undefined;

  return (
    <View
      style={
        phoneNumberVerificationContainerStyles.bodyContentContainerViewStyle
      }
    >
      <BaseText isSkeleton={isContentLoading}>{content.enterCodeSent}</BaseText>
      <PrimaryTextInput
        value={verificationCode}
        maxLength={verificationCodeLength}
        keyboardType='phone-pad'
        onChangeText={onChangeHandler}
        viewStyle={
          phoneNumberVerificationContainerStyles.verificationInputTextStyle
        }
        onKeyPress={onKeyPress}
        placeholder={content.enterCode}
        errorMessage={phoneNumberVerificationStatusText}
        autoFocus={isScreenFocused}
        isSkeleton={isContentLoading}
        testID='phoneNumberVerificationCodeInput'
      />
      {oneTimeCodeVerification}
      <BaseText isSkeleton={isContentLoading}>
        {content.resendCodeQuestionText}
        <LinkButton
          viewStyle={
            phoneNumberVerificationContainerStyles.buttonResendCodeViewStyle
          }
          linkText={content.resendLabel}
          onPress={resendCode}
          isSkeleton={isContentLoading}
        />
      </BaseText>
    </View>
  );
};

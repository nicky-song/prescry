// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import { verifyIdentityVerificationCodeStyles } from './verify-identity-verification-code.screen.styles';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { IResetPinRequestBody } from '../../../../../models/api-request-body/reset-pin.request-body';
import { VerificationTypes } from '../../../../../models/api-request-body/send-verification-code.request-body';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { InlineLink } from '../../../../../components/member/links/inline/inline.link';
import { Heading } from '../../../../../components/member/heading/heading';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { PrimaryTextInput } from '../../../../../components/inputs/primary-text/primary-text.input';
import { IVerificationCodeAsyncActionArgs } from '../../../store/identity-verification/async-actions/send-verification-code.async-action';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { resendVerificationCodeDataLoadingAsyncAction } from '../../../store/identity-verification/async-actions/resend-verification-code-data-loading.async-action';
import { resetPinVerificationCodeDataLoadingAsyncAction } from '../../../store/identity-verification/actions/reset-pin-verification-code-data-loading-async-action';
import { IResetPinVerificationCodeAsyncActionArgs } from '../../../store/identity-verification/actions/reset-pin-verification-code.async-action';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { ISignInContent } from '../../../../../models/cms-content/sign-in.ui-content';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';

export interface IVerifyIdentityVerificationCodeScreenDataProps {
  verificationType: VerificationTypes;
  maskedValue: string;
  errorMessage?: string;
  isVerificationCodeSent?: boolean;
}

export type IVerifyIdentityVerificationCodeScreenProps =
  IVerifyIdentityVerificationCodeScreenDataProps;

export const VerifyIdentityVerificationCodeScreen = (
  props: IVerifyIdentityVerificationCodeScreenProps
) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const [verificationCode, setVerificationCode] = useState('');
  const [errorMessage, setErrorMessage] =
    useState<string | undefined>(undefined);

  const { content, isContentLoading } = useContent<ISignInContent>(
    CmsGroupKey.signIn,
    2
  );

  const {
    bodyContainerViewStyle,
    buttonViewStyle,
    headingTextStyle,
    oneTimeCodeViewStyle,
    bodyViewStyle,
    resendCodeViewStyle,
    errorMessageTextStyle,
    resendCodeConfirmationTextStyle,
  } = verifyIdentityVerificationCodeStyles;

  const verificationCodeLength = 6;

  const disableVerifyButton =
    verificationCode?.length !== verificationCodeLength;

  const onResendCodeButtonPress = async () => {
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.CLICKED_VERIFY_IDENTITY_RESEND_CODE_BUTTON,
      {}
    );
    setVerificationCode('');
    setErrorMessage(undefined);
    try {
      const args: IVerificationCodeAsyncActionArgs = {
        reduxDispatch,
        reduxGetState,
        navigation,
        verificationType: props.verificationType,
      };
      await resendVerificationCodeDataLoadingAsyncAction(args);
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  const onVerifyButtonPress = async () => {
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.CLICKED_VERIFY_IDENTITY_VERIFY_BUTTON,
      {}
    );

    const resetPinRequestBody: IResetPinRequestBody = {
      verificationType: props.verificationType,
      maskedValue: props.maskedValue,
      code: verificationCode,
    };
    setErrorMessage(undefined);
    try {
      const args: IResetPinVerificationCodeAsyncActionArgs = {
        reduxDispatch,
        reduxGetState,
        navigation,
        requestBody: resetPinRequestBody,
      };
      await resetPinVerificationCodeDataLoadingAsyncAction(args);
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  const errorContent = errorMessage ? (
    <BaseText
      style={errorMessageTextStyle}
      testID='verifyIdentityVerificationCodeErrorMessage'
    >
      {errorMessage}
    </BaseText>
  ) : null;

  const resendConfirmationContent = props.isVerificationCodeSent ? (
    <BaseText
      style={resendCodeConfirmationTextStyle}
      isSkeleton={isContentLoading}
    >
      {content.verificationCodeConfirmationText}
    </BaseText>
  ) : null;

  const topContent = (
    <View style={bodyViewStyle} testID='pinResetVerificationCode'>
      <Heading textStyle={headingTextStyle} isSkeleton={isContentLoading}>
        {content.enterCode}
      </Heading>
      <BaseText
        testID='pinResetVerificationCodeScreenHeader'
        isSkeleton={isContentLoading}
      >
        {content.verificationCodeInstructions} {props.maskedValue}
      </BaseText>
      {errorContent}
      {resendConfirmationContent}
      <PrimaryTextInput
        textContentType='oneTimeCode'
        keyboardType='phone-pad'
        maxLength={6}
        placeholder={content.otcPlaceholderText}
        onChangeText={setVerificationCode}
        value={verificationCode}
        viewStyle={oneTimeCodeViewStyle}
        testID='verifyIdentityVerificationCodeTextInput'
      />
      <BaseText
        testID='verificationcodeScreenResendCode'
        style={resendCodeViewStyle}
        isSkeleton={isContentLoading}
      >
        {content.resendCodeQuestionText}{' '}
        <InlineLink onPress={onResendCodeButtonPress}>
          {content.resendCodeText}
        </InlineLink>
      </BaseText>
    </View>
  );

  const bottomContent = (
    <BaseButton
      disabled={disableVerifyButton}
      onPress={onVerifyButtonPress}
      viewStyle={buttonViewStyle}
      isSkeleton={isContentLoading}
      testID='verifyIdentityVerificationCodeVerifyButton'
    >
      {content.verifyButtonLabel}
    </BaseButton>
  );

  const body = (
    <BodyContentContainer viewStyle={bodyContainerViewStyle}>
      {topContent}
      {bottomContent}
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      body={body}
      hideNavigationMenuButton={true}
      bodyViewStyle={{}}
      allowBodyGrow={true}
      navigateBack={navigation.goBack}
      translateContent={true}
    />
  );
};

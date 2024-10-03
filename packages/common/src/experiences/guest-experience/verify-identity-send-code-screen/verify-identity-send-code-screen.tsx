// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { MarkdownText } from '../../../components/text/markdown-text/markdown-text';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { verifyIdentitySendCodeScreenStyle } from './verify-identity-send-code-screen.style';
import { RadioButtonToggle } from '../../../components/member/radio-button-toggle/radio-button-toggle';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../guest-experience-logger.middleware';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../navigation/stack-navigators/root/root.stack-navigator';
import { sendVerificationCodeDataLoadingAsyncAction } from '../store/identity-verification/async-actions/send-verification-code-data-loading.async-action';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { IVerificationCodeAsyncActionArgs } from '../store/identity-verification/async-actions/send-verification-code.async-action';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { ISignInContent } from '../../../models/cms-content/sign-in.ui-content';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';

export interface IVerifyIdentitySendCodeScreenDataProps {
  maskedPhoneNumber?: string;
  maskedEmailAddress?: string;
}

export type IVerifyIdentitySendCodeScreenProps =
  IVerifyIdentitySendCodeScreenDataProps;

export const VerifyIdentitySendCodeScreen = (
  props: IVerifyIdentitySendCodeScreenProps
) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();
  const { maskedPhoneNumber, maskedEmailAddress } = props;

  const [selectedVerificationMethod, setSelectedVerificationMethod] =
    useState<number | undefined>(undefined);
  const [enableContinue, setEnableContinue] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | undefined>(undefined);

  const { content, isContentLoading } = useContent<ISignInContent>(
    CmsGroupKey.signIn,
    2
  );

  const verificationType = (selectedMethod?: number) => {
    switch (selectedMethod) {
      case 0:
        return 'PHONE';
      case 1:
        return 'EMAIL';
    }
    return;
  };

  const onContinueButtonPress = async () => {
    const mappedType = verificationType(selectedVerificationMethod);
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.CLICKED_CONTINUE_VERIFY_IDENTITY_SEND_CODE_SCREEN,
      {
        verificationType: mappedType,
      }
    );
    if (mappedType) {
      setErrorMessage(undefined);
      const args: IVerificationCodeAsyncActionArgs = {
        reduxDispatch,
        reduxGetState,
        navigation,
        verificationType: mappedType,
      };
      try {
        await sendVerificationCodeDataLoadingAsyncAction(args);
      } catch (error) {
        setErrorMessage((error as Error).message);
      }
    }
  };

  const renderHeader = () => {
    const testId = 'verifyIdentitySendCodeScreenHeader';
    return (
      <View
        style={verifyIdentitySendCodeScreenStyle.headerViewStyle}
        testID={testId}
      >
        <Text style={verifyIdentitySendCodeScreenStyle.headerTextStyle}>
          {content.verifyIdentitySendCodeHeader}
        </Text>
        <MarkdownText isSkeleton={isContentLoading}>
          {content.verifyIdentitySendCodeInstructions}
        </MarkdownText>
      </View>
    );
  };

  const onToggleVerificationMethod = (selection: number) => {
    setSelectedVerificationMethod(selection);
    setEnableContinue(true);
    setErrorMessage(undefined);
  };

  const renderVerificationMethodToggle = () => {
    return (
      <RadioButtonToggle
        viewStyle={verifyIdentitySendCodeScreenStyle.toggleContainerViewStyle}
        checkBoxContainerViewStyle={
          verifyIdentitySendCodeScreenStyle.toggleViewStyle
        }
        onOptionSelected={onToggleVerificationMethod}
        optionAText={maskedPhoneNumber}
        optionBText={maskedEmailAddress}
        buttonViewStyle={verifyIdentitySendCodeScreenStyle.buttonViewStyle}
      />
    );
  };

  const renderError = () => {
    if (errorMessage) {
      return (
        <View
          style={verifyIdentitySendCodeScreenStyle.errorContainerViewStyle}
          testID='verifyIdentityScreenSendCodeError'
        >
          <MarkdownText textStyle={verifyIdentitySendCodeScreenStyle.errorText}>
            {errorMessage}
          </MarkdownText>
        </View>
      );
    }
    return null;
  };

  const body = (
    <View style={verifyIdentitySendCodeScreenStyle.containerViewStyle}>
      <View style={verifyIdentitySendCodeScreenStyle.contentContainerViewStyle}>
        {renderHeader()}
        <View
          style={verifyIdentitySendCodeScreenStyle.bodyContainer}
          testID='verifyIdentitySendCodeScreen'
        >
          {renderError()}
          {renderVerificationMethodToggle()}
        </View>
      </View>
      <BaseButton
        disabled={!enableContinue}
        onPress={onContinueButtonPress}
        isSkeleton={isContentLoading}
        testID='verifyIdentitySendCodeScreenBaseButtonContinue'
      >
        {content.continueButtonCaption}
      </BaseButton>
    </View>
  );

  const basicPageProps = {
    body,
    showProfileAvatar: false,
    hideApplicationHeader: false,
    hideNavigationMenuButton: true,
  };

  return (
    <BasicPageConnected
      {...basicPageProps}
      headerViewStyle={verifyIdentitySendCodeScreenStyle.basicPageHeaderView}
      bodyViewStyle={verifyIdentitySendCodeScreenStyle.basicPageBodyView}
      navigateBack={navigation.goBack}
      translateContent={true}
    />
  );
};

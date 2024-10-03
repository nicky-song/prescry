// Copyright 2021 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { PinScreenContainer } from '../../../components/member/pin-screen-container/pin-screen-container';
import { PrimaryTextBox } from '../../../components/text/primary-text-box/primary-text-box';
import { loginPinScreenStyles } from './login-pin-screen.style';
import { LinkButton } from '../../../components/buttons/link/link.button';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import {
  LoginPinNavigationProp,
  LoginPinRouteProp,
} from '../navigation/stack-navigators/root/root.stack-navigator';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  IVerifyPinAsyncActionArgs,
  navigateToResetPinAction,
} from '../store/secure-pin/secure-pin-reducer.actions';
import { Workflow } from '../../../models/workflow';
import { ICreatePinScreenRouteProps } from '../create-pin-screen/create-pin-screen';
import { ISignInContent } from '../../../models/cms-content/sign-in.ui-content';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { PinScreenConstants } from '../../../theming/constants';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';
import { updateURLWithFeatureFlagsAndLanguage } from '../store/navigation/update-url-with-feature-flags-and-language';

export interface ILoginPinScreenProps {
  leftAttempts?: number;
  hasPinMismatched?: boolean;
  recoveryEmailExists?: boolean;
}

export interface ILoginPinScreenRouteProps {
  isUpdatePin?: boolean;
  workflow?: Workflow;
  isSignOut?: boolean;
}

export interface ILoginPinScreenActionProps {
  verifyPin: (args: IVerifyPinAsyncActionArgs) => void;
  clearAccountToken: () => void;
}

export const LoginPinScreen = (
  props: ILoginPinScreenProps & ILoginPinScreenActionProps
): React.ReactElement => {
  const navigation = useNavigation<LoginPinNavigationProp>();

  const { params } = useRoute<LoginPinRouteProp>();
  const { workflow, isSignOut, isUpdatePin = false } = params;

  const [pin, setPin] = useState('');

  const groupKey = CmsGroupKey.signIn;
  const { content, isContentLoading } = useContent<ISignInContent>(groupKey, 2);

  useEffect(() => {
    if (isSignOut) {
      updateURLWithFeatureFlagsAndLanguage();
      props.clearAccountToken();
    }
  }, [isSignOut]);

  const onLoginClick = async () => {
    const pinScreenParams: ICreatePinScreenRouteProps = {
      isUpdatePin,
      workflow,
    };
    setPin('');
    await props.verifyPin({ pin, navigation, pinScreenParams });
  };

  const getAnyErrorText = () => {
    const isAccountLocked = props.hasPinMismatched && props.leftAttempts === 0;
    const canAttemptAgain = props.leftAttempts && props.hasPinMismatched;
    const isMismatched = props.hasPinMismatched;

    if (isAccountLocked) {
      return content.accountLockedWarningText;
    }
    if (canAttemptAgain) {
      const attemptText =
        props.leftAttempts === 1
          ? content.maxPinVerifyError2
          : content.maxPinVerifyError3;

      return `${content.maxPinVerifyError1} ${props.leftAttempts} ${attemptText} ${content.maxPinVerifyError4}`;
    }
    if (isMismatched) {
      return content.maxPinVerifyError1;
    }
    return;
  };

  const getFooter = (updatePin: boolean): React.ReactNode => {
    const isPinValid = pin && pin.length === PinScreenConstants.pinLength;
    const disableButton = isPinValid ? false : true;
    const buttonText = updatePin
      ? content.nextButtonLabel
      : content.loginButtonText;

    if (props.leftAttempts === 0) {
      return;
    }

    return (
      <BaseButton
        disabled={disableButton}
        viewStyle={loginPinScreenStyles.buttonViewStyle}
        onPress={onLoginClick}
        testID='loginPinScreenLoginButton'
        isSkeleton={isContentLoading}
      >
        {buttonText}
      </BaseButton>
    );
  };

  const navigateBack = isUpdatePin ? navigation.goBack : undefined;

  const headerText = isUpdatePin
    ? content.updatePinHeader
    : content.loginPinScreenHeader;

  const onForgotPinLinkPress = () => navigateToResetPinAction(navigation);

  const renderForgotPinLink =
    props.recoveryEmailExists && !isUpdatePin ? (
      <LinkButton
        linkText={content.forgotPin}
        onPress={onForgotPinLinkPress}
        testID='forgotPinText'
        viewStyle={loginPinScreenStyles.forgotPinViewStyle}
        isSkeleton={isContentLoading}
      />
    ) : undefined;

  const body = (
    <View style={loginPinScreenStyles.bodyViewStyle} testID='pinLogin'>
      <PrimaryTextBox
        caption={headerText}
        textBoxStyle={loginPinScreenStyles.pinLabelTextStyle}
      />
      <PinScreenContainer
        errorMessage={getAnyErrorText()}
        enteredPin={pin}
        onPinChange={setPin}
        testID='loginPinScreenContainer'
      />
      {renderForgotPinLink}
      {getFooter(isUpdatePin)}
    </View>
  );
  return (
    <BasicPageConnected
      headerViewStyle={loginPinScreenStyles.headerView}
      navigateBack={navigateBack}
      bodyViewStyle={loginPinScreenStyles.bodyContainerViewStyle}
      body={body}
      translateContent={true}
    />
  );
};

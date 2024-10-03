// Copyright 2018 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { Heading } from '../../../components/member/heading/heading';
import { PhoneNumberVerificationContainer } from '../../../components/member/phone-number-verification/phone-number-verification-container';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { ISignInContent } from '../../../models/cms-content/sign-in.ui-content';
import { ICreateAccount } from '../../../models/create-account';
import { Workflow } from '../../../models/workflow';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import {
  PhoneNumberVerificationNavigationProp,
  PhoneNumberVerificationRouteProp,
} from '../navigation/stack-navigators/root/root.stack-navigator';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';
import { ICreateAccountAsyncActionArgs } from '../store/phone-number-verification/async-actions/create-account.async-action';
import {
  ISendOneTimePasswordAsyncActionArgs,
  IVerificationCodeActionParams,
} from '../store/phone-number-verification/phone-number-verification-reducer.actions';
import { phoneNumberVerificationScreenStyle } from './phone-number-verification-screen.styles';

export interface IPhoneNumberVerificationScreenDataProps {
  isIncorrectCode: boolean;
  isOneTimePasswordSent: boolean;
}

export interface IPhoneNumberVerificationScreenRouteProps {
  account?: ICreateAccount;
  phoneNumber: string;
  workflow?: Workflow;
  isBlockchain?: boolean;
}

export interface IPhoneNumberVerificationScreenActionProps {
  resendCode: (args: ISendOneTimePasswordAsyncActionArgs) => void;
  resetVerification: () => void;
  verifyCode: (verificationCodeAction: IVerificationCodeActionParams) => void;
  createAccount: (args: ICreateAccountAsyncActionArgs) => void;
}

const lengthOfOneTimePasswordVerificationCode = 6;

export type IPhoneNumberVerificationScreenProps =
  IPhoneNumberVerificationScreenActionProps &
    IPhoneNumberVerificationScreenDataProps;

export const PhoneNumberVerificationScreen = ({
  isIncorrectCode,
  isOneTimePasswordSent,
  resendCode,
  resetVerification,
  verifyCode,
  createAccount,
}: IPhoneNumberVerificationScreenProps) => {
  const [verificationCode, setUserVerificationCode] = useState<string>('');

  const { params } = useRoute<PhoneNumberVerificationRouteProp>();
  const { phoneNumber, account, workflow } = params;

  const navigation = useNavigation<PhoneNumberVerificationNavigationProp>();

  const { content, isContentLoading } = useContent<ISignInContent>(
    CmsGroupKey.signIn,
    2
  );

  const setVerificationCodeHandler = (code: string) => {
    setUserVerificationCode(code);
  };

  const resendCodeHandler = () => {
    setUserVerificationCode('');
    resendCode({
      phoneNumber,
      navigation,
    });
  };

  const verifyCodeHandler = () => {
    if (
      account &&
      account.firstName.length > 0 &&
      account.dateOfBirth.length > 0 &&
      workflow
    ) {
      createAccount({
        account,
        code: verificationCode,
        workflow,
        navigation,
      });
    } else {
      verifyCode({
        phoneNumber,
        verificationCode,
        workflow,
        navigation,
        prescriptionId: account?.prescriptionId,
      });
    }
  };

  const isVerifyButtonDisabled =
    verificationCode.length !== lengthOfOneTimePasswordVerificationCode;

  const renderVerificationContainer = (
    <View>
      <Heading textStyle={phoneNumberVerificationScreenStyle.headingTextStyle}>
        {content.phoneVerificationHeaderText}
      </Heading>
      <PhoneNumberVerificationContainer
        onTextInputChangeHandler={setVerificationCodeHandler}
        verificationCode={verificationCode}
        verifyCode={verifyCodeHandler}
        resendCode={resendCodeHandler}
        isScreenFocused={navigation.isFocused()}
        isIncorrectCode={isIncorrectCode}
        isOneTimePasswordSent={isOneTimePasswordSent}
        resetVerification={resetVerification}
      />
    </View>
  );
  const body = (
    <BodyContentContainer
      viewStyle={phoneNumberVerificationScreenStyle.bodyViewStyle}
      isSkeleton={isContentLoading}
    >
      {renderVerificationContainer}
      <BaseButton
        disabled={isVerifyButtonDisabled}
        onPress={verifyCodeHandler}
        testID='phoneNumberVerificationVerifyButton'
        isSkeleton={isContentLoading}
      >
        {content.verifyButtonLabel}
      </BaseButton>
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      allowBodyGrow={true}
      navigateBack={navigation.goBack}
      headerViewStyle={phoneNumberVerificationScreenStyle.headerView}
      body={body}
      translateContent={true}
    />
  );
};

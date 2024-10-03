// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { Heading } from '../../../../../components/member/heading/heading';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { ICreateAccount } from '../../../../../models/create-account';
import { Workflow } from '../../../../../models/workflow';
import { isEmailValid } from '../../../../../utils/email.helper';
import DateValidator from '../../../../../utils/validators/date.validator';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import {
  ISendOneTimeVerificationCodeAsyncActionArgs,
  sendOneTimeVerificationCodeAsyncAction,
} from '../../../state/drug-search/async-actions/send-one-time-verification-code.async-action';
import { CreateAccountBody } from './create-account.body';
import { createAccountScreenStyles } from './create-account.screen.styles';
import { ILoginRequestBody } from '../../../../../models/api-request-body/login.request-body';
import {
  createAccountDeviceTokenAsyncAction,
  ICreateAccountDeviceTokenAsyncActionArgs,
} from '../../../store/create-account/async-actions/create-account-with-device-token.async-action';
import { phoneNumberLoginNavigateDispatch } from '../../../store/navigation/dispatch/sign-in/phone-number-login-navigate.dispatch';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { InlineLink } from '../../../../../components/member/links/inline/inline.link';
import {
  createMemberAccountAsyncAction,
  ICreateMemberAccountAsyncActionArgs,
} from '../../../store/create-account/async-actions/create-member-account.async-action';
import { cleanPhoneNumber } from '../../../../../utils/formatters/phone-number.formatter';
import { LengthOfPhoneNumber } from '../../../../../theming/constants';
import { MarkdownText } from '../../../../../components/text/markdown-text/markdown-text';

import {
  differenceInYear,
  UTCDate,
} from '../../../../../utils/date-time-helper';
import { getNewDate } from '../../../../../utils/date-time/get-new-date';
import { SmsNotSupportedError } from '../../../../../errors/sms-not-supported.error';
import dateFormatter from '../../../../../utils/formatters/date.formatter';
import {
  verifyPrescriptionAsyncAction,
  IVerifyPrescriptionAsyncActionArgs,
} from '../../../store/create-account/async-actions/verify-prescription.async-action';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  CreateAccountRouteProp,
  RootStackNavigationProp,
} from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { callPhoneNumber } from '../../../../../utils/link.helper';
import { ErrorUserDataMismatch } from '../../../../../errors/error-data-mismatch-create-account';
import { navigationBackEnabled } from '../../../../../utils/navigation-back-enabled.helper';
import { ErrorActivationRecordMismatch } from '../../../../../errors/error-activation-record-mismatch';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { ICommunicationContent } from '../../../../../models/cms-content/communication.content';
import { ISignUpContent } from '../../../../../models/cms-content/sign-up.ui-content';
import { useAccountAndFamilyContext } from '../../../context-providers/account-and-family/use-account-and-family-context.hook';
import { StringFormatter } from '../../../../../utils/formatters/string.formatter';

export type CreateAccountErrorType =
  | 'noAccountWithUs'
  | 'userDataMismatch'
  | 'ssoError';

export interface ICreateAccountScreenRouteProps {
  workflow: Workflow;
  phoneNumber?: string;
  errorType?: CreateAccountErrorType;
  prescriptionId?: string;
  blockchain?: boolean;
  isDependent?: boolean;
}

export const CreateAccountScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { params } = useRoute<CreateAccountRouteProp>();
  const {
    workflow,
    phoneNumber: initialPhoneNumber = '',
    errorType,
    prescriptionId,
    blockchain,
    isDependent,
  } = params;

  const noAccountExistFlow = !!initialPhoneNumber;
  const isNoAccountFlow: boolean =
    noAccountExistFlow && errorType === 'noAccountWithUs';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [pbmMemberId, setPbmMemberId] = useState('');
  const [acceptedTermsAndConditions, setAcceptedTermsAndConditions] =
    useState(isNoAccountFlow);
  const [accountError, setAccountError] = useState('');
  const [showMemberAgeNotMetError, setShowMemberAgeNotMetError] =
    useState(false);
  const [acceptedAttestAuthorization, setAcceptedAttestAuthorization] =
    useState(false);

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const groupKey = CmsGroupKey.signUp;
  const { content: signUpContent, isContentLoading: isSignUpContentLoading } =
    useContent<ISignUpContent>(groupKey, 2);

  const communicationGroupKey = CmsGroupKey.communication;
  const {
    content: communicationContent,
    isContentLoading: isCommunicationContentLoading,
  } = useContent<ICommunicationContent>(
    communicationGroupKey,
    2,
    undefined,
    true
  );

  const memberSupportLink = '#memberSupport';

  const { config: configState } = reduxGetState();

  const {
    accountAndFamilyState: { prescriptionPersonSelection },
  } = useAccountAndFamilyContext();

  const scrollViewRef = useRef<ScrollView>(null);
  const headingRef = useRef<View>(null);
  const hidePhoneNumber = workflow === 'prescriptionInvite';

  useEffect(() => {
    const errorMessage = () => {
      if (!errorType) {
        return '';
      }

      switch (errorType.toString()) {
        case 'noAccountWithUs':
          return signUpContent.noAccountError;
        case 'userDataMismatch':
          return signUpContent.dataMismatchError;
        case 'ssoError':
          return signUpContent.ssoError;
      }

      const unknownError = StringFormatter.format(
        signUpContent.unknownErrorType,
        new Map([['errorType', errorType as string]])
      );

      return unknownError;
    };

    setAccountError(errorMessage());
  }, [errorType]);

  useEffect(() => {
    if (accountError && scrollViewRef?.current && headingRef?.current) {
      const scrollViewRefCurrent = scrollViewRef.current;

      headingRef.current.measure((_, y) => {
        scrollViewRefCurrent.scrollTo(y);
      });
    }
  }, [accountError]);

  const isSpecified = (s = ''): boolean => s.trim().length > 0;

  const isPhoneNumberValid = isSpecified(initialPhoneNumber)
    ? (initialPhoneNumber ?? '').length >= LengthOfPhoneNumber
    : isSpecified(phoneNumber) && phoneNumber.length >= LengthOfPhoneNumber;

  const isPbmMemberIdValid =
    workflow !== 'pbmActivate' || isSpecified(pbmMemberId);

  const childMemberAgeLimit = configState.childMemberAgeLimit;

  const isMemberAgeLimitMet = (dob: string) => {
    const age = differenceInYear(
      UTCDate(getNewDate()),
      UTCDate(dateFormatter.firefoxCompatibleDateFormat(dob))
    );

    return age >= childMemberAgeLimit;
  };

  const areFieldsValid =
    isSpecified(firstName) &&
    isSpecified(lastName) &&
    isSpecified(dateOfBirth) &&
    DateValidator.isDateOfBirthValid(dateOfBirth) &&
    !showMemberAgeNotMetError &&
    isEmailValid(emailAddress) &&
    isPbmMemberIdValid &&
    (hidePhoneNumber || isPhoneNumberValid) &&
    (noAccountExistFlow || acceptedTermsAndConditions) &&
    (!isDependent || acceptedAttestAuthorization);

  const onFirstNameChange = (name: string) => {
    if (name !== firstName) {
      setFirstName(name);
    }
  };

  const onLastNameChange = (name: string) => {
    if (name !== lastName) {
      setLastName(name);
    }
  };

  const onEmailAddressChange = (email: string) => {
    if (email !== emailAddress) {
      setEmailAddress(email);
    }
  };

  const onPhoneNumberChange = (phone: string) => {
    const validTextInput = cleanPhoneNumber(phone);
    if (
      validTextInput.length <= LengthOfPhoneNumber &&
      validTextInput !== phoneNumber
    ) {
      setPhoneNumber(validTextInput);
    }
  };

  const onDateOfBirthChange = (dob: string) => {
    if (dob !== dateOfBirth) {
      setDateOfBirth(dob);

      if (DateValidator.isDateOfBirthValid(dob)) {
        setShowMemberAgeNotMetError(!isMemberAgeLimitMet(dob));
      }
    }
  };

  const onMemberIdChange =
    workflow === 'pbmActivate'
      ? (memberId: string) => {
          setPbmMemberId(memberId);
        }
      : undefined;

  const onTermsAndConditionsToggle = (checked: boolean) => {
    if (checked !== acceptedTermsAndConditions) {
      setAcceptedTermsAndConditions(checked);
    }
  };

  const onAttestAuthorizationToggle = (checked: boolean) => {
    if (checked !== acceptedAttestAuthorization) {
      setAcceptedAttestAuthorization(checked);
    }
  };

  const sendCreateAccountDeviceTokenRequest = async () => {
    const account: ILoginRequestBody = {
      firstName,
      lastName,
      accountRecoveryEmail: emailAddress,
      dateOfBirth,
      primaryMemberRxId: pbmMemberId,
      prescriptionId,
      isBlockchain: blockchain,
    };
    const args: ICreateAccountDeviceTokenAsyncActionArgs = {
      account,
      workflow,
      reduxDispatch,
      reduxGetState,
      navigation,
    };

    try {
      await createAccountDeviceTokenAsyncAction(args);
    } catch (error) {
      setAccountError(getErrorMessage(error));
    }
  };

  const getErrorMessage = (error: unknown) => {
    return error instanceof SmsNotSupportedError
      ? signUpContent.smsNotSupported
      : error instanceof ErrorUserDataMismatch
      ? signUpContent.dataMismatchError
      : error instanceof ErrorActivationRecordMismatch
      ? signUpContent.activationPersonMismatchError
      : signUpContent.accountNotFoundError;
  };

  const sendCreateMemberAccountRequest = async () => {
    const args: ICreateMemberAccountAsyncActionArgs = {
      account: {
        dateOfBirth,
        email: emailAddress,
        firstName,
        lastName,
        phoneNumber,
        primaryMemberRxId: pbmMemberId,
        isTermAccepted: acceptedTermsAndConditions,
        prescriptionId,
        isBlockchain: blockchain,
      },
      reduxDispatch,
      reduxGetState,
      navigation,
    };

    try {
      await createMemberAccountAsyncAction(args);
    } catch (error) {
      setAccountError(getErrorMessage(error));
    }
  };

  const verifyPrescription = async () => {
    const args: IVerifyPrescriptionAsyncActionArgs = {
      account: {
        firstName,
        lastName,
        dateOfBirth,
        email: emailAddress,
        isTermAccepted: acceptedTermsAndConditions,
        prescriptionId,
      },
      workflow,
      navigation,
      reduxDispatch,
      reduxGetState,
      blockchain,
    };
    try {
      await verifyPrescriptionAsyncAction(args);
    } catch (error) {
      setAccountError(getErrorMessage(error));
    }
  };

  const sendOneTimeVerificationCodeRequest = async () => {
    const account: ICreateAccount = {
      phoneNumber,
      firstName,
      lastName,
      email: emailAddress,
      dateOfBirth,
      isTermAccepted: acceptedTermsAndConditions,
    };
    const args: ISendOneTimeVerificationCodeAsyncActionArgs = {
      account,
      workflow,
      reduxDispatch,
      reduxGetState,
      navigation,
    };

    try {
      await sendOneTimeVerificationCodeAsyncAction(args);
    } catch (error) {
      setAccountError(signUpContent.smsNotSupported);
    }
  };

  const onContinueButtonPress = async () => {
    if (isNoAccountFlow) {
      await sendCreateAccountDeviceTokenRequest();
    } else if (workflow === 'pbmActivate') {
      await sendCreateMemberAccountRequest();
    } else if (workflow === 'prescriptionInvite') {
      await verifyPrescription();
    } else {
      await sendOneTimeVerificationCodeRequest();
    }
  };

  const onSignInPress = () => {
    phoneNumberLoginNavigateDispatch(
      navigation,
      workflow,
      prescriptionId,
      blockchain
    );
  };

  const onBackButtonPress = () => {
    navigation.goBack();
  };

  const signInView = !isNoAccountFlow ? (
    <View style={createAccountScreenStyles.haveAccountViewStyle}>
      <BaseText
        style={createAccountScreenStyles.haveAccountTextStyle}
        isSkeleton={isSignUpContentLoading}
      >
        {signUpContent.haveAccountHelpText}{' '}
      </BaseText>
      <InlineLink
        onPress={onSignInPress}
        textStyle={createAccountScreenStyles.haveAccountTextStyle}
        testID='createAccountScreenSignInLink'
      >
        {signUpContent.signIn}
      </InlineLink>
    </View>
  ) : null;

  const onErrorLinkPress = (url: string): boolean => {
    if (communicationContent && !isCommunicationContentLoading) {
      const contactNumber =
        url === memberSupportLink || isPBMActivate
          ? communicationContent.supportPBMPhone
          : communicationContent.supportCashPhone;

      (async () => {
        await callPhoneNumber(contactNumber);
      })();

      return false;
    }
    return true;
  };

  const renderError = accountError ? (
    <MarkdownText
      textStyle={createAccountScreenStyles.errorTextStyle}
      color={createAccountScreenStyles.errorColorTextStyle.color}
      onLinkPress={onErrorLinkPress}
      isSkeleton={isSignUpContentLoading}
      testID='createAccountScreenAccountError'
    >
      {accountError}
    </MarkdownText>
  ) : null;

  const isPrescriptionDependent =
    workflow === 'prescriptionInvite' &&
    prescriptionPersonSelection === 'other';

  const isPBMActivate = workflow === 'pbmActivate' || workflow === 'register';

  const title = isPrescriptionDependent
    ? signUpContent.prescriptionPersonTitle
    : signUpContent.createAccountHeader;

  const instructions = isPrescriptionDependent
    ? signUpContent.prescriptionPersonInstructions
    : isPBMActivate
    ? signUpContent.pbmMemberInstructions
    : signUpContent.createAccountInstructions;

  const renderHeader = (
    <View testID='createAccountScreenHeader' ref={headingRef}>
      <Heading level={1} textStyle={createAccountScreenStyles.headingTextStyle}>
        {title}
      </Heading>
      <BaseText>{instructions}</BaseText>
      {renderError}
    </View>
  );

  const emailErrorMessage =
    isSpecified(emailAddress) && !isEmailValid(emailAddress)
      ? signUpContent.emailErrorMessage
      : undefined;
  const renderBody = (
    <BodyContentContainer testID='createAccountScreenBodyContentContainer'>
      {renderHeader}
      <CreateAccountBody
        onFirstNameChange={onFirstNameChange}
        onLastNameChange={onLastNameChange}
        onEmailAddressChange={onEmailAddressChange}
        onPhoneNumberChange={onPhoneNumberChange}
        onDateOfBirthChange={onDateOfBirthChange}
        onMemberIdChange={onMemberIdChange}
        onTermsAndConditionsToggle={onTermsAndConditionsToggle}
        onAttestAuthorizationToggle={onAttestAuthorizationToggle}
        noAccountExistFlow={isNoAccountFlow}
        initialPhoneNumber={initialPhoneNumber}
        emailErrorMessage={emailErrorMessage}
        showDateOfBirthError={showMemberAgeNotMetError}
        hidePhoneNumber={hidePhoneNumber}
        isDependent={isDependent}
      />
      <BaseButton
        disabled={!areFieldsValid}
        onPress={onContinueButtonPress}
        viewStyle={createAccountScreenStyles.continueButtonViewStyle}
        isSkeleton={isSignUpContentLoading}
        testID='createAccountScreenContinueButton'
      >
        {signUpContent.continueButton}
      </BaseButton>
      {signInView}
    </BodyContentContainer>
  );

  const isNavigationBackEnabled = navigationBackEnabled(workflow);

  return (
    <BasicPageConnected
      body={renderBody}
      bodyViewStyle={createAccountScreenStyles.bodyViewStyle}
      navigateBack={isNavigationBackEnabled ? onBackButtonPress : undefined}
      showProfileAvatar={false}
      hideApplicationHeader={false}
      hideNavigationMenuButton={true}
      ref={scrollViewRef}
      translateContent={true}
    />
  );
};

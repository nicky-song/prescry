// Copyright 2018 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  LoginBody,
  IMemberLoginFieldProps,
} from '../../../components/member/login-body/login-body';
import { IMemberLoginState } from '../store/member-login/member-login-reducer';
import { MarkdownText } from '../../../components/text/markdown-text/markdown-text';
import DateValidator from '../../../utils/validators/date.validator';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { isEmailValid } from '../../../utils/email.helper';
import { loginScreenStyles } from './login-screen.styles';
import { Heading } from '../../../components/member/heading/heading';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { differenceInYear, UTCDate } from '../../../utils/date-time-helper';
import dateFormatter from '../../../utils/formatters/date.formatter';
import { useNavigation } from '@react-navigation/native';
import {
  LoginNavigationProp,
  LoginRouteProp,
} from '../navigation/stack-navigators/root/root.stack-navigator';
import { useConfigContext } from '../context-providers/config/use-config-context.hook';
import { useMembershipContext } from '../context-providers/membership/use-membership-context.hook';
import { MemberNameFormatter } from '../../../utils/formatters/member-name-formatter';
import { memberAddOrLoginDataLoadingAsyncAction } from '../store/member-login/async-actions/member-add-or-login-data-loading.async.action';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { useRoute } from '@react-navigation/native';
import { callPhoneNumber } from '../../../utils/link.helper';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';
import { ISignInContent } from '../../../models/cms-content/sign-in.ui-content';
import { ICommunicationContent } from '../../../models/cms-content/communication.content';
import { ISignUpContent } from '../../../models/cms-content/sign-up.ui-content';

export interface ILoginScreenRouteProps {
  claimAlertId?: string;
  prescriptionId?: string;
  isBlockchain?: boolean;
}

export const LoginScreen = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const {
    params: { claimAlertId, prescriptionId, isBlockchain },
  } = useRoute<LoginRouteProp>();
  const isClaimAlertOrPrescriptionFlow = !!claimAlertId || !!prescriptionId;
  const { getState: reduxGetState, dispatch: reduxDispatch } =
    useReduxContext();
  const {
    settings: { token },
  } = reduxGetState();
  const isAddMembershipFlow = !!token;

  const { configState: config } = useConfigContext();
  const { childMemberAgeLimit } = config;

  const { membershipState: memberProfile } = useMembershipContext();
  const { account: loggedInUserInfo } = memberProfile;
  const memberProfileName = MemberNameFormatter.formatName(
    loggedInUserInfo.firstName,
    loggedInUserInfo.lastName
  );

  const [dateOfBirth, setDateOfBirth] = useState(loggedInUserInfo?.dateOfBirth);
  const [firstName, setFirstName] = useState(loggedInUserInfo?.firstName);
  const [lastName, setLastName] = useState(loggedInUserInfo?.lastName);
  const [emailAddress, setEmailAddress] = useState(
    loggedInUserInfo?.recoveryEmail
  );
  const [emailAddressError, setEmailAddressError] = useState(false);
  const [primaryMemberRxId, setPrimaryMemberRxId] = useState<string>();
  const [allCurrentFieldsValid, setAllCurrentFieldsValid] = useState(false);
  const [currentLabel, setCurrentLabel] = useState<string>();
  const [loginBodyRefreshKey, setLoginBodyRefreshKey] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string>();

  const resetStateToDefault = () => {
    setEmailAddressError(false);
    setPrimaryMemberRxId(undefined);
    setAllCurrentFieldsValid(false);
    setCurrentLabel(undefined);
    setLoginBodyRefreshKey(loginBodyRefreshKey ? 0 : 1);
    setErrorMessage(undefined);
  };

  useEffect(() => {
    hasAllFieldsValid();
  }, [dateOfBirth, firstName, lastName, emailAddress, primaryMemberRxId]);

  useEffect(() => {
    handleIsEmailValid();
  }, [emailAddress]);

  useEffect(() => {
    handleEmailLoginBodyRefresh();
  }, [emailAddressError]);

  const groupKey = CmsGroupKey.signIn;
  const { content: signInContent, isContentLoading: isSignInContentLoading } =
    useContent<ISignInContent>(groupKey, 2);

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

  const signUpGroupKey = CmsGroupKey.signUp;
  const { content: signUpContent } = useContent<ISignUpContent>(
    signUpGroupKey,
    2
  );

  const isMemberAgeLimitMet = (dob: string) => {
    const formattedDate = dateFormatter.firefoxCompatibleDateFormat(dob);
    if (formattedDate instanceof Date) {
      const age = differenceInYear(
        UTCDate(new Date()),
        UTCDate(dateFormatter.firefoxCompatibleDateFormat(dob))
      );
      return age >= childMemberAgeLimit;
    }
    return false;
  };

  const loginHandlers = {
    onFirstNameChangeHandler: (firstNameInput: string) => {
      const firstNameInputTrimmed = firstNameInput
        ? firstNameInput.trim()
        : undefined;
      setFirstName(firstNameInputTrimmed);
      setCurrentLabel(signInContent.firstNameLabel);
    },
    onLastNameChangeHandler: (lastNameInput: string) => {
      const lastNameInputTrimmed = lastNameInput
        ? lastNameInput.trim()
        : undefined;
      setLastName(lastNameInputTrimmed);
      setCurrentLabel(signInContent.lastNameLabel);
    },
    onEmailAddressChangeHandler: (emailAddressInput: string) => {
      const emailAddressInputTrimmed = emailAddressInput
        ? emailAddressInput.trim()
        : undefined;
      setEmailAddress(emailAddressInputTrimmed);
      setCurrentLabel(signInContent.emailLabel);
    },
    onMemberRxIDChangeHandler: (primaryMemberRxIdInput: string) => {
      const primaryMemberRxIdInputTrimmed = primaryMemberRxIdInput
        ? primaryMemberRxIdInput.trim().replace(/[^\w]*/gi, '')
        : undefined;
      setPrimaryMemberRxId(primaryMemberRxIdInputTrimmed);
      setCurrentLabel(signInContent.memberIdLabel);
    },
    onDateOfBirthChangeHandler: (dateOfBirthInput: string) => {
      setDateOfBirth(dateOfBirthInput);
      setCurrentLabel(undefined);
    },
  };

  const memberLoginFields: IMemberLoginFieldProps[] = [
    {
      identifier: 'firstName',
      textContentType: 'name',
      onChangeText: loginHandlers.onFirstNameChangeHandler,
      placeholder: signInContent.firstNamePlaceholder,
      defaultValue: loggedInUserInfo?.firstName ?? firstName ?? '',
      label: signInContent.firstNameLabel,
    },
    {
      identifier: 'lastName',
      textContentType: 'name',
      onChangeText: loginHandlers.onLastNameChangeHandler,
      placeholder: signInContent.lastNamePlaceholder,
      defaultValue: loggedInUserInfo?.lastName ?? lastName ?? '',
      label: signInContent.lastNameLabel,
    },
    {
      identifier: 'emailAddress',
      textContentType: 'emailAddress',
      onChangeText: loginHandlers.onEmailAddressChangeHandler,
      placeholder: signInContent.emailPlaceholder,
      helpText: signInContent.emailHelperText,
      errorMessage: signInContent.invalidEmailErrorText,
      defaultValue: emailAddress ?? '',
      label: signInContent.emailLabel,
    },
    {
      identifier: 'primaryMemberRxId',
      textContentType: 'name',
      onChangeText: loginHandlers.onMemberRxIDChangeHandler,
      helpText: signUpContent.memberIdHelpText,
      defaultValue: primaryMemberRxId ?? '',
      label: signInContent.memberIdLabel,
      placeholder: signUpContent.memberIdPlaceholder,
    },
  ];

  const getMemberLoginFieldsWithError = (): IMemberLoginFieldProps[] => {
    const memberLoginFieldsNext = memberLoginFields.filter(
      (field: IMemberLoginFieldProps) =>
        field.identifier !== 'primaryMemberRxId'
    );
    return memberLoginFieldsNext.map((field: IMemberLoginFieldProps) => {
      if (field.identifier === 'emailAddress') {
        field.inError = emailAddressError;
      }
      return field;
    });
  };

  const getMemberLoginFields = (): IMemberLoginFieldProps[] => {
    return !isAddMembershipFlow
      ? getMemberLoginFieldsWithError()
      : memberLoginFields.filter(
          (field) => field.identifier !== 'emailAddress'
        );
  };

  const handleIsEmailValid = () => {
    if (emailAddress) {
      setEmailAddressError(!isEmailValid(emailAddress));
    } else {
      setEmailAddressError(false);
    }
  };

  const handleEmailLoginBodyRefresh = () => {
    if (currentLabel === signInContent.emailLabel) {
      setLoginBodyRefreshKey(loginBodyRefreshKey ? 0 : 1);
    }
  };

  const hasAllFieldsValid = () => {
    const primaryMemberRxIdDoesExist =
      !isAddMembershipFlow || !!primaryMemberRxId;
    const emailAddressDoesExist = isAddMembershipFlow || !!emailAddress;

    const areAllFieldsFilled =
      !!firstName &&
      !!lastName &&
      emailAddressDoesExist &&
      primaryMemberRxIdDoesExist &&
      !!dateOfBirth;

    const dateOfBirthIsValid = DateValidator.isDateOfBirthValid(
      dateOfBirth ?? ''
    );
    const memberAgeLimitIsMet = isMemberAgeLimitMet(dateOfBirth ?? '');
    const emailAddressIsValid = isEmailValid(emailAddress ?? '');

    setAllCurrentFieldsValid(
      areAllFieldsFilled &&
        dateOfBirthIsValid &&
        memberAgeLimitIsMet &&
        emailAddressIsValid
    );
  };

  const onLoginPress = async () => {
    const memberLoginState: IMemberLoginState = {
      firstName,
      lastName,
      emailAddress,
      dateOfBirth,
      primaryMemberRxId,
      claimAlertId,
      prescriptionId,
      isBlockchain,
    };
    try {
      await memberAddOrLoginDataLoadingAsyncAction(
        navigation,
        memberLoginState
      )(reduxDispatch, reduxGetState);
      resetStateToDefault();
    } catch {
      setErrorMessage(signInContent.loginScreenErrorMessage);
    }
  };

  const handleNavigateGoBack = () => {
    resetStateToDefault();
    navigation.goBack();
  };

  const onBackPress = isAddMembershipFlow ? handleNavigateGoBack : undefined;

  const renderHeader = (): React.ReactNode => {
    const headerContent =
      isClaimAlertOrPrescriptionFlow || isAddMembershipFlow
        ? signInContent.pbmMemberInstructions
        : signInContent.createAccountInstructions;
    const headerTitle = isClaimAlertOrPrescriptionFlow
      ? signInContent.claimAlertHeader
      : isAddMembershipFlow
      ? signInContent.addMembershipHeader
      : signInContent.createAccountHeader;
    const testId = isClaimAlertOrPrescriptionFlow
      ? 'claimAlertScreenHeader'
      : isAddMembershipFlow
      ? 'joinEmployerScreenHeader'
      : 'loginScreenHeader';
    return (
      <View testID={testId}>
        <Heading
          textStyle={loginScreenStyles.headingTextStyle}
          isSkeleton={isSignInContentLoading}
        >
          {headerTitle}
        </Heading>
        <MarkdownText isSkeleton={isSignInContentLoading}>
          {headerContent}
        </MarkdownText>
      </View>
    );
  };

  const onContactUsLinkPress = (_: string): boolean => {
    if (communicationContent && !isCommunicationContentLoading) {
      (async () => {
        await callPhoneNumber(communicationContent.supportPBMPhone);
      })();

      return false;
    }
    return true;
  };

  const renderError = errorMessage ? (
    <MarkdownText
      textStyle={loginScreenStyles.errorMessageTextStyle}
      color={loginScreenStyles.errorColorTextStyle.color}
      onLinkPress={onContactUsLinkPress}
      isSkeleton={isSignInContentLoading}
    >
      {errorMessage}
    </MarkdownText>
  ) : null;

  const renderLoginBody = () => {
    return (
      <LoginBody
        key={loginBodyRefreshKey}
        onDateOfBirthChangeHandler={loginHandlers.onDateOfBirthChangeHandler}
        memberLoginFields={getMemberLoginFields()}
        enableLogin={allCurrentFieldsValid}
        isAddMembershipFlow={isAddMembershipFlow}
        loggedInUserInfo={loggedInUserInfo}
        dateOfBirth={
          dateOfBirth !== '' ? dateOfBirth : loggedInUserInfo?.dateOfBirth
        }
        showDateOfBirthError={
          dateOfBirth
            ? DateValidator.isDateOfBirthValid(dateOfBirth) &&
              !isMemberAgeLimitMet(dateOfBirth)
            : false
        }
        childMemberAgeLimit={childMemberAgeLimit}
        currentLabel={currentLabel}
        onContactUsLinkPress={onContactUsLinkPress}
      />
    );
  };

  const body = () => {
    return (
      <View style={loginScreenStyles.bodyViewStyle}>
        {renderHeader()}
        {renderError}
        {renderLoginBody()}
        <BaseButton
          disabled={!allCurrentFieldsValid}
          viewStyle={loginScreenStyles.buttonViewStyle}
          onPress={onLoginPress}
          testID={`loginScreen-${
            isAddMembershipFlow ? 'AuthJoinEmployerPlan' : 'CreateAccount'
          }-Button`}
          isSkeleton={isSignInContentLoading}
        >
          {isAddMembershipFlow
            ? signInContent.addMembership
            : signInContent.createAccount}
        </BaseButton>
      </View>
    );
  };

  const bodyProps = {
    body: body(),
    showProfileAvatar: isAddMembershipFlow,
    hideNavigationMenuButton: !isAddMembershipFlow,
  };

  return (
    <BasicPageConnected
      {...bodyProps}
      headerViewStyle={loginScreenStyles.basicPageHeaderViewStyle}
      bodyViewStyle={loginScreenStyles.basicPageBodyViewStyle}
      navigateBack={onBackPress}
      memberProfileName={memberProfileName}
      translateContent={true}
    />
  );
};

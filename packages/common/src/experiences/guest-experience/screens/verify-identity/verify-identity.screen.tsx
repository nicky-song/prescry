// Copyright 2021 Prescryptive Health, Inc.

import React, { BaseSyntheticEvent, useState } from 'react';
import { View } from 'react-native';
import { MarkdownText } from '../../../../components/text/markdown-text/markdown-text';
import DateValidator from '../../../../utils/validators/date.validator';
import dateFormatter from '../../../../utils/formatters/date.formatter';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { isEmailValid } from '../../../../utils/email.helper';
import {
  LengthOfPhoneNumber,
  mandatoryIconUsingStrikeThroughStyle,
  PhoneNumberDialingCode,
  PhoneNumberMaskedValue,
} from '../../../../theming/constants';
import { DatePicker } from '../../../../components/member/pickers/date/date.picker';
import {
  IPrimaryTextInputProps,
  PrimaryTextInput,
} from '../../../../components/inputs/primary-text/primary-text.input';
import MaskedInput from 'react-text-mask';
import { verifyIdentityScreenStyles } from './verify-identity.screen.styles';
import { IVerifyIdentityRequestBody } from '../../../../models/api-request-body/verify-identity.request-body';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../guest-experience-logger.middleware';
import { Heading } from '../../../../components/member/heading/heading';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../navigation/stack-navigators/root/root.stack-navigator';
import { IIdentityVerificationAsyncActionArgs } from '../../store/identity-verification/async-actions/identity-verification.async-action';
import { identityVerificationDataLoadingAsyncAction } from '../../store/identity-verification/async-actions/identity-verification-data-loading.async-action';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { ISignInContent } from '../../../../models/cms-content/sign-in.ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IFormsContent } from '../../../../models/cms-content/forms.ui-content';

export interface IVerifyIdentityFieldProps extends IPrimaryTextInputProps {
  helpText?: string;
  label: string;
  identifier: string;
}

export const VerifyIdentityScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const [dateOfBirth, setDateOfBirth] = useState<string>();
  const [emailAddress, setEmailAddress] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [emailAddressHasError, setEmailAddressHasError] = useState(false);
  const [phoneNumberHasError, setPhoneNumberHasError] = useState(false);
  const [identityMismatchError, setIdentityMismatchError] =
    useState<string | undefined>(undefined);

  const { content: signInContent, isContentLoading: isSignInContentLoading } =
    useContent<ISignInContent>(CmsGroupKey.signIn, 2);

  const { content: formsContent, isContentLoading: isFormsContentLoading } =
    useContent<IFormsContent>(CmsGroupKey.forms, 2);

  const onEmailAddressChangeHandler = (newEmailAddress: string) => {
    if (newEmailAddress !== emailAddress) {
      if (identityMismatchError) {
        setIdentityMismatchError(undefined);
      }
      newEmailAddress = newEmailAddress.trim();
      setEmailAddressHasError(
        !!newEmailAddress && !isEmailValid(newEmailAddress)
      );
      setEmailAddress(newEmailAddress);
    }
  };

  const onDateOfBirthChangeHandler = (dob: string) => {
    if (dob !== dateOfBirth) {
      if (identityMismatchError) {
        setIdentityMismatchError(undefined);
      }
      setDateOfBirth(dob);
    }
  };

  const onPhoneNumberChangeHandler = (phoneNumberEvent: BaseSyntheticEvent) => {
    if (phoneNumberEvent.target.value.trim() !== phoneNumber) {
      if (identityMismatchError) {
        setIdentityMismatchError(undefined);
      }
      const newPhoneNumber = phoneNumberEvent.target.value.trim();

      const validTextInput = newPhoneNumber.replace(/[^0-9]+/g, '');

      if (
        phoneNumberHasError &&
        newPhoneNumber.length === LengthOfPhoneNumber
      ) {
        setPhoneNumberHasError(false);
      }
      setPhoneNumber(validTextInput);
    }
  };

  const onContinueButtonPress = async () => {
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.CLICKED_CONTINUE_VERIFY_IDENTITY_SCREEN,
      {}
    );

    const dateOfBirthFormatted = dateOfBirth?.length
      ? dateFormatter.formatToYMD(dateOfBirth)
      : undefined;
    const phoneNumberWithExtension = phoneNumber
      ? PhoneNumberDialingCode + phoneNumber
      : undefined;
    const emailAddressTrimmed = emailAddress?.trim();
    const args: IIdentityVerificationAsyncActionArgs = {
      reduxDispatch,
      reduxGetState,
      navigation,
      requestBody: {
        phoneNumber: phoneNumberWithExtension,
        dateOfBirth: dateOfBirthFormatted,
        emailAddress: emailAddressTrimmed,
      } as IVerifyIdentityRequestBody,
    };
    try {
      await identityVerificationDataLoadingAsyncAction(args);
    } catch (error) {
      setIdentityMismatchError((error as Error).message);
    }
  };

  const verifyIdentityFields: IVerifyIdentityFieldProps[] = [
    {
      identifier: 'emailAddress',
      textContentType: 'emailAddress',
      onChangeText: onEmailAddressChangeHandler,
      placeholder: signInContent.emailPlaceholder,
      errorMessage: signInContent.invalidEmailErrorText,
      label: signInContent.emailLabel,
    },
  ];

  const hasAllFieldsValid = (): boolean => {
    return !!(
      phoneNumber &&
      emailAddress &&
      dateOfBirth &&
      phoneNumber.length === LengthOfPhoneNumber &&
      DateValidator.isDateOfBirthValid(dateOfBirth) &&
      isEmailValid(emailAddress) &&
      !emailAddressHasError &&
      !phoneNumberHasError
    );
  };

  const renderHeader = () => {
    const testId = 'verifyIdentityScreenHeader';
    return (
      <View testID={testId}>
        <Heading
          textStyle={verifyIdentityScreenStyles.headerTextStyle}
          isSkeleton={isSignInContentLoading}
        >
          {signInContent.verifyIdentityHeader}
        </Heading>
        <BaseText isSkeleton={isSignInContentLoading}>
          {signInContent.verifyIdentityInstructions}
        </BaseText>
      </View>
    );
  };

  const renderError = () => {
    if (identityMismatchError) {
      return (
        <View testID='verifyIdentityScreenError'>
          <MarkdownText textStyle={verifyIdentityScreenStyles.errorTextStyle}>
            {identityMismatchError}
          </MarkdownText>
        </View>
      );
    }
    return null;
  };

  const renderMandatoryIcon = (label: string) => {
    return (
      <MarkdownText
        textStyle={verifyIdentityScreenStyles.inputLabelTextStyle}
        markdownTextStyle={
          verifyIdentityScreenStyles.mandatoryIconMarkdownTextStyle
        }
        isSkeleton={isFormsContentLoading}
      >
        {`${label} ${mandatoryIconUsingStrikeThroughStyle}`}
      </MarkdownText>
    );
  };

  const renderPhoneNumberField = () => {
    return (
      <View
        style={verifyIdentityScreenStyles.textFieldsViewStyle}
        testID='verifyIdentityScreenPhoneNumberView'
      >
        {renderMandatoryIcon(formsContent.phoneNumberLabel)}
        <MaskedInput
          value={phoneNumber}
          guide={false}
          type='tel'
          onChange={onPhoneNumberChangeHandler}
          style={verifyIdentityScreenStyles.phoneNumberCssStyle}
          showMask={true}
          placeholder={formsContent.phoneNumberPlaceholder}
          mask={PhoneNumberMaskedValue}
        />
      </View>
    );
  };

  const renderVerifyIdentityFields = () => {
    return verifyIdentityFields.map((field, index) => {
      const fieldErrorMessage =
        field.identifier === 'emailAddress' && emailAddressHasError
          ? field.errorMessage
          : undefined;

      return (
        <View
          key={index}
          style={verifyIdentityScreenStyles.textFieldsViewStyle}
          testID={`verifyIdentityScreenView-${field.identifier}`}
        >
          <PrimaryTextInput
            label={field.label}
            isRequired={true}
            textContentType={field.textContentType}
            placeholder={field.placeholder}
            onChangeText={field.onChangeText}
            defaultValue={field.defaultValue}
            errorMessage={fieldErrorMessage}
            helpMessage={field.helpText}
          />
        </View>
      );
    });
  };

  const enableVerifyIdentity = hasAllFieldsValid();

  const footer = (
    <BaseButton
      disabled={!enableVerifyIdentity}
      onPress={onContinueButtonPress}
      isSkeleton={isSignInContentLoading}
      testID='verifyIdentityScreenBaseButtonContinue'
    >
      {signInContent.continueButtonCaption}
    </BaseButton>
  );

  const monthList = formsContent.months
    ? Object.values(formsContent.months)
    : undefined;

  const body = (
    <View style={verifyIdentityScreenStyles.bodyViewStyle}>
      {renderHeader()}
      {renderError()}
      <View
        style={verifyIdentityScreenStyles.bodyContainerViewStyle}
        testID='verifyIdentityPage'
      >
        {renderPhoneNumberField()}
        {renderVerifyIdentityFields()}
        <View
          style={verifyIdentityScreenStyles.dateWrapperViewStyle}
          testID='txtDate'
        >
          <DatePicker
            label={formsContent.dobLabel}
            isRequired={true}
            getSelectedDate={onDateOfBirthChangeHandler}
            defaultValue={dateOfBirth}
            dayLabel={formsContent.dayLabel}
            monthLabel={formsContent.monthLabel}
            yearLabel={formsContent.yearLabel}
            monthList={monthList}
            isSkeleton={isFormsContentLoading}
          />
        </View>
      </View>
    </View>
  );

  return (
    <BasicPageConnected
      body={body}
      hideNavigationMenuButton={true}
      footer={footer}
      headerViewStyle={verifyIdentityScreenStyles.basicPageHeaderViewStyle}
      bodyViewStyle={verifyIdentityScreenStyles.basicPageBodyViewStyle}
      navigateBack={navigation.goBack}
      translateContent={true}
    />
  );
};

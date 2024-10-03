// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { PrimaryTextInput } from '../../../../../components/inputs/primary-text/primary-text.input';
import { DatePicker } from '../../../../../components/member/pickers/date/date.picker';
import { createAccountBodyStyles } from './create-account.body.styles';
import { PhoneMaskInput } from '../../../../../components/inputs/masked/phone/phone.mask.input';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { TermsConditionsAndPrivacyCheckbox } from '../../../../../components/member/checkboxes/terms-conditions-and-privacy/terms-conditions-and-privacy.checkbox';
import { MarkdownText } from '../../../../../components/text/markdown-text/markdown-text';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { FieldErrorText } from '../../../../../components/text/field-error/field-error.text';
import { callPhoneNumber } from '../../../../../utils/link.helper';
import { ICommunicationContent } from '../../../../../models/cms-content/communication.content';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { ISignUpContent } from '../../../../../models/cms-content/sign-up.ui-content';
import { IFormsContent } from '../../../../../models/cms-content/forms.ui-content';
import { StringFormatter } from '../../../../../utils/formatters/string.formatter';
import { AttestAuthorizationCheckbox } from '../../../../../components/member/checkboxes/attest-authorization/attest-authorization.checkbox';

export interface ICreateAccountBodyProps {
  onFirstNameChange: (name: string) => void;
  onLastNameChange: (name: string) => void;
  onDateOfBirthChange: (dob: string) => void;
  onEmailAddressChange: (email: string) => void;
  onPhoneNumberChange: (phone: string) => void;
  onTermsAndConditionsToggle: (checked: boolean) => void;
  onAttestAuthorizationToggle?: (checked: boolean) => void;
  onMemberIdChange?: (memberId: string) => void;
  noAccountExistFlow?: boolean;
  initialPhoneNumber?: string;
  emailErrorMessage?: string;
  showDateOfBirthError?: boolean;
  hidePhoneNumber?: boolean;
  isDependent?: boolean;
}

export const CreateAccountBody = ({
  onFirstNameChange,
  onLastNameChange,
  onDateOfBirthChange,
  onEmailAddressChange,
  onPhoneNumberChange,
  onMemberIdChange,
  onTermsAndConditionsToggle,
  onAttestAuthorizationToggle,
  noAccountExistFlow,
  initialPhoneNumber,
  emailErrorMessage,
  showDateOfBirthError,
  hidePhoneNumber,
  isDependent,
}: ICreateAccountBodyProps) => {
  const { getState } = useReduxContext();
  const { config: reduxConfigState } = getState();

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

  const { content: formsContent, isContentLoading: isFormsContentLoading } =
    useContent<IFormsContent>(CmsGroupKey.forms, 2);

  const renderFirstNameField = (
    <View
      style={createAccountBodyStyles.leftItemViewStyle}
      testID='txt_firstName'
    >
      <PrimaryTextInput
        label={signUpContent.firstNameLabel}
        textContentType='name'
        placeholder={signUpContent.firstNameLabel}
        onChangeText={onFirstNameChange}
        testID='createAccountBodyPrimaryTextInputFirstName'
      />
    </View>
  );

  const renderLastNameField = (
    <View
      style={createAccountBodyStyles.rightItemViewStyle}
      testID='txt_lastName'
    >
      <PrimaryTextInput
        label={signUpContent.lastNameLabel}
        textContentType='name'
        placeholder={signUpContent.lastNameLabel}
        onChangeText={onLastNameChange}
        testID='createAccountBodyPrimaryTextInputLastName'
      />
    </View>
  );

  const renderEmailAddressField = (
    <View
      style={createAccountBodyStyles.textFieldsViewStyle}
      testID='txt_emailAddress'
    >
      <PrimaryTextInput
        label={signUpContent.emailAddressLabel}
        textContentType='emailAddress'
        placeholder={signUpContent.emailAddressLabel}
        onChangeText={onEmailAddressChange}
        errorMessage={emailErrorMessage}
        testID='createAccountBodyPrimaryTextInputEmailAddress'
      />
    </View>
  );

  const renderPhoneNumberField = !hidePhoneNumber ? (
    <View
      style={createAccountBodyStyles.fullItemViewStyle}
      testID='txt_phoneNumber'
    >
      <PhoneMaskInput
        onPhoneNumberChange={onPhoneNumberChange}
        label={signUpContent.phoneNumberLabel}
        phoneNumber={initialPhoneNumber}
        editable={!noAccountExistFlow}
        testID='phoneMaskInputPrimaryTextInputPhoneNumber'
      />
      <BaseText
        style={createAccountBodyStyles.helpTextStyle}
        isSkeleton={isSignUpContentLoading}
      >
        {signUpContent.phoneNumberHelpText}
      </BaseText>
    </View>
  ) : null;

  const renderDateOfBirthError = showDateOfBirthError ? (
    <FieldErrorText
      style={createAccountBodyStyles.errorTextStyle}
      isSkeleton={isSignUpContentLoading}
    >
      {StringFormatter.format(
        signUpContent.ageNotMetError,
        new Map([
          ['childAgeLimit', reduxConfigState.childMemberAgeLimit.toString()],
        ])
      )}
    </FieldErrorText>
  ) : null;

  const onContactUsLinkPress = (_: string): boolean => {
    if (communicationContent && !isCommunicationContentLoading) {
      (async () => {
        await callPhoneNumber(communicationContent.supportPBMPhone);
      })();
      return false;
    }
    return true;
  };

  const memberIdField = onMemberIdChange ? (
    <View
      style={createAccountBodyStyles.fullItemViewStyle}
      testID='txt_memberId'
    >
      <PrimaryTextInput
        label={signUpContent.memberIdLabel}
        placeholder={signUpContent.memberIdPlaceholder}
        onChangeText={onMemberIdChange}
      />
      <MarkdownText
        textStyle={createAccountBodyStyles.helpTextStyle}
        onLinkPress={onContactUsLinkPress}
        isSkeleton={isSignUpContentLoading}
        testID='createAccountMemberIdContactUs'
      >
        {signUpContent.memberIdHelpText}
      </MarkdownText>
    </View>
  ) : null;

  const termsAndConditions = !noAccountExistFlow ? (
    <TermsConditionsAndPrivacyCheckbox
      onPress={onTermsAndConditionsToggle}
      viewStyle={
        isDependent
          ? createAccountBodyStyles.termsAndConditionsBelowViewStyle
          : createAccountBodyStyles.termsAndConditionsViewStyle
      }
    />
  ) : null;

  const attestAuthorization =
    isDependent && onAttestAuthorizationToggle ? (
      <AttestAuthorizationCheckbox
        onPress={onAttestAuthorizationToggle}
        viewStyle={createAccountBodyStyles.attestAuthorizationViewStyle}
      />
    ) : null;

  return (
    <View
      style={createAccountBodyStyles.createAccountBodyContainerViewStyle}
      testID='signupPage'
    >
      <View
        style={createAccountBodyStyles.fullNameViewStyle}
        testID='createAccountNameContainer'
      >
        {renderFirstNameField}
        {renderLastNameField}
      </View>
      {renderEmailAddressField}
      {renderPhoneNumberField}
      <View
        style={createAccountBodyStyles.dateWrapperViewStyle}
        testID='txtDate'
      >
        <DatePicker
          label={formsContent.dobLabel}
          getSelectedDate={onDateOfBirthChange}
          dayLabel={formsContent.dayLabel}
          monthLabel={formsContent.monthLabel}
          yearLabel={formsContent.yearLabel}
          monthList={Object.values(formsContent.months)}
          isSkeleton={isFormsContentLoading}
        />
        {renderDateOfBirthError}
      </View>
      {memberIdField}
      {attestAuthorization}
      {termsAndConditions}
    </View>
  );
};

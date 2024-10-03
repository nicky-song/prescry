// Copyright 2018 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import {
  IPrimaryTextInputProps,
  PrimaryTextInput,
} from '../../inputs/primary-text/primary-text.input';
import { DatePicker } from '../pickers/date/date.picker';
import { loginBodyStyles } from './login-body.styles';
import { ILimitedAccount } from '../../../models/member-profile/member-profile-info';
import { FieldErrorText } from '../../text/field-error/field-error.text';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import { IFormsContent } from '../../../models/cms-content/forms.ui-content';
import { MarkdownText } from '../../text/markdown-text/markdown-text';

export interface ILoginBodyProps {
  onDateOfBirthChangeHandler: (date: string) => void;
  memberLoginFields: IMemberLoginFieldProps[];
  enableLogin: boolean;
  isAddMembershipFlow: boolean;
  childMemberAgeLimit: number;
  loggedInUserInfo?: ILimitedAccount;
  showDateOfBirthError?: boolean;
  currentLabel?: string;
  dateOfBirth?: string;
  onContactUsLinkPress: (_: string) => boolean;
}

export interface IMemberLoginFieldProps extends IPrimaryTextInputProps {
  helpText?: string;
  label: string;
  identifier: string;
  inError?: boolean;
}

export interface IMemberLoginFieldState {
  memberLoginFields: IMemberLoginFieldProps[];
  dateOfBirth: string;
}

export const defaultMemberLoginField: IMemberLoginFieldState = {
  memberLoginFields: [],
  dateOfBirth: '',
};

export const LoginBody: React.FC<ILoginBodyProps> = (
  props: ILoginBodyProps
) => {
  const [memberLoginField, setMemberLoginField] =
    useState<IMemberLoginFieldState>({
      memberLoginFields: props.memberLoginFields,
      dateOfBirth: props.loggedInUserInfo?.dateOfBirth ?? '',
    });
  const [datePickerKey, setDatePickerKey] = useState<number>(1);

  const { content, isContentLoading } = useContent<IFormsContent>(
    CmsGroupKey.forms,
    2
  );

  useEffect(() => {
    const memberLoginFieldsLocal: IMemberLoginFieldProps[] =
      props.memberLoginFields.map((field) => {
        const member = props.loggedInUserInfo;
        if (!field.defaultValue && field.identifier === 'firstName') {
          field.defaultValue = member?.firstName;
        }
        if (!field.defaultValue && field.identifier === 'lastName') {
          field.defaultValue = member?.lastName;
        }
        return field;
      });

    setDatePickerKey((datePickerKey ?? 0) + 1);

    const newMemberLoginFields = [...memberLoginFieldsLocal];
    setMemberLoginField({
      memberLoginFields: newMemberLoginFields,
      dateOfBirth:
        props.dateOfBirth ?? props.loggedInUserInfo?.dateOfBirth ?? '',
    });
  }, []);

  const primaryRxIdFieldId = 'primaryMemberRxId';

  const isRequired = (identifier?: string) => {
    return props.isAddMembershipFlow || identifier !== primaryRxIdFieldId;
  };

  const renderMemberLoginFields = () => {
    return memberLoginField.memberLoginFields.map((field, index) => {
      const errorMessage = field.inError ? field.errorMessage : undefined;

      const currentFieldSelected = props.currentLabel
        ? field.label === props.currentLabel
        : false;
      const fieldHelpText = field.helpText ? (
        <MarkdownText
          textStyle={loginBodyStyles.helpTextStyle}
          onLinkPress={
            field.identifier === primaryRxIdFieldId
              ? props.onContactUsLinkPress
              : undefined
          }
        >
          {field.helpText}
        </MarkdownText>
      ) : null;
      return (
        <View
          key={index}
          style={loginBodyStyles.textFieldsViewStyle}
          testID={`txt_${field.identifier}`}
        >
          <PrimaryTextInput
            label={field.label}
            isRequired={isRequired(field.identifier)}
            textContentType={field.textContentType}
            placeholder={field.placeholder}
            onChangeText={field.onChangeText}
            defaultValue={field.defaultValue}
            errorMessage={errorMessage}
            autoFocus={currentFieldSelected}
            testID={`loginBody-${field.identifier}PrimaryTextInput`}
          />
          {fieldHelpText}
        </View>
      );
    });
  };

  const renderUnderAgeLimitError = () => {
    return props.showDateOfBirthError ? (
      <FieldErrorText
        style={loginBodyStyles.errorTextStyle}
        isSkeleton={isContentLoading}
      >
        {StringFormatter.format(
          content.ageNotMetError,
          new Map([['childAgeLimit', props.childMemberAgeLimit.toString()]])
        )}
      </FieldErrorText>
    ) : null;
  };

  return (
    <View
      style={loginBodyStyles.loginBodyContainerViewStyle}
      testID='signupPage'
    >
      {renderMemberLoginFields()}
      <View style={loginBodyStyles.dateWrapperViewStyle} testID='txtDate'>
        <DatePicker
          key={datePickerKey}
          label={content.dobLabel}
          isRequired={true}
          getSelectedDate={props.onDateOfBirthChangeHandler}
          defaultValue={memberLoginField.dateOfBirth}
          isSkeleton={isContentLoading}
          dayLabel={content.dayLabel}
          monthLabel={content.monthLabel}
          yearLabel={content.yearLabel}
          monthList={Object.values(content.months)}
        />
        {renderUnderAgeLimitError()}
      </View>
    </View>
  );
};

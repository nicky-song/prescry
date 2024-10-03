// Copyright 2018 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { PrimaryTextInput } from '../../inputs/primary-text/primary-text.input';
import { DatePicker } from '../pickers/date/date.picker';
import { ILoginBodyProps, LoginBody } from './login-body';
import { loginBodyStyles } from './login-body.styles';
import { FieldErrorText } from '../../text/field-error/field-error.text';
import { defaultMemberLoginField } from './login-body';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IFormsContent } from '../../../models/cms-content/forms.ui-content';
import { MarkdownText } from '../../text/markdown-text/markdown-text';

jest.mock('../pickers/date/date.picker', () => ({
  DatePicker: () => <div />,
}));

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('../../inputs/primary-text/primary-text.input', () => ({
  PrimaryTextInput: () => <div />,
}));

jest.mock('../../text/field-error/field-error.text', () => ({
  FieldErrorText: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const mockOnDateOfBirthChangeHandler = jest.fn();
const mockOnFirstNameChangeHandler = jest.fn();
const mockOnLastNameChangeHandler = jest.fn();
const mockOnMemberRxIDChangeHandler = jest.fn();
const mockOnEmailChangeHandler = jest.fn();
const mockOnContactUsLinkPress = jest.fn();

const ageNotMetErrorPrefix = 'age-not-met-error-mock-';

const uiContentMock = {
  ageNotMetError: ageNotMetErrorPrefix + '{childAgeLimit}',
  dayLabel: 'day-label-mock',
  dobLabel: 'dob-label-mock',
  monthLabel: 'month-label-mock',
  yearLabel: 'year-label-mock',
  months: {
    januaryLabel: 'january-label-mock',
    februaryLabel: 'february-label-mock',
    marchLabel: 'march-label-mock',
    aprilLabel: 'april-label-mock',
    mayLabel: 'may-label-mock',
    juneLabel: 'june-label-mock',
    julyLabel: 'july-label-mock',
    augustLabel: 'august-label-mock',
    septemberLabel: 'september-label-mock',
    octoberLabel: 'october-label-mock',
    novemberLabel: 'november-label-mock',
    decemberLabel: 'december-label-mock',
  },
} as IFormsContent;

describe('LoginBody', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });
  });
  it('should have PrimaryTextInput and MarkdownText when applicable', () => {
    const loginBodyProps: ILoginBodyProps = {
      enableLogin: false,
      memberLoginFields: [
        {
          identifier: 'firstName',
          textContentType: 'name',
          onChangeText: mockOnFirstNameChangeHandler,
          placeholder: 'Your first name',
          label: 'First name',
        },
        {
          identifier: 'lastName',
          textContentType: 'name',
          onChangeText: mockOnLastNameChangeHandler,
          placeholder: 'Your last name',
          label: 'Last name',
        },
        {
          identifier: 'emailAddress',
          textContentType: 'emailAddress',
          onChangeText: mockOnEmailChangeHandler,
          placeholder: 'example@mail.com',
          helpText: 'Needed for account recovery purposes',
          label: 'Email address',
        },
        {
          identifier: 'primaryMemberRxId',
          textContentType: 'name',
          onChangeText: mockOnMemberRxIDChangeHandler,
          placeholder: 'Member ID',
          helpText: 'Only needed for pharmacy benefit services',
          label: 'Member ID',
        },
      ],
      onDateOfBirthChangeHandler: mockOnDateOfBirthChangeHandler,
      isAddMembershipFlow: false,
      loggedInUserInfo: {
        firstName: 'user first name ',
        lastName: 'user last name',
        dateOfBirth: '2005-11-01',
        phoneNumber: 'user phone number',
        favoritedPharmacies: [],
      },
      childMemberAgeLimit: 13,
      onContactUsLinkPress: mockOnContactUsLinkPress,
    };

    useStateMock.mockReturnValueOnce([
      {
        ...defaultMemberLoginField,
        memberLoginFields: loginBodyProps.memberLoginFields,
        dateOfBirth: loginBodyProps.loggedInUserInfo?.dateOfBirth,
      },
      jest.fn(),
    ]);
    useStateMock.mockReturnValueOnce([0, jest.fn()]);

    const findMemberLoginField = (memberLoginFieldlabel: string) =>
      loginBodyProps.memberLoginFields.find(
        (m) => m.label === memberLoginFieldlabel
      );

    const loginBody = renderer.create(<LoginBody {...loginBodyProps} />);
    const primaryTextInputList = loginBody.root.findAllByType(PrimaryTextInput);
    const markdownTextList = loginBody.root.findAllByType(MarkdownText);
    expect(primaryTextInputList.length).toEqual(4);
    expect(markdownTextList.length).toBe(2);

    const firstNameInput = primaryTextInputList[0];
    expect(firstNameInput.props.textContentType).toEqual('name');
    expect(firstNameInput.props.label).toEqual('First name');
    expect(firstNameInput.props.isRequired).toEqual(true);
    expect(firstNameInput.props.placeholder).toEqual('Your first name');
    expect(firstNameInput.props.onChangeText).toEqual(
      mockOnFirstNameChangeHandler
    );
    expect(firstNameInput.props.testID).toEqual(
      `loginBody-${
        findMemberLoginField('First name')?.identifier
      }PrimaryTextInput`
    );

    const lastNameInput = primaryTextInputList[1];
    expect(lastNameInput.props.textContentType).toEqual('name');
    expect(lastNameInput.props.label).toEqual('Last name');
    expect(lastNameInput.props.isRequired).toEqual(true);
    expect(lastNameInput.props.placeholder).toEqual('Your last name');
    expect(lastNameInput.props.onChangeText).toBe(mockOnLastNameChangeHandler);
    expect(lastNameInput.props.testID).toEqual(
      `loginBody-${
        findMemberLoginField('Last name')?.identifier
      }PrimaryTextInput`
    );

    const emailInput = primaryTextInputList[2];
    const emailHelpText = markdownTextList[0];
    expect(emailInput.props.textContentType).toEqual('emailAddress');
    expect(emailInput.props.label).toEqual('Email address');
    expect(emailInput.props.isRequired).toEqual(true);
    expect(emailInput.props.placeholder).toEqual('example@mail.com');
    expect(emailInput.props.onChangeText).toEqual(mockOnEmailChangeHandler);
    expect(emailInput.props.testID).toEqual(
      `loginBody-${
        findMemberLoginField('Email address')?.identifier
      }PrimaryTextInput`
    );
    expect(emailHelpText.type).toEqual(MarkdownText);
    expect(emailHelpText.props.textStyle).toEqual(
      loginBodyStyles.helpTextStyle
    );
    expect(emailHelpText.props.onLinkPress).toBeUndefined();
    expect(emailHelpText.props.children).toEqual(
      'Needed for account recovery purposes'
    );

    const memberIdInput = primaryTextInputList[3];
    const memberIdHelpText = markdownTextList[1];
    expect(memberIdInput.props.textContentType).toEqual('name');
    expect(memberIdInput.props.placeholder).toEqual('Member ID');
    expect(memberIdInput.props.label).toEqual('Member ID');
    expect(memberIdInput.props.isRequired).toBeFalsy();
    expect(memberIdInput.props.onChangeText).toEqual(
      mockOnMemberRxIDChangeHandler
    );
    expect(memberIdInput.props.testID).toEqual(
      `loginBody-${
        findMemberLoginField('Member ID')?.identifier
      }PrimaryTextInput`
    );
    expect(memberIdHelpText.type).toEqual(MarkdownText);
    expect(memberIdHelpText.props.textStyle).toEqual(
      loginBodyStyles.helpTextStyle
    );
    expect(memberIdHelpText.props.onLinkPress).toEqual(
      mockOnContactUsLinkPress
    );
    expect(memberIdHelpText.props.children).toEqual(
      'Only needed for pharmacy benefit services'
    );

    expect(useEffectMock).toHaveBeenCalledTimes(1);
  });

  it('should render memberId as required if add membership flow is true', () => {
    const loginBodyProps: ILoginBodyProps = {
      enableLogin: false,
      memberLoginFields: [
        {
          identifier: 'firstName',
          textContentType: 'name',
          onChangeText: mockOnFirstNameChangeHandler,
          placeholder: 'Your first name',
          label: 'First name',
        },
        {
          identifier: 'lastName',
          textContentType: 'name',
          onChangeText: mockOnLastNameChangeHandler,
          placeholder: 'Your last name',
          label: 'Last name',
        },
        {
          identifier: 'primaryMemberRxId',
          textContentType: 'name',
          onChangeText: mockOnMemberRxIDChangeHandler,
          placeholder: 'Member ID',
          helpText: 'Only needed for pharmacy benefit services',
          label: 'Member ID',
        },
      ],
      onDateOfBirthChangeHandler: mockOnDateOfBirthChangeHandler,
      isAddMembershipFlow: true,
      childMemberAgeLimit: 13,
      onContactUsLinkPress: mockOnContactUsLinkPress,
    };

    useStateMock.mockReturnValueOnce([
      {
        ...defaultMemberLoginField,
        memberLoginFields: loginBodyProps.memberLoginFields,
        dateOfBirth: loginBodyProps.loggedInUserInfo?.dateOfBirth,
      },
      jest.fn(),
    ]);
    useStateMock.mockReturnValueOnce([0, jest.fn()]);

    const loginBody = renderer.create(<LoginBody {...loginBodyProps} />);

    const primaryTextInputList = loginBody.root.findAllByType(PrimaryTextInput);
    expect(primaryTextInputList.length).toEqual(3);

    const firstNameInput = primaryTextInputList[0];
    expect(firstNameInput.props.textContentType).toEqual('name');
    expect(firstNameInput.props.label).toEqual('First name');
    expect(firstNameInput.props.isRequired).toEqual(true);
    expect(firstNameInput.props.placeholder).toEqual('Your first name');
    expect(firstNameInput.props.onChangeText).toEqual(
      mockOnFirstNameChangeHandler
    );

    const lastNameInput = primaryTextInputList[1];
    expect(lastNameInput.props.textContentType).toEqual('name');
    expect(lastNameInput.props.label).toEqual('Last name');
    expect(lastNameInput.props.isRequired).toEqual(true);
    expect(lastNameInput.props.placeholder).toEqual('Your last name');
    expect(lastNameInput.props.onChangeText).toEqual(
      mockOnLastNameChangeHandler
    );

    const memberIdInput = primaryTextInputList[2];
    expect(memberIdInput.props.textContentType).toEqual('name');
    expect(memberIdInput.props.placeholder).toEqual('Member ID');
    expect(memberIdInput.props.label).toEqual('Member ID');
    expect(memberIdInput.props.isRequired).toEqual(true);
    expect(memberIdInput.props.onChangeText).toEqual(
      mockOnMemberRxIDChangeHandler
    );
  });

  it('should have Date of birth Text', () => {
    const loginBodyProps: ILoginBodyProps = {
      enableLogin: false,
      memberLoginFields: [],
      onDateOfBirthChangeHandler: mockOnDateOfBirthChangeHandler,
      isAddMembershipFlow: false,
      childMemberAgeLimit: 13,
      onContactUsLinkPress: mockOnContactUsLinkPress,
    };

    const dateOfBirthMock = '2000-01-02';

    useStateMock.mockReturnValueOnce([
      {
        ...defaultMemberLoginField,
        memberLoginFields: loginBodyProps.memberLoginFields,
        dateOfBirth: dateOfBirthMock,
      },
      jest.fn(),
    ]);
    useStateMock.mockReturnValueOnce([0, jest.fn()]);

    const testRenderer = renderer.create(<LoginBody {...loginBodyProps} />);

    const dobContainer = testRenderer.root.findByProps({ testID: 'txtDate' });
    expect(dobContainer.type).toEqual(View);
    expect(dobContainer.props.style).toEqual(
      loginBodyStyles.dateWrapperViewStyle
    );

    const datePicker = dobContainer.props.children[0];
    expect(datePicker.type).toEqual(DatePicker);
    expect(datePicker.props.label).toEqual(uiContentMock.dobLabel);
    expect(datePicker.props.isRequired).toEqual(true);
    expect(datePicker.props.getSelectedDate).toEqual(
      mockOnDateOfBirthChangeHandler
    );
    expect(datePicker.props.defaultValue).toEqual(dateOfBirthMock);
    expect(datePicker.props.dayLabel).toEqual(uiContentMock.dayLabel);
    expect(datePicker.props.monthLabel).toEqual(uiContentMock.monthLabel);
    expect(datePicker.props.yearLabel).toEqual(uiContentMock.yearLabel);
    expect(datePicker.props.monthList).toEqual(
      Object.values(uiContentMock.months)
    );
  });

  it('displays error under date of birth field if entered date is less than age limit and addMembership is false', () => {
    const loginBodyProps: ILoginBodyProps = {
      enableLogin: false,
      memberLoginFields: [],
      onDateOfBirthChangeHandler: mockOnDateOfBirthChangeHandler,
      isAddMembershipFlow: false,
      showDateOfBirthError: true,
      childMemberAgeLimit: 13,
      onContactUsLinkPress: mockOnContactUsLinkPress,
    };

    useStateMock.mockReturnValueOnce([
      {
        ...defaultMemberLoginField,
        memberLoginFields: loginBodyProps.memberLoginFields,
      },
      jest.fn(),
    ]);
    useStateMock.mockReturnValueOnce([0, jest.fn()]);

    const testRenderer = renderer.create(<LoginBody {...loginBodyProps} />);

    const dobContainer = testRenderer.root.findByProps({ testID: 'txtDate' });
    const dobError = dobContainer.props.children[1];

    expect(dobError.type).toEqual(FieldErrorText);
    expect(dobError.props.style).toEqual(loginBodyStyles.errorTextStyle);
    expect(dobError.props.children).toEqual(
      `${ageNotMetErrorPrefix}${loginBodyProps.childMemberAgeLimit}`
    );
  });

  it('renders helpText as markdown and calls onContactUsLinkPress when primaryMemberRxId is field id', () => {
    const fieldIdMock = 'primaryMemberRxId';
    const loginBodyProps: ILoginBodyProps = {
      enableLogin: false,
      memberLoginFields: [
        {
          identifier: fieldIdMock,
          textContentType: 'name',
          onChangeText: mockOnMemberRxIDChangeHandler,
          placeholder: 'Member ID',
          helpText: '[linkMock]()',
          label: 'Member ID',
        },
      ],
      onDateOfBirthChangeHandler: mockOnDateOfBirthChangeHandler,
      isAddMembershipFlow: false,
      showDateOfBirthError: true,
      childMemberAgeLimit: 13,
      onContactUsLinkPress: mockOnContactUsLinkPress,
    };

    useStateMock.mockReturnValueOnce([
      {
        ...defaultMemberLoginField,
        memberLoginFields: loginBodyProps.memberLoginFields,
      },
      jest.fn(),
    ]);
    useStateMock.mockReturnValueOnce([0, jest.fn()]);

    const testRenderer = renderer.create(<LoginBody {...loginBodyProps} />);

    const rxIdFieldContainer = testRenderer.root.findByProps({
      testID: `txt_${fieldIdMock}`,
    });
    const helpText = rxIdFieldContainer.props.children[1];

    expect(helpText.type).toEqual(MarkdownText);
    expect(helpText.props.textStyle).toEqual(loginBodyStyles.helpTextStyle);
    const onLinkPress = helpText.props.onLinkPress;
    onLinkPress();
    expect(mockOnContactUsLinkPress).toHaveBeenCalledTimes(1);
  });
});

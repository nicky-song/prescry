// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { PhoneMaskInput } from '../../../../../components/inputs/masked/phone/phone.mask.input';
import { PrimaryTextInput } from '../../../../../components/inputs/primary-text/primary-text.input';
import { TermsConditionsAndPrivacyCheckbox } from '../../../../../components/member/checkboxes/terms-conditions-and-privacy/terms-conditions-and-privacy.checkbox';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import {
  CreateAccountBody,
  ICreateAccountBodyProps,
} from './create-account.body';
import { createAccountBodyStyles } from './create-account.body.styles';
import { DatePicker } from '../../../../../components/member/pickers/date/date.picker';
import { getChildren } from '../../../../../testing/test.helper';
import { MarkdownText } from '../../../../../components/text/markdown-text/markdown-text';
import { ITestContainer } from '../../../../../testing/test.container';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../../../context-providers/redux/redux.context';
import { RootState } from '../../../store/root-reducer';
import { IGuestExperienceConfig } from '../../../guest-experience-config';
import { FieldErrorText } from '../../../../../components/text/field-error/field-error.text';
import { callPhoneNumber } from '../../../../../utils/link.helper';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { ISignUpContent } from '../../../../../models/cms-content/sign-up.ui-content';
import { ICommunicationContent } from '../../../../../models/cms-content/communication.content';
import { IFormsContent } from '../../../../../models/cms-content/forms.ui-content';
import { AttestAuthorizationCheckbox } from '../../../../../components/member/checkboxes/attest-authorization/attest-authorization.checkbox';

jest.mock(
  '../../../../../components/member/checkboxes/attest-authorization/attest-authorization.checkbox',
  () => ({
    AttestAuthorizationCheckbox: () => <div />,
  })
);
jest.mock('../../../../../components/member/pickers/date/date.picker', () => ({
  DatePicker: () => <div />,
}));
jest.mock(
  '../../../../../components/inputs/primary-text/primary-text.input',
  () => ({
    PrimaryTextInput: () => <div />,
  })
);
jest.mock(
  '../../../../../components/inputs/masked/phone/phone.mask.input',
  () => ({
    PhoneMaskInput: () => <div />,
  })
);
jest.mock(
  '../../../../../components/member/checkboxes/terms-conditions-and-privacy/terms-conditions-and-privacy.checkbox',
  () => ({
    TermsConditionsAndPrivacyCheckbox: () => <div />,
  })
);

jest.mock('../../../../../components/text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../../../utils/link.helper');
const callPhoneNumberMock = callPhoneNumber as jest.Mock;

jest.mock(
  '../../../../../components/text/field-error/field-error.text',
  () => ({
    FieldErrorText: () => <div />,
  })
);

jest.mock('../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const onFirstNameChangMock = jest.fn();
const onLastNameChangeMock = jest.fn();
const onEmailAddressChangeMock = jest.fn();
const onPhoneNumberChangeMock = jest.fn();
const onDateOfBirthChangeMock = jest.fn();
const onTermsAndConditionsToggleMock = jest.fn();
const onAttestAuthorizationToggleMock = jest.fn();

const getReduxStateMock = jest.fn();

const ageNotMetErrorPrefix = 'age-not-met-error-mock';

const uiContentMock = {
  firstNameLabel: 'first-name-label-mock',
  lastNameLabel: 'last-name-label-mock',
  emailAddressLabel: 'email-address-label-mock',
  phoneNumberLabel: 'phone-number-label-mock',
  phoneNumberHelpText: 'phone-number-help-text-mock',
  ageNotMetError: ageNotMetErrorPrefix + '{childAgeLimit}',
  memberIdLabel: 'member-id-label-mock',
  memberIdPlaceholder: 'member-id-placeholder-mock',
  memberIdHelpText: 'member-id-help-text-mock',
} as unknown as ISignUpContent;

const formsUIContentMock = {
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

const communicationUIContentMock = {
  supportPBMPhone: 'support-pbm-phone',
} as ICommunicationContent;

const isContentLoadingMock = false;

describe('CreateAccountBody', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const reduxContextMock: IReduxContext = {
      dispatch: jest.fn(),
      getState: jest
        .fn()
        .mockReturnValue({ config: { childMemberAgeLimit: 13 } }),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    getReduxStateMock.mockReturnValue({ features: {} });

    useContentMock.mockReset();
    useContentMock.mockReturnValueOnce({
      content: uiContentMock,
      isContentLoading: isContentLoadingMock,
    });
    useContentMock.mockReturnValueOnce({
      content: communicationUIContentMock,
      isContentLoading: isContentLoadingMock,
    });
    useContentMock.mockReturnValueOnce({
      content: formsUIContentMock,
      isContentLoading: isContentLoadingMock,
    });
  });

  it('renders container', () => {
    const propsMock: ICreateAccountBodyProps = {
      onFirstNameChange: jest.fn(),
      onLastNameChange: jest.fn(),
      onEmailAddressChange: jest.fn(),
      onPhoneNumberChange: jest.fn(),
      onDateOfBirthChange: jest.fn(),
      onTermsAndConditionsToggle: jest.fn(),
      onAttestAuthorizationToggle: jest.fn(),
    };
    const testRenderer = renderer.create(<CreateAccountBody {...propsMock} />);

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.testID).toEqual('signupPage');
    expect(container.props.style).toEqual(
      createAccountBodyStyles.createAccountBodyContainerViewStyle
    );
    expect(getChildren(container).length).toEqual(7);
  });

  it('should have correct component structure', () => {
    const mockProps: ICreateAccountBodyProps = {
      onFirstNameChange: onFirstNameChangMock,
      onLastNameChange: onLastNameChangeMock,
      onEmailAddressChange: onEmailAddressChangeMock,
      onPhoneNumberChange: onPhoneNumberChangeMock,
      onDateOfBirthChange: onDateOfBirthChangeMock,
      onTermsAndConditionsToggle: onTermsAndConditionsToggleMock,
      emailErrorMessage: uiContentMock.emailErrorMessage,
      onAttestAuthorizationToggle: onAttestAuthorizationToggleMock,
    };

    const testRenderer = renderer.create(<CreateAccountBody {...mockProps} />);
    const createAccountBodyContainer = testRenderer.root.findByType(View);
    expect(createAccountBodyContainer.props.style).toEqual(
      createAccountBodyStyles.createAccountBodyContainerViewStyle
    );
    const fullNameView = createAccountBodyContainer.props.children[0];
    expect(fullNameView.type).toEqual(View);
    expect(fullNameView.props.style).toEqual(
      createAccountBodyStyles.fullNameViewStyle
    );
    const firstNameView = fullNameView.props.children[0];
    expect(firstNameView.type).toEqual(View);
    expect(firstNameView.props.style).toEqual(
      createAccountBodyStyles.leftItemViewStyle
    );
    expect(firstNameView.props.testID).toEqual('txt_firstName');
    const firstNameTextInput = firstNameView.props.children;
    expect(firstNameTextInput.type).toEqual(PrimaryTextInput);
    expect(firstNameTextInput.props.label).toEqual(
      uiContentMock.firstNameLabel
    );
    expect(firstNameTextInput.props.textContentType).toEqual('name');
    expect(firstNameTextInput.props.placeholder).toEqual(
      uiContentMock.firstNameLabel
    );
    expect(firstNameTextInput.props.onChangeText).toEqual(onFirstNameChangMock);
    expect(firstNameTextInput.props.testID).toEqual(
      'createAccountBodyPrimaryTextInputFirstName'
    );

    const lastNameView = fullNameView.props.children[1];
    expect(lastNameView.type).toEqual(View);
    expect(lastNameView.props.style).toEqual(
      createAccountBodyStyles.rightItemViewStyle
    );
    expect(lastNameView.props.testID).toEqual('txt_lastName');
    const lastNameTextInput = lastNameView.props.children;
    expect(lastNameTextInput.type).toEqual(PrimaryTextInput);
    expect(lastNameTextInput.props.label).toEqual(uiContentMock.lastNameLabel);

    expect(lastNameTextInput.props.textContentType).toEqual('name');
    expect(lastNameTextInput.props.placeholder).toEqual(
      uiContentMock.lastNameLabel
    );
    expect(lastNameTextInput.props.onChangeText).toEqual(onLastNameChangeMock);
    expect(lastNameTextInput.props.testID).toEqual(
      'createAccountBodyPrimaryTextInputLastName'
    );

    const emailAddressView = createAccountBodyContainer.props.children[1];
    expect(emailAddressView.type).toEqual(View);
    expect(emailAddressView.props.style).toEqual(
      createAccountBodyStyles.textFieldsViewStyle
    );
    expect(emailAddressView.props.testID).toEqual('txt_emailAddress');

    const emailAddressTextInput = emailAddressView.props.children;
    expect(emailAddressTextInput.type).toEqual(PrimaryTextInput);
    expect(emailAddressTextInput.props.label).toEqual(
      uiContentMock.emailAddressLabel
    );
    expect(emailAddressTextInput.props.errorMessage).toEqual(
      uiContentMock.emailErrorMessage
    );

    expect(emailAddressTextInput.props.textContentType).toEqual('emailAddress');
    expect(emailAddressTextInput.props.placeholder).toEqual(
      uiContentMock.emailAddressLabel
    );
    expect(emailAddressTextInput.props.onChangeText).toEqual(
      onEmailAddressChangeMock
    );
    expect(emailAddressTextInput.props.testID).toEqual(
      'createAccountBodyPrimaryTextInputEmailAddress'
    );

    const phoneNumberView = createAccountBodyContainer.props.children[2];
    expect(phoneNumberView.type).toEqual(View);
    expect(phoneNumberView.props.style).toEqual(
      createAccountBodyStyles.fullItemViewStyle
    );
    expect(phoneNumberView.props.testID).toEqual('txt_phoneNumber');
    const phoneNumberInput = phoneNumberView.props.children[0];
    expect(phoneNumberInput.type).toEqual(PhoneMaskInput);
    expect(phoneNumberInput.props.label).toEqual(
      uiContentMock.phoneNumberLabel
    );
    expect(phoneNumberInput.props.onPhoneNumberChange).toEqual(
      onPhoneNumberChangeMock
    );
    expect(phoneNumberInput.props.editable).toEqual(true);
    expect(phoneNumberInput.props.phoneNumber).toEqual(undefined);
    expect(phoneNumberInput.props.testID).toEqual(
      'phoneMaskInputPrimaryTextInputPhoneNumber'
    );

    const phoneNumberHelpText = phoneNumberView.props.children[1];
    expect(phoneNumberHelpText.type).toEqual(BaseText);
    expect(phoneNumberHelpText.props.children).toEqual(
      uiContentMock.phoneNumberHelpText
    );
    expect(phoneNumberHelpText.props.style).toEqual(
      createAccountBodyStyles.helpTextStyle
    );
    expect(phoneNumberHelpText.props.isSkeleton).toEqual(isContentLoadingMock);

    const dateWrapperView = createAccountBodyContainer.props.children[3];
    expect(dateWrapperView.type).toEqual(View);
    expect(dateWrapperView.props.style).toEqual(
      createAccountBodyStyles.dateWrapperViewStyle
    );
    expect(dateWrapperView.props.testID).toEqual('txtDate');
    const datePicker = dateWrapperView.props.children[0];
    expect(datePicker.type).toEqual(DatePicker);
    expect(datePicker.props.label).toEqual(formsUIContentMock.dobLabel);
    expect(datePicker.props.getSelectedDate).toEqual(onDateOfBirthChangeMock);
    expect(datePicker.props.dayLabel).toEqual(formsUIContentMock.dayLabel);
    expect(datePicker.props.monthLabel).toEqual(formsUIContentMock.monthLabel);
    expect(datePicker.props.yearLabel).toEqual(formsUIContentMock.yearLabel);
    expect(datePicker.props.monthList).toEqual(
      Object.values(formsUIContentMock.months)
    );
    expect(datePicker.props.isSkeleton).toEqual(isContentLoadingMock);

    expect(createAccountBodyContainer.props.children[5]).toBeNull();

    const termsAndConditionsAndPrivacyPolicy =
      createAccountBodyContainer.props.children[6];
    expect(termsAndConditionsAndPrivacyPolicy.type).toEqual(
      TermsConditionsAndPrivacyCheckbox
    );
    expect(termsAndConditionsAndPrivacyPolicy.props.onPress).toEqual(
      onTermsAndConditionsToggleMock
    );
    expect(termsAndConditionsAndPrivacyPolicy.props.viewStyle).toEqual(
      createAccountBodyStyles.termsAndConditionsViewStyle
    );
  });

  it('should hide few components when noAccountExistFlow', () => {
    const mockProps: ICreateAccountBodyProps = {
      onFirstNameChange: onFirstNameChangMock,
      onLastNameChange: onLastNameChangeMock,
      onEmailAddressChange: onEmailAddressChangeMock,
      onPhoneNumberChange: onPhoneNumberChangeMock,
      onDateOfBirthChange: onDateOfBirthChangeMock,
      onTermsAndConditionsToggle: onTermsAndConditionsToggleMock,
      noAccountExistFlow: true,
      initialPhoneNumber: '1234567890',
      onAttestAuthorizationToggle: onAttestAuthorizationToggleMock,
    };

    const testRenderer = renderer.create(<CreateAccountBody {...mockProps} />);
    const createAccountBodyContainer = testRenderer.root.findByType(View);
    expect(createAccountBodyContainer.props.style).toEqual(
      createAccountBodyStyles.createAccountBodyContainerViewStyle
    );

    const fullNameView = createAccountBodyContainer.props.children[0];
    expect(fullNameView.type).toEqual(View);
    expect(fullNameView.props.style).toEqual(
      createAccountBodyStyles.fullNameViewStyle
    );

    const firstNameView = fullNameView.props.children[0];
    expect(firstNameView.type).toEqual(View);
    expect(firstNameView.props.style).toEqual(
      createAccountBodyStyles.leftItemViewStyle
    );

    const firstNameTextInput = firstNameView.props.children;
    expect(firstNameTextInput.type).toEqual(PrimaryTextInput);
    expect(firstNameTextInput.props.label).toEqual(
      uiContentMock.firstNameLabel
    );
    expect(firstNameTextInput.props.textContentType).toEqual('name');
    expect(firstNameTextInput.props.placeholder).toEqual(
      uiContentMock.firstNameLabel
    );
    expect(firstNameTextInput.props.onChangeText).toEqual(onFirstNameChangMock);

    const lastNameView = fullNameView.props.children[1];
    expect(lastNameView.type).toEqual(View);
    expect(lastNameView.props.style).toEqual(
      createAccountBodyStyles.rightItemViewStyle
    );

    const lastNameTextInput = lastNameView.props.children;
    expect(lastNameTextInput.type).toEqual(PrimaryTextInput);
    expect(lastNameTextInput.props.label).toEqual(uiContentMock.lastNameLabel);
    expect(lastNameTextInput.props.textContentType).toEqual('name');
    expect(lastNameTextInput.props.placeholder).toEqual(
      uiContentMock.lastNameLabel
    );
    expect(lastNameTextInput.props.onChangeText).toEqual(onLastNameChangeMock);

    const emailAddressView = createAccountBodyContainer.props.children[1];
    expect(emailAddressView.type).toEqual(View);
    expect(emailAddressView.props.style).toEqual(
      createAccountBodyStyles.textFieldsViewStyle
    );

    const emailAddressTextInput = emailAddressView.props.children;
    expect(emailAddressTextInput.type).toEqual(PrimaryTextInput);
    expect(emailAddressTextInput.props.label).toEqual(
      uiContentMock.emailAddressLabel
    );
    expect(emailAddressTextInput.props.errorMessage).not.toBeDefined();
    expect(emailAddressTextInput.props.textContentType).toEqual('emailAddress');
    expect(emailAddressTextInput.props.placeholder).toEqual(
      uiContentMock.emailAddressLabel
    );
    expect(emailAddressTextInput.props.onChangeText).toEqual(
      onEmailAddressChangeMock
    );

    const phoneNumberView = getChildren(createAccountBodyContainer)[2];
    const phoneNumberInput = getChildren(phoneNumberView)[0];
    expect(phoneNumberInput.props.editable).toEqual(false);
    expect(phoneNumberInput.props.phoneNumber).toEqual(
      mockProps.initialPhoneNumber
    );

    const dateWrapperView = createAccountBodyContainer.props.children[3];

    expect(dateWrapperView.type).toEqual(View);
    expect(dateWrapperView.props.style).toEqual(
      createAccountBodyStyles.dateWrapperViewStyle
    );
    const datePicker = dateWrapperView.props.children[0];
    expect(datePicker.type).toEqual(DatePicker);
    expect(datePicker.props.label).toEqual(formsUIContentMock.dobLabel);
    expect(datePicker.props.getSelectedDate).toEqual(onDateOfBirthChangeMock);

    const termsAndConditionsAndPrivacyPolicy =
      createAccountBodyContainer.props.children[4];
    expect(termsAndConditionsAndPrivacyPolicy).toEqual(null);
  });

  it.each([[undefined], [jest.fn()]])(
    'renders member id field container (onMemberIdChange: %p)',
    (onMemberIdChangeMock: undefined | (() => void)) => {
      const propsMock: ICreateAccountBodyProps = {
        onFirstNameChange: jest.fn(),
        onLastNameChange: jest.fn(),
        onEmailAddressChange: jest.fn(),
        onPhoneNumberChange: jest.fn(),
        onDateOfBirthChange: jest.fn(),
        onTermsAndConditionsToggle: jest.fn(),
        onMemberIdChange: onMemberIdChangeMock,
        onAttestAuthorizationToggle: onAttestAuthorizationToggleMock,
      };
      const testRenderer = renderer.create(
        <CreateAccountBody {...propsMock} />
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;
      const memberIdFieldContainer = getChildren(container)[4];

      if (onMemberIdChangeMock) {
        expect(memberIdFieldContainer.type).toEqual(View);
        expect(memberIdFieldContainer.props.style).toEqual(
          createAccountBodyStyles.fullItemViewStyle
        );
        expect(memberIdFieldContainer.props.testID).toEqual('txt_memberId');
        expect(getChildren(memberIdFieldContainer).length).toEqual(2);
      } else {
        expect(memberIdFieldContainer).toBeNull();
      }
    }
  );

  it('renders member id input in field container', () => {
    const onMemberIdChangeMock = jest.fn();

    const propsMock: ICreateAccountBodyProps = {
      onFirstNameChange: jest.fn(),
      onLastNameChange: jest.fn(),
      onEmailAddressChange: jest.fn(),
      onPhoneNumberChange: jest.fn(),
      onDateOfBirthChange: jest.fn(),
      onTermsAndConditionsToggle: jest.fn(),
      onMemberIdChange: onMemberIdChangeMock,
      onAttestAuthorizationToggle: onAttestAuthorizationToggleMock,
    };
    const testRenderer = renderer.create(<CreateAccountBody {...propsMock} />);

    const container = testRenderer.root.children[0] as ReactTestInstance;
    const memberIdFieldContainer = getChildren(container)[4];
    const memberIdInput = getChildren(memberIdFieldContainer)[0];

    expect(memberIdInput.type).toEqual(PrimaryTextInput);
    expect(memberIdInput.props.label).toEqual(uiContentMock.memberIdLabel);
    expect(memberIdInput.props.placeholder).toEqual(
      uiContentMock.memberIdPlaceholder
    );
    expect(memberIdInput.props.onChangeText).toEqual(onMemberIdChangeMock);
  });

  it('renders member id help in field container', () => {
    const propsMock: ICreateAccountBodyProps = {
      onFirstNameChange: jest.fn(),
      onLastNameChange: jest.fn(),
      onEmailAddressChange: jest.fn(),
      onPhoneNumberChange: jest.fn(),
      onDateOfBirthChange: jest.fn(),
      onTermsAndConditionsToggle: jest.fn(),
      onMemberIdChange: jest.fn(),
      onAttestAuthorizationToggle: onAttestAuthorizationToggleMock,
    };
    const testRenderer = renderer.create(<CreateAccountBody {...propsMock} />);

    const container = testRenderer.root.children[0] as ReactTestInstance;
    const memberIdFieldContainer = getChildren(container)[4];
    const memberIdHelp = getChildren(memberIdFieldContainer)[1];

    expect(memberIdHelp.type).toEqual(MarkdownText);
    expect(memberIdHelp.props.textStyle).toEqual(
      createAccountBodyStyles.helpTextStyle
    );
    expect(memberIdHelp.props.onLinkPress).toEqual(expect.any(Function));
    expect(memberIdHelp.props.children).toEqual(uiContentMock.memberIdHelpText);
    expect(memberIdHelp.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(memberIdHelp.props.testID).toEqual('createAccountMemberIdContactUs');
  });

  it.each([[true], [false]])(
    'Handles "Contact us" link pres (isCommunicationContentLoading: %s)',
    async (isCommunicationContentLoading: boolean) => {
      const stateMock: Partial<RootState> = {
        config: {
          childMemberAgeLimit: 13,
        } as IGuestExperienceConfig,
      };
      const reduxContextMock: IReduxContext = {
        dispatch: jest.fn(),
        getState: jest.fn().mockReturnValue(stateMock),
      };
      useReduxContextMock.mockReturnValue(reduxContextMock);

      useContentMock.mockReset();
      useContentMock.mockReturnValueOnce({
        content: uiContentMock,
        isContentLoading: false,
      });
      useContentMock.mockReturnValueOnce({
        content: communicationUIContentMock,
        isContentLoading: isCommunicationContentLoading,
      });
      useContentMock.mockReturnValueOnce({
        content: formsUIContentMock,
        isContentLoading: false,
      });

      const propsMock: ICreateAccountBodyProps = {
        onFirstNameChange: jest.fn(),
        onLastNameChange: jest.fn(),
        onEmailAddressChange: jest.fn(),
        onPhoneNumberChange: jest.fn(),
        onDateOfBirthChange: jest.fn(),
        onTermsAndConditionsToggle: jest.fn(),
        onMemberIdChange: jest.fn(),
        onAttestAuthorizationToggle: onAttestAuthorizationToggleMock,
      };

      const testRenderer = renderer.create(
        <CreateAccountBody {...propsMock} />
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;
      const memberIdFieldContainer = getChildren(container)[4];
      const memberIdHelp = getChildren(memberIdFieldContainer)[1];

      const linkPressResult = await memberIdHelp.props.onLinkPress();

      if (isCommunicationContentLoading) {
        expect(callPhoneNumberMock).toHaveBeenCalledTimes(0);
        expect(linkPressResult).toEqual(true);
      } else {
        expect(callPhoneNumberMock).toHaveBeenCalledWith(
          communicationUIContentMock.supportPBMPhone
        );
        expect(linkPressResult).toEqual(false);
      }
    }
  );

  it('displays error under date of birth field if entered date is less than age limit ', () => {
    const propsMock: ICreateAccountBodyProps = {
      onFirstNameChange: jest.fn(),
      onLastNameChange: jest.fn(),
      onEmailAddressChange: jest.fn(),
      onPhoneNumberChange: jest.fn(),
      onDateOfBirthChange: jest.fn(),
      onTermsAndConditionsToggle: jest.fn(),
      onMemberIdChange: jest.fn(),
      showDateOfBirthError: true,
      onAttestAuthorizationToggle: onAttestAuthorizationToggleMock,
    };

    const testRenderer = renderer.create(<CreateAccountBody {...propsMock} />);

    const container = testRenderer.root.children[0] as ReactTestInstance;
    const dobFieldContainer = getChildren(container)[3];
    const dobError = getChildren(dobFieldContainer)[1];

    const expectedAgeLimit = 13;

    expect(dobError.type).toEqual(FieldErrorText);
    expect(dobError.props.style).toEqual(
      createAccountBodyStyles.errorTextStyle
    );
    expect(dobError.props.isSkeleton).toEqual(isContentLoadingMock);

    expect(dobError.props.children).toEqual(
      `${ageNotMetErrorPrefix}${expectedAgeLimit}`
    );
  });

  it('should hide few components when noAccountExistFlow', () => {
    const mockProps: ICreateAccountBodyProps = {
      onFirstNameChange: onFirstNameChangMock,
      onLastNameChange: onLastNameChangeMock,
      onEmailAddressChange: onEmailAddressChangeMock,
      onPhoneNumberChange: onPhoneNumberChangeMock,
      onDateOfBirthChange: onDateOfBirthChangeMock,
      onTermsAndConditionsToggle: onTermsAndConditionsToggleMock,
      noAccountExistFlow: true,
      initialPhoneNumber: '1234567890',
      hidePhoneNumber: true,
      onAttestAuthorizationToggle: onAttestAuthorizationToggleMock,
    };

    const testRenderer = renderer.create(<CreateAccountBody {...mockProps} />);
    const createAccountBodyContainer = testRenderer.root.findByType(View);

    const phoneNumberView = getChildren(createAccountBodyContainer)[2];
    expect(phoneNumberView).toEqual(null);
  });

  it('should render AttestAuthorizationCheckbox when isDependent and onAttestAuthorizationToggle', () => {
    const mockProps: ICreateAccountBodyProps = {
      onFirstNameChange: onFirstNameChangMock,
      onLastNameChange: onLastNameChangeMock,
      onEmailAddressChange: onEmailAddressChangeMock,
      onPhoneNumberChange: onPhoneNumberChangeMock,
      onDateOfBirthChange: onDateOfBirthChangeMock,
      onTermsAndConditionsToggle: onTermsAndConditionsToggleMock,
      noAccountExistFlow: true,
      initialPhoneNumber: '1234567890',
      hidePhoneNumber: true,
      onAttestAuthorizationToggle: onAttestAuthorizationToggleMock,
      isDependent: true,
    };

    const testRenderer = renderer.create(<CreateAccountBody {...mockProps} />);
    const createAccountBodyContainer = testRenderer.root.findByType(View);

    const attestAuthorizationCheckbox = getChildren(
      createAccountBodyContainer
    )[5];

    expect(attestAuthorizationCheckbox.type).toEqual(
      AttestAuthorizationCheckbox
    );
    expect(attestAuthorizationCheckbox.props.onPress).toEqual(
      onAttestAuthorizationToggleMock
    );
    expect(attestAuthorizationCheckbox.props.viewStyle).toEqual(
      createAccountBodyStyles.attestAuthorizationViewStyle
    );
  });
});

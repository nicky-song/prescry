// Copyright 2018 Prescryptive Health, Inc.

import React, { useState } from 'react';
import renderer from 'react-test-renderer';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ISignInContent } from '../../../models/cms-content/sign-in.ui-content';
import { PhoneMaskInput } from '../../inputs/masked/phone/phone.mask.input';
import { BaseText } from '../../text/base-text/base-text';
import { FieldErrorText } from '../../text/field-error/field-error.text';
import {
  IPhoneNumberLoginContainerActionProps,
  IPhoneNumberLoginContainerProps,
  PhoneNumberLoginContainer,
} from './phone-number-login-container';

jest.mock('react-text-mask');

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));

jest.mock('../../inputs/masked/phone/phone.mask.input', () => ({
  PhoneMaskInput: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const useStateMock = useState as jest.Mock;

const mockOnTextInputChangeHandler = jest.fn();
const mockNavigateToOneTimePasswordVerification = jest.fn();

const phoneNumberLoginContainerProps: IPhoneNumberLoginContainerActionProps &
  IPhoneNumberLoginContainerProps = {
  onTextInputChangeHandler: mockOnTextInputChangeHandler,
  phoneNumberTypeIsUnsupported: false,
};

const uiContentMock: Partial<ISignInContent> = {
  providePhoneNumberMessage: 'provide-phone-number-message-mock',
  relevantTextAlertsMessage: 'relevant-text-alerts-message-mock',
  phoneNumberRegistrationErrorMessage:
    'phone-number-registration-error-messaage-mock',
};

beforeEach(() => {
  mockOnTextInputChangeHandler.mockClear();
  mockNavigateToOneTimePasswordVerification.mockClear();
  useStateMock.mockReset();
  useContentMock.mockClear();
  useStateMock.mockReturnValue(['', jest.fn()]);
  useContentMock.mockReturnValue({
    content: uiContentMock,
    isContentLoading: false,
  });
});

describe('PhoneNumberLoginContainer', () => {
  it('PrimaryTextBox should renders correctly with props', () => {
    const container = renderer.create(
      <PhoneNumberLoginContainer {...phoneNumberLoginContainerProps} />
    );
    const textBoxes = container.root.findAllByType(BaseText);
    expect(textBoxes.length).toEqual(2);
    expect(textBoxes[0].props.children).toEqual(
      uiContentMock.providePhoneNumberMessage
    );
    expect(textBoxes[0].props.isSkeleton).toEqual(false);
    expect(textBoxes[1].props.children).toEqual(
      uiContentMock.relevantTextAlertsMessage
    );
    expect(textBoxes[1].props.isSkeleton).toEqual(false);
  });

  it('should have TextInput with props', () => {
    const container = renderer.create(
      <PhoneNumberLoginContainer {...phoneNumberLoginContainerProps} />
    );
    const phoneMaskedInput = container.root.findByType(PhoneMaskInput);
    expect(phoneMaskedInput).toBeDefined();
    expect(phoneMaskedInput.props.onPhoneNumberChange).toEqual(
      expect.any(Function)
    );
    expect(phoneMaskedInput.props.testID).toEqual(
      'phoneNumberLoginPhoneMaskInput'
    );
  });

  it('should have PhoneMaskInput with 10 digit phone number as value if phone number provided as props', () => {
    useStateMock.mockReturnValue(['1234567890', jest.fn()]);

    const container = renderer.create(
      <PhoneNumberLoginContainer {...phoneNumberLoginContainerProps} />
    );
    const phoneMaskInput = container.root.findByType(PhoneMaskInput);
    expect(phoneMaskInput).toBeDefined();
  });

  it('should show phoneNumberRegistrationErrorMessage if phone number doesnot support text message ', () => {
    const unsupportedPhoneNumberProps = {
      ...phoneNumberLoginContainerProps,
      phoneNumberTypeIsUnsupported: true,
    };
    const container = renderer.create(
      <PhoneNumberLoginContainer {...unsupportedPhoneNumberProps} />
    );

    const errorMessageText = container.root.findAllByType(FieldErrorText)[0];
    expect(errorMessageText.props.children).toEqual(
      uiContentMock.phoneNumberRegistrationErrorMessage
    );
    expect(errorMessageText.props.isSkeleton).toEqual(false);
  });

  it('should not call onTextInputChangeHandler if phone number has not changed', () => {
    useStateMock.mockReturnValue(['1112223333', jest.fn()]);
    const unchangedPhoneNumberProps = {
      ...phoneNumberLoginContainerProps,
      phoneNumber: '1112223333',
    };

    const container = renderer.create(
      <PhoneNumberLoginContainer {...unchangedPhoneNumberProps} />
    );
    const phoneNumberEntry = container.root.findByType(PhoneMaskInput);
    phoneNumberEntry.props.onPhoneNumberChange('1112223333');
    expect(mockOnTextInputChangeHandler).not.toHaveBeenCalled();
  });

  it('should call useContent with correct parameters', () => {
    renderer.create(
      <PhoneNumberLoginContainer {...phoneNumberLoginContainerProps} />
    );

    expect(useContentMock).toHaveBeenCalledWith(CmsGroupKey.signIn, 2);
  });
});

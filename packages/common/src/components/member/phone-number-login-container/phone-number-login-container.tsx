// Copyright 2018 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ISignInContent } from '../../../models/cms-content/sign-in.ui-content';
import { PhoneMaskInput } from '../../inputs/masked/phone/phone.mask.input';
import { BaseText } from '../../text/base-text/base-text';
import { FieldErrorText } from '../../text/field-error/field-error.text';
import { phoneNumberLoginContainerStyles } from './phone-number-login-container.style';

export interface IPhoneNumberLoginContainerProps {
  phoneNumberTypeIsUnsupported: boolean;
}

export interface IPhoneNumberLoginContainerActionProps {
  onTextInputChangeHandler: (inputValue: string) => void;
}

export const PhoneNumberLoginContainer = (
  props: IPhoneNumberLoginContainerProps & IPhoneNumberLoginContainerActionProps
): React.ReactElement => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const { content, isContentLoading } = useContent<ISignInContent>(
    CmsGroupKey.signIn,
    2
  );

  const onChangeHandler = (phone: string) => {
    const validTextInput = phone.replace(/[^0-9]+/g, '');
    if (validTextInput.length < 11 && validTextInput !== phoneNumber) {
      setPhoneNumber(validTextInput);
      props.onTextInputChangeHandler(validTextInput);
    }
  };

  const renderPhoneTypeUnsupportedIfAppropriate = () => {
    return (
      <FieldErrorText
        style={phoneNumberLoginContainerStyles.unSupportedPhoneNumberText}
        isSkeleton={isContentLoading}
      >
        {content.phoneNumberRegistrationErrorMessage}
      </FieldErrorText>
    );
  };

  return (
    <View
      style={phoneNumberLoginContainerStyles.phoneNumberLoginContainerView}
      testID='txtPhoneNumber'
    >
      <BaseText
        style={phoneNumberLoginContainerStyles.paragraphText}
        isSkeleton={isContentLoading}
      >
        {content.providePhoneNumberMessage}
      </BaseText>
      <PhoneMaskInput
        viewStyle={phoneNumberLoginContainerStyles.phoneMaskInputViewStyle}
        phoneNumber={phoneNumber}
        onPhoneNumberChange={onChangeHandler}
        testID='phoneNumberLoginPhoneMaskInput'
      />
      {props.phoneNumberTypeIsUnsupported &&
        renderPhoneTypeUnsupportedIfAppropriate()}
      <BaseText
        style={phoneNumberLoginContainerStyles.relevantTextAlertsMessageStyle}
        isSkeleton={isContentLoading}
      >
        {content.relevantTextAlertsMessage}
      </BaseText>
    </View>
  );
};

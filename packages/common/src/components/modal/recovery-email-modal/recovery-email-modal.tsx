// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import { isEmailValid } from '../../../utils/email.helper';
import { PrimaryTextInput } from '../../inputs/primary-text/primary-text.input';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { recoveryEmailModalStyles as styles } from './recovery-email-modal.styles';
import { recoveryEmailModalContent } from './recovery-email-modal.content';
import { BaseButton } from '../../buttons/base/base.button';
import { RootStackNavigationProp } from '../../../experiences/guest-experience/navigation/stack-navigators/root/root.stack-navigator';
import { useNavigation } from '@react-navigation/native';
import { BaseText } from '../../text/base-text/base-text';
import { Heading } from '../../member/heading/heading';

export interface IRecoveryEmailModalDataProps {
  onChangeModalType: (type: string) => void;
}

export interface IRecoveryEmailModalActionProps {
  addEmailAction: (
    emailAddress: string,
    navigation: RootStackNavigationProp
  ) => void;
}

export type IRecoveryEmailModalProps = IRecoveryEmailModalDataProps &
  IRecoveryEmailModalActionProps;

export const RecoveryEmailModal = (props: IRecoveryEmailModalProps) => {
  const navigation = useNavigation<RootStackNavigationProp>();

  const { onChangeModalType, addEmailAction } = props;

  const [inputValue, setInputValue] = useState('');
  const [showEmailError, setShowEmailError] = useState(false);
  const [primaryButtonEnabled, setPrimaryButtonEnabled] = useState(false);

  const title = (
    <View
      style={styles.titleContainerViewStyle}
      testID={`txt_RecoveryEmailModalHeader`}
    >
      <Heading level={2}>{recoveryEmailModalContent.titleText}</Heading>
    </View>
  );

  const onPrimaryButtonPressHandler = () => {
    const isValid = isEmailValid(inputValue);
    setShowEmailError(!isValid);
    if (isValid) {
      addEmailAction(inputValue, navigation);
      onChangeModalType('recoveryEmailSuccessModal');
    }
  };

  const onTextInputChangeHandler = (value: string) => {
    setInputValue(value);
    setPrimaryButtonEnabled(value.length > 2);
  };

  const textInput = (
    <View
      style={
        showEmailError
          ? styles.textFieldsErrorViewStyle
          : styles.textFieldsViewStyle
      }
      testID={`txt_${recoveryEmailModalContent.emailPlaceHolder}`}
    >
      <PrimaryTextInput
        textContentType='emailAddress'
        placeholder={recoveryEmailModalContent.emailPlaceHolder}
        onChangeText={onTextInputChangeHandler}
        defaultValue={inputValue}
        testID='recoveryEmailModalEmailAddress'
      />
    </View>
  );

  const error = showEmailError ? (
    <View style={styles.errorViewStyle} testID={`txt_PopupModalError`}>
      <BaseText style={styles.errorTextStyle}>
        {recoveryEmailModalContent.emailError}
      </BaseText>
    </View>
  ) : undefined;

  return (
    <>
      {title}
      <View style={styles.contentContainerViewStyle}>
        <MarkdownText>{recoveryEmailModalContent.mainText}</MarkdownText>
      </View>
      {textInput}
      {error}
      <BaseButton
        disabled={!primaryButtonEnabled}
        onPress={onPrimaryButtonPressHandler}
        testID='recoveryEmailModalAddEmailButton'
      >
        {recoveryEmailModalContent.buttonText}
      </BaseButton>
    </>
  );
};

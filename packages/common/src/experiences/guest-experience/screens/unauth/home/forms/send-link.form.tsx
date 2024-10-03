// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { sendLinkFormStyles } from './send-link.form.styles';
import { View, ViewStyle, StyleProp } from 'react-native';
import { PhoneMaskInput } from '../../../../../../components/inputs/masked/phone/phone.mask.input';
import { BaseButton } from '../../../../../../components/buttons/base/base.button';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { InlineLink } from '../../../../../../components/member/links/inline/inline.link';

export interface ISendLinkFromProps {
  onSendRegistrationTextRequest?: (phoneNumber: string) => void;
  textSent?: boolean;
  userNumber?: string;
  viewStyle?: StyleProp<ViewStyle>;
  isSkeleton?: boolean;
  sendLinkLabel?: string;
  getLinkLabel?: string;
  resendLinkLabel?: string;
}

export const SendLinkForm = ({
  onSendRegistrationTextRequest,
  textSent,
  userNumber,
  viewStyle,
  isSkeleton,
  sendLinkLabel,
  getLinkLabel,
  resendLinkLabel,
}: ISendLinkFromProps): React.ReactElement => {
  const [phoneNumber, setPhoneNumber] = useState<string>(userNumber ?? '');
  const onButtonPressed = () => {
    if (onSendRegistrationTextRequest) {
      onSendRegistrationTextRequest(phoneNumber);
    }
  };

  const onPhoneNumberChange = (phone: string) => {
    setPhoneNumber(phone);
  };
  const isButtonDisabled = phoneNumber.length < 10;
  useEffect(() => {
    if (userNumber && userNumber !== '') {
      setPhoneNumber(userNumber);
    }
  }, [userNumber]);

  return !textSent ? (
    <View style={[sendLinkFormStyles.containerViewStyle, viewStyle]}>
      <PhoneMaskInput
        phoneNumber={phoneNumber}
        onPhoneNumberChange={onPhoneNumberChange}
        viewStyle={sendLinkFormStyles.phoneInputViewStyle}
      />
      <BaseButton
        disabled={isButtonDisabled}
        viewStyle={sendLinkFormStyles.sendLinkButtonViewStyle}
        onPress={onButtonPressed}
        size='medium'
        isSkeleton={isSkeleton}
        skeletonWidth='medium'
      >
        {sendLinkLabel}
      </BaseButton>
    </View>
  ) : (
    <BaseText
      style={sendLinkFormStyles.getALinkTextStyle}
      isSkeleton={isSkeleton}
      skeletonWidth='medium'
    >
      {getLinkLabel}{' '}
      <InlineLink onPress={onButtonPressed}>{resendLinkLabel}</InlineLink>
    </BaseText>
  );
};

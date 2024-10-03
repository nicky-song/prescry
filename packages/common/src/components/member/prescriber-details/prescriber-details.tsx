// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { BaseButton } from '../../buttons/base/base.button';
import { formatPhoneNumber } from '../../../utils/formatters/phone-number.formatter';
import { prescriberDetailsStyle } from './prescriber-details.style';
import { Heading } from '../heading/heading';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IOrderConfirmationScreenContent } from '../../../experiences/guest-experience/screens/order-confirmation-screen/order-confirmation.screen.content';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
export interface IPrescriberDetailsProps {
  doctorContactNumber: string;
  doctorName: string;
}

export interface IPrescriberDetailsActionProps {
  callToDoctor: (phoneNumber: string) => void;
}

export const PrescriberDetails = (
  props: IPrescriberDetailsProps & IPrescriberDetailsActionProps
) => {
  const { doctorContactNumber, doctorName } = props;
  const callDoctor = () => {
    props.callToDoctor(props.doctorContactNumber);
  };
  const groupKey = CmsGroupKey.orderConfirmation;

  const { content, isContentLoading } =
    useContent<IOrderConfirmationScreenContent>(groupKey, 2);

  return (
    <View>
      <Heading
        level={3}
        textStyle={prescriberDetailsStyle.prescriberText}
        isSkeleton={isContentLoading}
        skeletonWidth='long'
      >
        {content.prescriberInfoTitle}
      </Heading>
      <ProtectedBaseText
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {doctorName}
      </ProtectedBaseText>

      <BaseButton
        viewStyle={prescriberDetailsStyle.callButtonView}
        textStyle={prescriberDetailsStyle.doctorContactText}
        isSkeleton={isContentLoading}
        onPress={callDoctor}
      >
        {formatPhoneNumber(doctorContactNumber)}
      </BaseButton>
    </View>
  );
};

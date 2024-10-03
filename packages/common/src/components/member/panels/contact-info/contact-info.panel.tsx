// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import { formatPhoneNumber } from '../../../../utils/formatters/phone-number.formatter';
import { callPhoneNumber, goToUrl } from '../../../../utils/link.helper';
import { ProtectedView } from '../../../containers/protected-view/protected-view';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';
import { Heading } from '../../heading/heading';
import { InlineLink } from '../../links/inline/inline.link';
import { contactInfoPanelStyles } from './contact-info.panel.styles';

export interface IContactInfoPanelProps {
  title: string;
  email: string;
  phoneNumber?: string;
  viewStyle?: StyleProp<ViewStyle>;
}

export const ContactInfoPanel = ({
  title,
  email,
  phoneNumber,
  viewStyle,
}: IContactInfoPanelProps): ReactElement => {
  const onPhonePress = async () => {
    if (phoneNumber) {
      await callPhoneNumber(phoneNumber);
    }
  };

  const phoneContent = phoneNumber ? (
    <ProtectedView
      style={contactInfoPanelStyles.rowViewStyle}
      testID='phoneContent'
    >
      <FontAwesomeIcon
        name='phone-alt'
        style={contactInfoPanelStyles.iconTextStyle}
        size={16}
      />
      <InlineLink
        textStyle={contactInfoPanelStyles.linkTextStyle}
        onPress={onPhonePress}
        testID='contactInfoPanelPhoneNumberInlineLink'
      >
        {formatPhoneNumber(phoneNumber)}
      </InlineLink>
    </ProtectedView>
  ) : null;

  const onEmailPress = async () => {
    await goToUrl(`mailto:${email}`);
  };

  const supportEmailContent = (
    <ProtectedView
      style={contactInfoPanelStyles.rowViewStyle}
      testID='supportEmailContent'
    >
      <FontAwesomeIcon
        name='envelope'
        style={contactInfoPanelStyles.iconTextStyle}
        size={16}
      />
      <InlineLink
        textStyle={contactInfoPanelStyles.linkTextStyle}
        onPress={onEmailPress}
      >
        {email}
      </InlineLink>
    </ProtectedView>
  );

  const titleWithSpace = [title, ' '];

  return (
    <View style={viewStyle} testID='ContactInfoPanel'>
      <Heading level={2}>{titleWithSpace}</Heading>
      {phoneContent}
      {supportEmailContent}
    </View>
  );
};

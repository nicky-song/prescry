// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { contactDoctorContainerStyles } from './contact-doctor-container.styles';
import { BaseText } from '../../text/base-text/base-text';
import { BaseButton } from '../../buttons/base/base.button';
import { callPhoneNumber } from '../../../utils/link.helper';
import { GrayScaleColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { Heading } from '../heading/heading';
import { useContactDoctorContainerCobrandingContentHelper } from './contact-doctor-container.cobranding-content-helper';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';

export interface IContactDoctorContainerProps {
  doctorName?: string;
  phoneNumber?: string;
  viewStyle?: StyleProp<ViewStyle>;
}

export const ContactDoctorContainer = ({
  doctorName,
  phoneNumber,
  viewStyle,
}: IContactDoctorContainerProps): ReactElement => {
  const { content, isContentLoading, isCobranding } =
    useContactDoctorContainerCobrandingContentHelper();

  const onCallButtonPress = () => {
    if (isCobranding && content.switchYourMedsPhoneNumber)
      callPhoneNumber(content.switchYourMedsPhoneNumber);
    else if (!isCobranding && phoneNumber) callPhoneNumber(phoneNumber);
  };

  const showCallDoctor = doctorName && phoneNumber;

  const showCallDoctorCobranding =
    isCobranding &&
    content.switchYourMedsProviderName &&
    content.switchYourMedsPhoneNumber;

  const doctorNameText = (showCallDoctor || showCallDoctorCobranding) && (
    <ProtectedBaseText
      weight='semiBold'
      style={contactDoctorContainerStyles.doctorNameTextStyle}
      isSkeleton={isContentLoading}
      skeletonWidth='medium'
    >
      {isCobranding ? content.switchYourMedsProviderName : doctorName}
    </ProtectedBaseText>
  );

  const callButton = (showCallDoctor || showCallDoctorCobranding) && (
    <BaseButton
      onPress={onCallButtonPress}
      isSkeleton={isContentLoading}
      viewStyle={contactDoctorContainerStyles.callButtonViewStyle}
      skeletonWidth='medium'
      testID='contactDoctorCallNowButton'
    >
      <FontAwesomeIcon
        name='phone-alt'
        color={GrayScaleColor.white}
        size={IconSize.regular}
        style={contactDoctorContainerStyles.callIconViewStyle}
      />
      {content.callNowButtonLabel}
    </BaseButton>
  );

  return (
    <View style={viewStyle} testID='contactDoctorContainer'>
      <Heading isSkeleton={isContentLoading} level={2} skeletonWidth='medium'>
        {content.switchYourMedsTitle}
      </Heading>
      <BaseText
        style={contactDoctorContainerStyles.descriptionTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.switchYourMedsDescription}
      </BaseText>
      {doctorNameText}
      {callButton}
    </View>
  );
};

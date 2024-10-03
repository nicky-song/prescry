// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { SecondaryButton } from '../../../components/buttons/secondary/secondary.button';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import { waitlistConfirmationScreenContent } from './waitlist-confirmation-screen.content';
import { WaitlistConfirmationScreenStyle } from './waitlist-confirmation-screen.style';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import {
  AppointmentsStackNavigationProp,
  WaitlistConfirmationRouteProp,
} from '../navigation/stack-navigators/appointments/appointments.stack-navigator';
import { useNavigation, useRoute } from '@react-navigation/native';
import { resetStackToHome } from '../store/navigation/navigation-reducer.actions';
import { HomeButton } from '../../../components/buttons/home/home.button';
import { ProtectedBaseText } from '../../../components/text/protected-base-text/protected-base-text';
import { TranslatableBaseText } from '../../../components/text/translated-base-text/translatable-base-text';
import { View } from 'react-native';

export interface IWaitlistConfirmationRouteProps {
  serviceType: string;
  phoneNumber: string;
  patientFirstName: string;
  patientLastName: string;
  serviceName: string;
}

export const WaitlistConfirmationScreen = () => {
  const navigation = useNavigation<AppointmentsStackNavigationProp>();
  const { params } = useRoute<WaitlistConfirmationRouteProp>();
  const { phoneNumber, patientFirstName, patientLastName, serviceName } =
    params;
  const {
    addAnotherPersonLabel,
    confirmationTitle,
    confirmationSegment1Text,
    confirmationSegment2Text,
    confirmationSegment3Text,
    confirmationSegment4Text,
    confirmationSegment5Text,
    confirmationSegment6Text,
  } = waitlistConfirmationScreenContent;

  const {
    secondaryButtonViewStyle,
    primaryButtonViewStyle,
    formattedConfirmationParagraphSpacerViewStyle,
    formattedConfirmationTextViewStyle,
    confirmationSegmentTextBoldWeight,
  } = WaitlistConfirmationScreenStyle;

  const addDashesToPhoneNumber = (phoneNumber: string): string => {
    const phoneNumberWithoutAreaCode = phoneNumber.slice(
      phoneNumber.length - 10
    );
    return `${phoneNumberWithoutAreaCode.slice(
      0,
      3
    )}-${phoneNumberWithoutAreaCode.slice(
      3,
      6
    )}-${phoneNumberWithoutAreaCode.slice(6)}`;
  };

  const onAddAnotherPersonButtonPressed = () => {
    navigation.navigate('JoinWaitlist', {});
  };

  const navigateToHome = () => {
    resetStackToHome(navigation, {});
  };

  function renderBody() {
    return (
      <BodyContentContainer
        title={confirmationTitle}
        testID={'waitlistConfirmationScreen'}
      >
        <View
          style={[
            formattedConfirmationParagraphSpacerViewStyle,
            formattedConfirmationTextViewStyle,
          ]}
        >
          <TranslatableBaseText>
            {confirmationSegment1Text}
            <ProtectedBaseText style={confirmationSegmentTextBoldWeight}>
              {StringFormatter.trimAndConvertToNameCase(patientFirstName) +
                ' ' +
                StringFormatter.trimAndConvertToNameCase(patientLastName)}
              <TranslatableBaseText>
                {confirmationSegment2Text}
                <ProtectedBaseText style={confirmationSegmentTextBoldWeight}>
                  {addDashesToPhoneNumber(phoneNumber)}
                  <TranslatableBaseText>
                    {confirmationSegment3Text}
                    <ProtectedBaseText
                      style={confirmationSegmentTextBoldWeight}
                    >
                      {serviceName}
                      <TranslatableBaseText>
                        {confirmationSegment4Text}
                      </TranslatableBaseText>
                    </ProtectedBaseText>
                  </TranslatableBaseText>
                </ProtectedBaseText>
              </TranslatableBaseText>
            </ProtectedBaseText>
          </TranslatableBaseText>
        </View>
        <View style={formattedConfirmationTextViewStyle}>
          <TranslatableBaseText>
            {confirmationSegment5Text}
            <ProtectedBaseText>
              {StringFormatter.trimAndConvertToNameCase(patientFirstName)}
              <TranslatableBaseText>
                {confirmationSegment6Text}
              </TranslatableBaseText>
            </ProtectedBaseText>
          </TranslatableBaseText>
        </View>
        <SecondaryButton
          disabled={false}
          viewStyle={secondaryButtonViewStyle}
          onPress={onAddAnotherPersonButtonPressed}
        >
          {addAnotherPersonLabel}
        </SecondaryButton>
        <HomeButton
          disabled={false}
          onPress={navigateToHome}
          viewStyle={primaryButtonViewStyle}
        />
      </BodyContentContainer>
    );
  }

  return (
    <BasicPageConnected
      showProfileAvatar={true}
      hideNavigationMenuButton={false}
      body={renderBody()}
      translateContent={true}
    />
  );
};

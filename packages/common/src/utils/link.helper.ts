// Copyright 2018 Prescryptive Health, Inc.

import { Platform } from 'react-native';
import * as Linking from 'expo-linking';

export const goToUrl = async (url: string) => {
  if (Platform.OS === 'web') {
    window.open(url, '_blank');
    return;
  }

  const canOpenURL = await Linking.canOpenURL(url);
  if (canOpenURL) {
    await Linking.openURL(url);
  }
};

export const callPhoneNumber = async (phoneNumber: string) => {
  const phoneNumberWithScheme = `tel:${phoneNumber}`;

  const canOpenURL = await Linking.canOpenURL(phoneNumberWithScheme);
  if (canOpenURL) {
    await Linking.openURL(phoneNumberWithScheme);
  }
};

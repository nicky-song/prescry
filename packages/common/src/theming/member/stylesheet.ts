// Copyright 2020 Prescryptive Health, Inc.

import { StyleSheet } from 'react-native';
import { customPinKeypadStyle } from './custom-pin-keypad.style';
import { customPinStyle } from './custom-pin.style';
import { homeFeedItemStyle } from './home-feed-item/home-feed-item.style';

/**
 * @deprecated Use local **.styles** file instead of global **stylesheet**
 */
export const stylesheet = StyleSheet.create({
  ...customPinKeypadStyle,
  ...customPinStyle,
  ...homeFeedItemStyle,
});

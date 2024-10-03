// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import { ViewStyle, TextStyle } from 'react-native';
import {
  offerDeliveryInfoStyles,
  IOfferDeliveryInfoStyles,
} from './offer-delivery-info.style';

describe('offerDeliveryInfoStyles', () => {
  it('has expected styles', () => {
    const phoneContainerViewStyle: ViewStyle = {
      flexDirection: 'row',
      marginTop: Spacing.base,
      alignItems: 'center',
    };

    const titleTextStyle: TextStyle = { marginBottom: Spacing.base };

    const pharmacyInfoViewStyle: ViewStyle = { marginTop: Spacing.base };

    const expectedStyle: IOfferDeliveryInfoStyles = {
      pharmacyInfoViewStyle,
      phoneContainerViewStyle,
      titleTextStyle,
    };

    expect(offerDeliveryInfoStyles).toEqual(expectedStyle);
  });
});

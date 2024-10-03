// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { pharmacyInformationStyle } from './pharmacy-information.style';
const containerView: ViewStyle = { padding: '20px' };

describe('pharmacyHoursListstyles', () => {
  it('should have expected styles', () => {
    expect(pharmacyInformationStyle.containerView).toEqual(containerView);
  });
});

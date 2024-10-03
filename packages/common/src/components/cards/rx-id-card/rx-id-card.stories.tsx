// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { Story } from '@storybook/react';
import { RxIdCard, IRxIdCardProps } from './rx-id-card';
import { Spacing } from '../../../theming/spacing';
import {
  IPrimaryProfile,
  RxGroupTypesEnum,
} from '../../../models/member-profile/member-profile-info';

export default {
  title: 'Cards/RxIdCard',
  component: RxIdCard,
};

const profile: IPrimaryProfile = {
  firstName: 'Jackson',
  lastName: 'McCluskey',
  dateOfBirth: '01-01-2000',
  identifier: '123456789',
  phoneNumber: '1112223333',
  primaryMemberRxId: 'T12345678901',
  primaryMemberFamilyId: 'T123456789',
  primaryMemberPersonCode: '01',
  rxGroupType: RxGroupTypesEnum.SIE,
  rxGroup: 'HMA01',
  rxSubGroup: '',
  rxBin: '610749',
  carrierPCN: 'PH',
};

const ArgsWrapper: Story<IRxIdCardProps> = (args) => (
  <View
    style={{
      marginLeft: Spacing.times1pt5,
      marginRight: Spacing.times1pt5,
      marginTop: Spacing.times1pt25,
      marginBottom: Spacing.times2,
    }}
  >
    <RxIdCard {...args} />
  </View>
);

export const DefaultPBM = ArgsWrapper.bind({});
DefaultPBM.args = {
  profile: { ...profile },
  rxCardType: 'pbm',
};

export const DefaultSmartPrice = ArgsWrapper.bind({});
DefaultSmartPrice.args = {
  profile: { ...profile },
  rxCardType: 'smartPrice',
};

export const CobrandingPBM = ArgsWrapper.bind({});
CobrandingPBM.args = {
  profile: { ...profile, rxGroup: 'COB01', brokerAssociation: '1002G52' },
  rxCardType: 'pbm',
};

export const CobrandingSmartPrice = ArgsWrapper.bind({});
CobrandingSmartPrice.args = {
  profile: { ...profile, rxGroup: 'COB01', brokerAssociation: '1002G52' },
  rxCardType: 'smartPrice',
};

export const UnauthSmartPrice = ArgsWrapper.bind({});
UnauthSmartPrice.args = {
  profile: {
    ...profile,
    firstName: '',
    lastName: '',
    primaryMemberRxId: '',
    primaryMemberFamilyId: '',
  },
  rxCardType: 'smartPrice',
};

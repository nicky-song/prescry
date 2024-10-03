// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { Story } from '@storybook/react';
import { RxCardCarousel, IRxCardCarouselProps } from './rx-card.carousel';
import { Spacing } from '../../../theming/spacing';
import {
  IPrimaryProfile,
  RxGroupTypesEnum,
} from '../../../models/member-profile/member-profile-info';

export default {
  title: 'Carousels/RxCardCarousel',
  component: RxCardCarousel,
  argTypes: { 
    onSelect: { action: 'selected' }
  },
};

const profile: IPrimaryProfile = {
  firstName: 'Ting',
  lastName: 'Chang',
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

const ArgsWrapper: Story<IRxCardCarouselProps> = (args) => (
  <View
    style={{
      marginLeft: Spacing.times1pt5,
      marginRight: Spacing.times1pt5,
      marginTop: Spacing.times1pt25,
      marginBottom: Spacing.times2,
    }}
  >
    <RxCardCarousel {...args} />
  </View>
);

export const OneCard = ArgsWrapper.bind({});
OneCard.args = {
  profile: { ...profile },
  cards: ['pbm'],
};

export const TwoCards = ArgsWrapper.bind({});
TwoCards.args = {
  profile: { ...profile },
  cards: ['pbm', 'smartPrice'],
};

// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  ISmartPriceRxIdCardSectionProps,
  SmartPriceRxIdCardSection,
} from './smart-price-rx-id-card.section';
import { RxGroupTypesEnum } from '../../../models/member-profile/member-profile-info';

export default {
  title: 'Member/SmartPriceRxIdCardSection',
  component: SmartPriceRxIdCardSection,
};

const ArgsWrapper: Story<ISmartPriceRxIdCardSectionProps> = (args) => (
  <SmartPriceRxIdCardSection {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  profile: {
    firstName: 'Klein',
    lastName: 'Claire',
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
  },
};

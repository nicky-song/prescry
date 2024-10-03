// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  OfferDeliveryInfo,
  IOfferDeliveryInfoProps,
} from './offer-delivery-info';

export default {
  title: 'Offer/OfferDeliveryInfo',
  component: OfferDeliveryInfo,
  args: {},
};

const ArgsWrapper: Story<IOfferDeliveryInfoProps> = (args) => (
  <OfferDeliveryInfo {...args} />
);

export const Default = ArgsWrapper.bind({});

Default.args = {
  pharmacyName: 'PREMIER PHARMACY',
  phoneNumber: '4258815854',
};

export const NoPhone = ArgsWrapper.bind({ pharmacyName: 'PREMIER PHARMACY' });
NoPhone.storyName = 'No phone';
NoPhone.args = {
  pharmacyName: 'PREMIER PHARMACY',
};

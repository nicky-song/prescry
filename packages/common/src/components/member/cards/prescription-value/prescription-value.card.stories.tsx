// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  PrescriptionValueCard,
  IPrescriptionValueCardProps,
} from './prescription-value.card';
import { IAddress } from '../../../../models/address';

export default {
  title: 'Cards/PrescriptionValueCard',
  component: PrescriptionValueCard,
  args: {},
};

const ArgsWrapper: Story<IPrescriptionValueCardProps> = (args) => (
  <PrescriptionValueCard {...args} />
);

const address: IAddress = {
  city: 'Seattle',
  lineOne: '2607 Denny Way',
  zip: '1234',
  state: 'WA',
};

export const Regular = ArgsWrapper.bind({});
Regular.args = {
  distance: 4.8,
  pharmacyName: 'VALUE DRUG MART',
  serviceStatus: 'Open till 8:30 pm',
  priceYouPay: 35,
  pricePlanPays: 3165,
  address,
};

export const BestValue = ArgsWrapper.bind({});
BestValue.storyName = 'Best value';
BestValue.args = {
  distance: 4.8,
  pharmacyName: 'VALUE DRUG MART',
  serviceStatus: 'Open till 8:30 pm',
  priceYouPay: 35,
  pricePlanPays: 3165,
  isBestValue: true,
  address,
};

export const NoPrices = ArgsWrapper.bind({});
NoPrices.storyName = 'No prices';
NoPrices.args = {
  distance: 4.8,
  pharmacyName: 'VALUE DRUG MART',
  serviceStatus: 'Open till 8:30 pm',
  address,
};

export const NoAuthorized = ArgsWrapper.bind({});
NoAuthorized.args = {
  distance: 4.8,
  pharmacyName: 'VALUE DRUG MART',
  serviceStatus: 'Open till 8:30 pm',
  address,
};

export const Address = ArgsWrapper.bind({});
Address.args = {
  distance: 4.8,
  pharmacyName: 'VALUE DRUG MART',
  serviceStatus: 'Open till 8:30 pm',
  address,
};

export const HasCoupon = ArgsWrapper.bind({});
HasCoupon.storyName = 'Has coupon';
HasCoupon.args = {
  distance: 4.8,
  pharmacyName: 'VALUE DRUG MART',
  serviceStatus: 'Open till 8:30 pm',
  address,
  hasCoupon: true,
  priceYouPay: 28,
  pricePlanPays: 1000,
};

export const UndefinedPrices = ArgsWrapper.bind({});
UndefinedPrices.storyName = 'Undefined prices';
UndefinedPrices.args = {
  distance: 4.8,
  pharmacyName: 'VALUE DRUG MART',
  serviceStatus: 'Open till 8:30 pm',
  address,
  hasCoupon: true,
  priceYouPay: undefined,
  pricePlanPays: undefined,
};

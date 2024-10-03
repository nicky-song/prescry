// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  PrescriptionPharmacyInfo,
  IPrescriptionPharmacyInfoProps,
} from './prescription-pharmacy-info';

export default {
  title: 'Shopping/PrescriptionPharmacyInfo',
  component: PrescriptionPharmacyInfo,
  args: {},
};

const ArgsWrapper: Story<IPrescriptionPharmacyInfoProps> = (args) => (
  <PrescriptionPharmacyInfo {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  pharmacyAddress1: '2607 Denny Way',
  pharmacyCity: 'Seattle',
  pharmacyState: 'WA',
  pharmacyZipCode: '98101',
  phoneNumber: '4258815854',
  title: 'Value Drug Mart',
  pharmacyWebsite: {
    label: 'Value Drug Mart',
    url: 'https://somewhere.com',
  },
};

export const WithOpenStatus = ArgsWrapper.bind({});
WithOpenStatus.storyName = 'With open status';
WithOpenStatus.args = {
  pharmacyAddress1: '2607 Denny Way',
  pharmacyCity: 'Seattle',
  pharmacyState: 'WA',
  pharmacyZipCode: '98101',
  phoneNumber: '4258815854',
  title: 'Value Drug Mart',
};

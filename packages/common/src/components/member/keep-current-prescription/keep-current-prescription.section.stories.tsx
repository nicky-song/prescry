// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  KeepCurrentPrescriptionSection,
  IKeepCurrentPrescriptionSectionProps,
} from './keep-current-prescription.section';

export default {
  title: 'Prescription/KeepCurrentPrescriptionSection',
  component: KeepCurrentPrescriptionSection,
};

const ArgsWrapper: Story<IKeepCurrentPrescriptionSectionProps> = (args) => (
  <KeepCurrentPrescriptionSection {...args} />
);

export const Default = ArgsWrapper.bind({});

const pharmacyHoursMock = new Map([
  ['Sunday', '7:00 am to 9:00 pm'],
  ['Monday', '7:00 am to 9:00 pm'],
  ['Tuesday', '7:00 am to 9:00 pm'],
  ['Wednesday', '7:00 am to 9:00 pm'],
  ['Thursday', '7:00 am to 9:00 pm'],
  ['Friday', '7:00 am to 9:00 pm'],
  ['Saturday', '7:00 am to 9:00 pm'],
]);

Default.args = {
  pharmacyName: 'Jacksons Pharmacy',
  pharmacyNcpdp: '12345',
  pharmacyAddress1: '777 Pharmacy Ave.',
  pharmacyCity: 'Redmond',
  pharmacyState: 'WA',
  pharmacyZipCode: '98052',
  pharmacyHours: pharmacyHoursMock,
  pharmacyPhoneNumber: '+12223334444',
  onKeepCurrentPrescriptionPress: () => true,
};

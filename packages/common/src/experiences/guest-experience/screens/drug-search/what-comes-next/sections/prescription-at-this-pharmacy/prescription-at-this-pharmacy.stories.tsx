// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  PrescriptionAtThisPharmacySection,
  IPrescriptionAtThisPharmacySectionProps,
} from './prescription-at-this-pharmacy.section';

export default {
  title: 'Drug Search/WhatComesNext/PrescriptionAtThisPharmacySection',
  component: PrescriptionAtThisPharmacySection,
  argTypes: { onSignUpPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IPrescriptionAtThisPharmacySectionProps> = (args) => (
  <PrescriptionAtThisPharmacySection {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};

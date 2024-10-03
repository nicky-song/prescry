// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  PrescriptionPriceSection,
  IPrescriptionPriceSectionProps,
} from './prescription-price.section';

export default {
  title: 'Member/PrescriptionPriceSection',
  component: PrescriptionPriceSection,
  args: { assistanceProgram: true },
};

const ArgsWrapper: Story<IPrescriptionPriceSectionProps> = (args) => (
  <PrescriptionPriceSection {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};

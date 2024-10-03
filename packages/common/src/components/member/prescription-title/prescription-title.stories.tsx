// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  PrescriptionTitle,
  IPrescriptionTitleProps,
} from './prescription-title';

export default {
  title: 'Prescription/PrescriptionTitle',
  component: PrescriptionTitle,
  args: {},
};

const ArgsWrapper: Story<IPrescriptionTitleProps> = (args) => (
  <PrescriptionTitle {...args} />
);

export const NoLink = ArgsWrapper.bind({});
NoLink.storyName = 'No link';
NoLink.args = {
  productName: 'Drug Mart Unilet Lancets 28G (Lancets)',
  quantity: 3,
  refills: 1,
  formCode: 'Misc',
};

export const WithLink = ArgsWrapper.bind({});
WithLink.storyName = 'With link';
WithLink.args = {
  productName: 'LiProZonePak (Lidocaine-Prilocaine)',
  strength: '1.5-1.5',
  quantity: 3,
  refills: 1,
  formCode: 'Kit',
  unit: '%',
  infoLink: 'https://www.prescryptive.com',
};

export const NoSeparator = ArgsWrapper.bind({});
NoSeparator.storyName = 'No separtor line';
NoSeparator.args = {
  productName: 'LiProZonePak (Lidocaine-Prilocaine)',
  strength: '1.5-1.5',
  quantity: 3,
  refills: 1,
  formCode: 'Kit',
  unit: '%',
  infoLink: 'https://www.prescryptive.com',
  hideSeparator: true,
};

export const NoStrength = ArgsWrapper.bind({});
NoStrength.storyName = 'No strength';
NoStrength.args = {
  productName: 'Basaglar',
  quantity: 3,
  refills: 1,
  formCode: 'TAB',
};

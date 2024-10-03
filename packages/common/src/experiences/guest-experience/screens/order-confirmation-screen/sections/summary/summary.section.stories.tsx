// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { ISummarySectionProps, SummarySection } from './summary.section';

export default {
  title: 'Shopping/Confirmation/Sections/SummarySection',
  component: SummarySection,
};

const ArgsWrapper: Story<ISummarySectionProps> = (args) => (
  <SummarySection {...args} />
);

export const Default = ArgsWrapper.bind({});

Default.args = {
  orderDate: new Date(),
  orderNumber: '12345-6',
  pricePlanPays: 50,
  priceYouPay: 4,
};

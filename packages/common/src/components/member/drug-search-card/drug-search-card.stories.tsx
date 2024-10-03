// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { IDrugSearchCardProps, DrugSearchCard } from './drug-search-card';

export default {
  title: 'Cards/DrugSearchCard',
  component: DrugSearchCard,
  argTypes: { onSearchPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IDrugSearchCardProps> = (args) => (
  <DrugSearchCard {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  title: 'Take control',
  subtitle:
    'Save up to 80% on prescriptions, book clinical services, and do more for your health.',
};

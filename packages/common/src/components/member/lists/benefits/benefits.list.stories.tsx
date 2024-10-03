// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { BenefitsList, IBenefitsListProps } from './benefits.list';

export default {
  title: 'Lists/BenefitsList',
  component: BenefitsList,
};

const ArgsWrapper: Story<IBenefitsListProps> = (args) => (
  <BenefitsList {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};

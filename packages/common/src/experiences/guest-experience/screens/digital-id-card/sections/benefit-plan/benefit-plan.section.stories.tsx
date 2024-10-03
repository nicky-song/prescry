// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  BenefitPlanSection,
  IBenefitPlanSectionProps,
} from './benefit-plan.section';

export default {
  title: 'Sections/BenefitPlanSection',
  component: BenefitPlanSection,
  argTypes: { onLearnMorePress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IBenefitPlanSectionProps> = (args) => (
  <BenefitPlanSection {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};

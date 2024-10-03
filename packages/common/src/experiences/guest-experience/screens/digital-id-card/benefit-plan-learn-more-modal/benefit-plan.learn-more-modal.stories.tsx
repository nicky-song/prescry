// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  BenefitPlanLearnMoreModal,
  IBenefitPlanLearnMoreModalProps,
} from './benefit-plan.learn-more-modal';

export default {
  title: 'Modals/BenefitPlanLearnMoreModal',
  component: BenefitPlanLearnMoreModal,
};

const ArgsWrapper: Story<IBenefitPlanLearnMoreModalProps> = (args) => (
  <BenefitPlanLearnMoreModal {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};

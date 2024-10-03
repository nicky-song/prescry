// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  ClaimReversalSlideUpModal,
  IClaimReversalSlideUpModalProps,
} from './claim-reversal.slide-up-modal';

export default {
  title: 'Modals/ClaimReversalSlideUpModal',
  component: ClaimReversalSlideUpModal,
};

const ArgsWrapper: Story<IClaimReversalSlideUpModalProps> = (args) => (
  <ClaimReversalSlideUpModal {...args} />
);

export const Default = ArgsWrapper.bind({});

Default.args = {};

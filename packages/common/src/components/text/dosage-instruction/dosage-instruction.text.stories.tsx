// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  DosageInstructionText,
  IDosageInstructionTextProps,
} from './dosage-instruction.text';

export default {
  title: 'Text/DosageInstructionText',
  component: DosageInstructionText,
};

const ArgsWrapper: Story<IDosageInstructionTextProps> = (args) => (
  <DosageInstructionText {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  instruction: 'Sample dosage instruction',
};

export const WithWrapping = ArgsWrapper.bind({});
WithWrapping.args = {
  instruction:
    'Sample dosage instruction that is long enough to go to another line.',
};

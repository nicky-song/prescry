// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  AttestAuthorizationCheckbox,
  IAttestAuthorizationCheckboxProps,
} from './attest-authorization.checkbox';

export default {
  title: 'Checkboxes/AttestAuthorizationCheckbox',
  component: AttestAuthorizationCheckbox,
  argTypes: { onPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IAttestAuthorizationCheckboxProps> = (args) => (
  <AttestAuthorizationCheckbox {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};

// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  IInsuranceInformationProps,
  InsuranceInformation,
} from './insurance-information';

export default {
  title: 'Member/InsuranceInformation',
  component: InsuranceInformation,
  argTypes: { insuranceInformationChanged: { action: 'changed' } },
};

const ArgsWrapper: Story<IInsuranceInformationProps> = (
  args: IInsuranceInformationProps
) => <InsuranceInformation {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = { answer: '' };

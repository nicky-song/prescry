// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { PharmacyGroup, IPharmacyGroupProps } from './pharmacy-group';
import { pharmacyInfoListMock } from '../../../experiences/guest-experience/__mocks__/pharmacy-info.mock';

export default {
  title: 'Groups/PharmacyGroup',
  component: PharmacyGroup,
  argTypes: { onPharmacyPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IPharmacyGroupProps> = (args) => (
  <PharmacyGroup {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  pharmacyInfoList: pharmacyInfoListMock,
};

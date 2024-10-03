// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { PrescriptionCard, IPrescriptionCardProps } from './prescription.card';
import { IPrescriptionInfo } from '../../../../models/prescription-info';
import { List } from '../../../primitives/list';

export default {
  title: 'Cards/PrescriptionCard',
  component: PrescriptionCard,
  argTypes: { onButtonPress: { action: 'pressed' } },
};

const prescriptionMock: Partial<IPrescriptionInfo> = {
  drugName: 'QUININE SULFATE 324MG CAP',
  strength: '324',
  unit: 'MG',
  quantity: 60,
  form: 'CAPS',
  refills: 1,
  dosageInstruction: 'TAKE DAILY OR UNTIL SYMPTOMS DISAPPEAR',
};

const ArgsWrapper: Story<IPrescriptionCardProps> = (args) => (
  <List>
    <PrescriptionCard {...args} />
  </List>
);

export const New = ArgsWrapper.bind({});
New.args = {
  prescription: {
    ...prescriptionMock,
    organizationId: undefined,
  } as IPrescriptionInfo,
};

export const Sent = ArgsWrapper.bind({});
Sent.args = {
  prescription: {
    ...prescriptionMock,
    organizationId: 'pharmacy',
  } as IPrescriptionInfo,
};

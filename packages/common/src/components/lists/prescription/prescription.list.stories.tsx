// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { PrescriptionList, IPrescriptionListProps } from './prescription.list';
import { IPrescriptionInfo } from '../../../models/prescription-info';

export default {
  title: 'Lists/PrescriptionList',
  component: PrescriptionList,
  argTypes: {
    onPrescriptionSelect: { action: 'prescription selected' },
  },
};

const prescription1Mock: Partial<IPrescriptionInfo> = {
  prescriptionId: '1',
  drugName: 'QUININE SULFATE 324MG CAP',
  strength: '324',
  unit: 'MG',
  quantity: 60,
  form: 'CAPS',
  refills: 1,
  dosageInstruction: 'TAKE DAILY OR CATCH MILARIA. YOUR CHOICE.',
};

const prescription2Mock: Partial<IPrescriptionInfo> = {
  prescriptionId: '2',
  drugName: 'AMOXICILLIN TRIHYDRATE 500MG CAP',
  strength: '500',
  unit: 'MG',
  quantity: 14,
  form: 'CAPS',
  refills: 1,
  dosageInstruction: 'TAKE DAILY UNTIL ALL CONSUMED',
  organizationId: 'pharmacy-2',
};

const prescription3Mock: Partial<IPrescriptionInfo> = {
  prescriptionId: '3',
  drugName: 'ASA/ER DIPYRID 25-200MG CAP ER',
  strength: '25-200',
  unit: 'MG',
  quantity: 36,
  form: 'CAP ER',
  refills: 2,
  authoredOn: '2022-04-27',
  dosageInstruction: 'AS NEED FOR HEART ATTACKS',
  organizationId: 'pharmacy-3',
};

const ArgsWrapper: Story<IPrescriptionListProps> = (args) => (
  <PrescriptionList {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  title: 'Sample list title',
  prescriptions: [
    prescription1Mock as IPrescriptionInfo,
    prescription2Mock as IPrescriptionInfo,
    prescription3Mock as IPrescriptionInfo,
  ],
};

export const NoTitle = ArgsWrapper.bind({});
NoTitle.args = {
  prescriptions: [
    prescription1Mock as IPrescriptionInfo,
    prescription2Mock as IPrescriptionInfo,
    prescription3Mock as IPrescriptionInfo,
  ],
};

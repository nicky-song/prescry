// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import {
  IPrescriptionDosageInfoProps,
  PrescriptionDosageInfo,
} from './prescription-dosage-info';

const prescriptionDosageInfoProps: IPrescriptionDosageInfoProps = {
  count: 40,
  dose: '2',
  form: 'capsule',
  units: 'ml',
};

describe('PrescriptionDosageInfo component', () => {
  it('should have medicine doses', () => {
    const header = renderer.create(
      <PrescriptionDosageInfo {...prescriptionDosageInfoProps} />
    );
    const props = header.root.findAllByType(Text)[1].props as {
      children: React.ReactNode[];
    };
    expect(props.children[0]).toBe(prescriptionDosageInfoProps.dose);
  });

  it('should have medicine doses unit', () => {
    const header = renderer.create(
      <PrescriptionDosageInfo {...prescriptionDosageInfoProps} />
    );

    expect(JSON.stringify(header.toJSON())).toContain(
      prescriptionDosageInfoProps.dose
    );
  });

  it('should have medicine quantity', () => {
    const header = renderer.create(
      <PrescriptionDosageInfo {...prescriptionDosageInfoProps} />
    );
    const props = header.root.findAllByType(Text)[3].props as {
      children: React.ReactNode[];
    };
    expect(props.children[0]).toBe(prescriptionDosageInfoProps.count);
  });

  it('should have medicine dose form', () => {
    const header = renderer.create(
      <PrescriptionDosageInfo {...prescriptionDosageInfoProps} />
    );

    expect(JSON.stringify(header.toJSON())).toContain(
      prescriptionDosageInfoProps.form
    );
  });

  it('should have medicine dose form unit', () => {
    const header = renderer.create(
      <PrescriptionDosageInfo {...prescriptionDosageInfoProps} />
    );

    expect(JSON.stringify(header.toJSON())).toContain(
      prescriptionDosageInfoProps.units
    );
  });
});

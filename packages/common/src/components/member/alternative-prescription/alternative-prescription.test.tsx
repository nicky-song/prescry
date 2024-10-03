// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import {
  IAlternativePrescription,
  AlternativePrescription,
} from './alternative-prescription';
import { IDrugInformation } from '../../../experiences/guest-experience/claim-alert-screen/claim-alert-screen';
import { PrescriptionTitle } from '../prescription-title/prescription-title';
import { ProtectedView } from '../../containers/protected-view/protected-view';
import { getChildren } from '../../../testing/test.helper';

const recommendationOfferRowContentProps: IAlternativePrescription = {
  count: 40,
  dose: '2',
  drugName: 'Pregablin',
  form: 'capsule',
  isScreenFocused: true,
  price: '0',
  planPays: '0',
  units: 'ml',
  medicationId: '325178',
  drugInformation: {
    drugName: 'Pregablin',
    NDC: '325178',
    externalLink: 'https://e.lilly/2FMmWRZ',
    videoImage: '',
    videoLink: 'https://e.lilly/3j6MMi1',
  } as IDrugInformation,
};

jest.mock('../prescription-title/prescription-title', () => ({
  PrescriptionTitle: () => <div />,
}));

describe('AlternativePrescription component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders prescription title', () => {
    const testRenderer = renderer.create(
      <AlternativePrescription {...recommendationOfferRowContentProps} />
    );

    const prescriptionTitleView = testRenderer.root.findAllByType(ProtectedView)[0];
    const prescriptionTitle = getChildren(prescriptionTitleView)[0];

    expect(prescriptionTitle).toBeDefined();
    expect(prescriptionTitle.type).toBe(PrescriptionTitle);
    expect(prescriptionTitle.props).toMatchObject({
      productName: recommendationOfferRowContentProps.drugName,
      strength: recommendationOfferRowContentProps.dose,
      unit: recommendationOfferRowContentProps.units,
      quantity: recommendationOfferRowContentProps.count,
      refills: 0,
      hideSeparator: true,
      infoLink:
        recommendationOfferRowContentProps.drugInformation?.externalLink,
      formCode: recommendationOfferRowContentProps.form,
    });
  });
});

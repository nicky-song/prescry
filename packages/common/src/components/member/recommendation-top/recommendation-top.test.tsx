// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { IDrugInformation } from '../../../experiences/guest-experience/claim-alert-screen/claim-alert-screen';
import { getChildren } from '../../../testing/test.helper';
import { LineSeparator } from '../line-separator/line-separator';
import { PrescriptionTitle } from '../prescription-title/prescription-title';
import {
  IRecommendationTopProps,
  RecommendationTop,
} from './recommendation-top';
import { recommendationTopStyles as styles } from './recommendation-top.styles';

jest.mock('../line-separator/line-separator', () => ({
  LineSeparator: () => <div />,
}));

const recommendationHeaderTopProps: IRecommendationTopProps = {
  count: 40,
  daysSupply: 0,
  dose: '2',
  drugName: 'Lyrica',
  form: 'capsule',
  isScreenFocused: true,
  refillCount: 0,
  rxId: 'mock-rx-20',
  units: 'ml',
  medicationId: '123456',
  drugInformation: {
    drugName: 'Lyrica',
    NDC: '123456',
    externalLink: 'www.lyrica.com',
    videoImage: '',
    videoLink: 'www.videolink.com',
  } as IDrugInformation,
};

jest.mock('../prescription-title/prescription-title', () => ({
  PrescriptionTitle: () => <div />,
}));

describe('SwapRecommendationHeaderTop component', () => {
  it('has expected Views and LineSeparator with expected styles', () => {
    const recommendationHeaderTop = renderer.create(
      <RecommendationTop {...recommendationHeaderTopProps} />
    );

    const parentView = recommendationHeaderTop.root
      .children[0] as ReactTestInstance;

    expect(parentView.type).toEqual(View);
    expect(parentView.props.style).toEqual(styles.headerTopViewStyle);
    expect(getChildren(parentView).length).toEqual(2);

    const childView = getChildren(parentView)[0];
    const lineSeparator = getChildren(parentView)[1];

    expect(childView.type).toEqual(View);
    expect(childView.props.style).toEqual(
      styles.prescriptionHeaderTopViewStyle
    );
    expect(lineSeparator.type).toEqual(LineSeparator);
    expect(lineSeparator.props.viewStyle).toEqual(
      styles.lineSeparatorViewStyle
    );
  });

  it('renders prescription Title if passed in the props', () => {
    const recommendationHeaderTop = renderer.create(
      <RecommendationTop {...recommendationHeaderTopProps} />
    );

    const prescriptionTitle =
      recommendationHeaderTop.root.findByType(PrescriptionTitle);
    expect(prescriptionTitle).toBeDefined();
    expect(prescriptionTitle.props).toMatchObject({
      productName: recommendationHeaderTopProps.drugName,
      strength: recommendationHeaderTopProps.dose,
      unit: recommendationHeaderTopProps.units,
      quantity: recommendationHeaderTopProps.count,
      supply: recommendationHeaderTopProps.daysSupply,
      refills: recommendationHeaderTopProps.refillCount,
      hideSeparator: true,
      infoLink: recommendationHeaderTopProps.drugInformation?.externalLink,
      formCode: recommendationHeaderTopProps.form,
    });
  });
});

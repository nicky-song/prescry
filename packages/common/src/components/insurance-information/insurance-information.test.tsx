// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { Heading } from '../member/heading/heading';
import { SurveyItem } from '../member/survey/survey-item/survey-item';
import { InsuranceInformation } from './insurance-information';
import { insuranceInformationContent } from './insurance-information.content';
import { getChildren } from '../../testing/test.helper';

jest.mock('../member/survey/survey-item/survey-item', () => ({
  SurveyItem: () => null,
}));

jest.mock('../member/heading/heading', () => ({
  Heading: () => null,
}));

describe('InsuranceInformation', () => {
  it('renders in View with expected number of children components', () => {
    const insuranceInformationChangedMock = jest.fn();
    const testRenderer = renderer.create(
      <InsuranceInformation
        insuranceInformationChanged={insuranceInformationChangedMock}
        answer={''}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);

    expect(getChildren(container).length).toEqual(2);
  });

  it('renders Heading with expected heading text', () => {
    const insuranceInformationChangedMock = jest.fn();
    const testRenderer = renderer.create(
      <InsuranceInformation
        insuranceInformationChanged={insuranceInformationChangedMock}
        answer={''}
      />
    );

    const view = testRenderer.root.findByType(View);

    const heading = view.props.children[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(2);
    expect(heading.props.children).toEqual(
      insuranceInformationContent.headingTitle
    );
  });

  it('renders SurveyItem with expected properties', () => {
    const insuranceInformationChangedMock = jest.fn();

    const testRenderer = renderer.create(
      <InsuranceInformation
        insuranceInformationChanged={insuranceInformationChangedMock}
        answer={''}
      />
    );

    const view = testRenderer.root.findByType(View);

    const select = view.props.children[1];

    expect(select.type).toEqual(SurveyItem);
    expect(select.props.id).toEqual(insuranceInformationContent.id);
    expect(select.props.question).toEqual(insuranceInformationContent.question);
    expect(select.props.placeholder).toEqual(
      insuranceInformationContent.placeHolder
    );
    expect(select.props.type).toEqual('single-select');
    expect(select.props.selectOptions).toEqual(
      insuranceInformationContent.options
    );
    expect(select.props.isRequired).toEqual(true);
    expect(select.props.useCode).toEqual(true);
  });

  it('calls onAnswerChange() with expected properties when single-select changes', () => {
    const insuranceInformationChangedMock = jest.fn();
    const testRenderer = renderer.create(
      <InsuranceInformation
        insuranceInformationChanged={insuranceInformationChangedMock}
        answer={''}
      />
    );
    const select = testRenderer.root.findByType(SurveyItem);

    const onAnswerChange = select.props.onAnswerChange;
    const id = 'payment-method';
    const value = 'creditDebitCard';
    onAnswerChange(id, value);

    expect(insuranceInformationChangedMock).toHaveBeenCalledWith(id, value);
  });
});

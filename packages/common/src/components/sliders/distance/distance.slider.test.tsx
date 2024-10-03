// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { DistanceSlider } from './distance.slider';
import { BaseSlider } from '../base/base.slider';
import { distanceSliderContent } from './distance.slider.content';

jest.mock('../base/base.slider', () => ({
  BaseSlider: () => <div />,
}));

const onSelectedValueMock = jest.fn();

describe('DistanceSlider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a BaseSlider', () => {
    const testRenderer = renderer.create(
      <DistanceSlider onSelectedValue={onSelectedValueMock} />
    );

    const baseSlider = testRenderer.root.findByType(BaseSlider);

    expect(baseSlider).toBeDefined();
  });
  it('should render with expected default props', () => {
    const testRenderer = renderer.create(
      <DistanceSlider onSelectedValue={onSelectedValueMock} />
    );

    const baseSlider = testRenderer.root.findByType(BaseSlider);

    expect(baseSlider.props.onSelectedValue).toEqual(onSelectedValueMock);
    expect(baseSlider.props.defaultPosition).toEqual(25);
    expect(baseSlider.props.minimumPosition).toEqual(1);
    expect(baseSlider.props.maximumPosition).toEqual(100);
    expect(baseSlider.props.unit).toEqual(distanceSliderContent.defaultUnit);
    expect(baseSlider.props.viewStyle).toBeUndefined();
  });
  it('can render with optional base slider props', () => {
    const defaultPositionMock = 66;
    const minimumPositionMock = 33;
    const maximumPositionMock = 99;
    const unitMock = 'km';
    const viewStyleMock: ViewStyle = { backgroundColor: 'red' };
    const onSliderChangeMock = jest.fn();

    const testRenderer = renderer.create(
      <DistanceSlider
        onSelectedValue={onSelectedValueMock}
        defaultPosition={defaultPositionMock}
        minimumPosition={minimumPositionMock}
        maximumPosition={maximumPositionMock}
        unit={unitMock}
        viewStyle={viewStyleMock}
        onSliderChange={onSliderChangeMock}
      />
    );

    const baseSlider = testRenderer.root.findByType(BaseSlider);

    expect(baseSlider.props.onSelectedValue).toEqual(onSelectedValueMock);
    expect(baseSlider.props.defaultPosition).toEqual(defaultPositionMock);
    expect(baseSlider.props.minimumPosition).toEqual(minimumPositionMock);
    expect(baseSlider.props.maximumPosition).toEqual(maximumPositionMock);
    expect(baseSlider.props.unit).toEqual(unitMock);
    expect(baseSlider.props.viewStyle).toEqual(viewStyleMock);
    expect(baseSlider.props.onSliderChange).toEqual(onSliderChangeMock);
  });
});

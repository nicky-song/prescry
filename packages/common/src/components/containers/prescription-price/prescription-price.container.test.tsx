// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BorderRadius } from '../../../theming/borders';
import {
  ContainerFormat,
  PrescriptionPriceContainer,
} from './prescription-price.container';
import { prescriptionPriceContainerStyles } from './prescription-price.container.styles';

describe('PrescriptionPriceContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [
      undefined,
      undefined,
      'prescriptionPriceContainer',
      prescriptionPriceContainerStyles.viewStyle,
    ],
    [
      'test-id',
      'highlighted',
      'test-id',
      prescriptionPriceContainerStyles.viewStyle,
    ],
    [
      'test-id',
      'plain',
      'test-id',
      prescriptionPriceContainerStyles.plainViewStyle,
    ],
  ])(
    'renders in View (testID: %p) (containerFormat %p)',
    (
      testIdMock: undefined | string,
      containerFormatMock: string | undefined,
      expectedTestId: string,
      expectedContainerFormat: ViewStyle
    ) => {
      const viewStyleMock: ViewStyle = { width: 1 };

      const ChildMock = () => <div />;

      const containerFormat = containerFormatMock as ContainerFormat;

      const testRenderer = renderer.create(
        <PrescriptionPriceContainer
          viewStyle={viewStyleMock}
          testID={testIdMock}
          containerFormat={containerFormat}
        >
          <ChildMock />
        </PrescriptionPriceContainer>
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;

      expect(view.type).toEqual(View);
      expect(view.props.style).toEqual([
        {
          ...expectedContainerFormat,
          borderRadius:
            containerFormatMock !== 'plain' ? BorderRadius.half : undefined,
        },
        viewStyleMock,
      ]);
      expect(view.props.testID).toEqual(expectedTestId);
      expect(view.props.children).toEqual(<ChildMock />);
    }
  );

  it.each([
    [undefined, prescriptionPriceContainerStyles.viewStyle, undefined],
    ['highlighted', prescriptionPriceContainerStyles.viewStyle, true],
    ['plain', prescriptionPriceContainerStyles.plainViewStyle, undefined],
    [undefined, prescriptionPriceContainerStyles.viewStyle, false],
    ['highlighted', prescriptionPriceContainerStyles.viewStyle, false],
    ['plain', prescriptionPriceContainerStyles.plainViewStyle, false],
  ])(
    'renders with defined borderRadius when isRounded is not equal to false and containerFormat is not plain',
    (
      containerFormatMock: string | undefined,

      expectedContainerFormat: ViewStyle,
      isRounded: boolean | undefined
    ) => {
      const viewStyleMock: ViewStyle = { width: 1 };

      const ChildMock = () => <div />;

      const containerFormat = containerFormatMock as ContainerFormat;

      const testRenderer = renderer.create(
        <PrescriptionPriceContainer
          viewStyle={viewStyleMock}
          containerFormat={containerFormat}
          isRounded={isRounded}
        >
          <ChildMock />
        </PrescriptionPriceContainer>
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;

      const expectedBorderRadius =
        (isRounded === undefined || isRounded === true) &&
        containerFormatMock !== 'plain'
          ? BorderRadius.half
          : undefined;

      expect(view.type).toEqual(View);
      expect(view.props.style).toEqual([
        { ...expectedContainerFormat, borderRadius: expectedBorderRadius },
        viewStyleMock,
      ]);
    }
  );
});

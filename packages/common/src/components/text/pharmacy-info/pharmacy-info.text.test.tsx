// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { formatZipCode } from '../../../utils/formatters/address.formatter';
import { Heading } from '../../member/heading/heading';
import { ProtectedBaseText } from '../protected-base-text/protected-base-text';

import { PharmacyInfoText } from './pharmacy-info.text';
import { pharmacyInfoTextStyles } from './pharmacy-info.text.styles';

describe('PharmacyInfoText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const pharmacyInfoMock = {
    name: 'Pharmacy',
    address: {
      city: 'Seattle',
      lineOne: '2607 Denny Way',
      zip: '1234',
      state: 'WA',
    },
  };
  const testIdMock = 'testId';

  it.each([
    [undefined, 'pharmacyInfoText'],
    ['testId', 'testId'],
  ])(
    'renders container View with test id %p',
    (testIdMock: undefined | string, expected: string) => {
      const viewStyleMock: ViewStyle = { width: 1 };
      const testRenderer = renderer.create(
        <PharmacyInfoText
          pharmacyInfo={pharmacyInfoMock}
          testID={testIdMock}
          viewStyle={viewStyleMock}
        ></PharmacyInfoText>
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;

      expect(view.type).toEqual(View);
      expect(view.props.style).toEqual(viewStyleMock);
      expect(view.props.testID).toEqual(expected);
    }
  );

  it('renders pharmacy name as heading', () => {
    const testRenderer = renderer.create(
      <PharmacyInfoText
        pharmacyInfo={pharmacyInfoMock}
        testID={testIdMock}
      ></PharmacyInfoText>
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const pharmacyName = getChildren(view)[0];
    expect(pharmacyName.type).toEqual(Heading);
    expect(pharmacyName.props.textStyle).toEqual(
      pharmacyInfoTextStyles.pharmacyNameViewStyle
    );
    expect(pharmacyName.props.translateContent).toEqual(false);
    expect(pharmacyName.props.children).toEqual(pharmacyInfoMock.name);
  });

  it('renders pharmacy address', () => {
    const testRenderer = renderer.create(
      <PharmacyInfoText
        pharmacyInfo={pharmacyInfoMock}
        testID={testIdMock}
      ></PharmacyInfoText>
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const pharmacyName = getChildren(view)[1];
    expect(pharmacyName.type).toEqual(ProtectedBaseText);
    expect(pharmacyName.props.style).toEqual(
      pharmacyInfoTextStyles.pharmacyAddressTextStyle
    );
    const pharmacyAddress = `${pharmacyInfoMock.address.lineOne}, ${
      pharmacyInfoMock.address.city
    }, ${pharmacyInfoMock.address.state} ${formatZipCode(
      pharmacyInfoMock.address.zip
    )}`;
    expect(pharmacyName.props.children).toEqual(pharmacyAddress);
  });
});

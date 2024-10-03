// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseText } from '../base-text/base-text';
import { PricingAtPharmacyNameText } from './pricing-at-pharmacy-name.text';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { pricingAtPharmacyNameTextStyles } from './pricing-at-pharmacy-name.text.styles';
import { getChildren } from '../../../testing/test.helper';
import { View } from 'react-native';
import { ProtectedBaseText } from '../protected-base-text/protected-base-text';

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../base-text/base-text', () => ({
  BaseText: () => <div />,
}));

const pharmacyNameMock = 'pharmacy-name-mock';

const viewStyleMock = {};

const contentMock = { pricingAt: 'pricing-at-mock' };

const isContentLoadingMock = false;

describe('PricingAtPharmacyNameText', () => {
  beforeEach(() => {
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: isContentLoadingMock,
    });
  });

  it('renders with viewStyle and textStyle from props', () => {
    const testRenderer = renderer.create(
      <PricingAtPharmacyNameText
        pharmacyName={pharmacyNameMock}
        viewStyle={viewStyleMock}
      />
    );

    const viewContainer = testRenderer.root.children[0] as ReactTestInstance;
    expect(viewContainer.type).toEqual(View);
    expect(viewContainer.props.style).toEqual([
      pricingAtPharmacyNameTextStyles.pricingAtPharmacyNameViewStyles,
      viewStyleMock,
    ]);

    const baseText = getChildren(viewContainer)[0];
    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(
      pricingAtPharmacyNameTextStyles.textStyle
    );
  });

  it('renders with expected pharmacy name', () => {
    const testRenderer = renderer.create(
      <PricingAtPharmacyNameText
        pharmacyName={pharmacyNameMock}
        viewStyle={viewStyleMock}
      />
    );

    const viewContainer = testRenderer.root.children[0] as ReactTestInstance;
    const pharmacyNameText = getChildren(viewContainer)[1];
    const expectedText = `${pharmacyNameMock}`;

    expect(pharmacyNameText.type).toEqual(ProtectedBaseText);
    expect(pharmacyNameText.props.style).toEqual(
      pricingAtPharmacyNameTextStyles.textStyle
    );
    expect(pharmacyNameText.props.children).toEqual(expectedText);
  });
});

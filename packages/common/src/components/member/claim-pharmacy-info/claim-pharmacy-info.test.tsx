// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { Heading } from '../heading/heading';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { ClaimPharmacyInfo } from './claim-pharmacy-info';
import { claimPharmacyInfoStyles } from './claim-pharmacy-info.styles';
import { IconSize } from '../../../theming/icons';
import { formatZipCode } from '../../../utils/formatters/address.formatter';
import { formatPhoneNumber } from '../../../utils/formatters/phone-number.formatter';
import { BaseText } from '../../text/base-text/base-text';
import { ProtectedView } from '../../containers/protected-view/protected-view';

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock('../heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../containers/protected-view/protected-view', () => ({
  ProtectedView: () => <div />,
}));

const viewStyleMock = {};
const claimPharmacyInfoProps = {
  phoneNumber: 'phone-number-mock',
  pharmacyAddress1: 'pharmacy-address-1-mock',
  pharmacyCity: 'pharmacy-city-mock',
  pharmacyZipCode: 'pharmacy-zip-code-mock',
  pharmacyState: 'pharmacy-state-mock',
  title: 'title-mock',
};

describe('ClaimPharmacyInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders as ProtectedView with 3 children', () => {
    const testRenderer = renderer.create(
      <ClaimPharmacyInfo
        {...claimPharmacyInfoProps}
        viewStyle={viewStyleMock}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(ProtectedView);
    expect(container.props.style).toEqual(viewStyleMock);
    expect(container.props.children.length).toEqual(3);
  });

  it('renders title as 1st child', () => {
    const testRenderer = renderer.create(
      <ClaimPharmacyInfo
        {...claimPharmacyInfoProps}
        viewStyle={viewStyleMock}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    const title = getChildren(container)[0];

    expect(title.type).toEqual(Heading);
    expect(title.props.textStyle).toEqual(
      claimPharmacyInfoStyles.titleTextStyle
    );
    expect(title.props.level).toEqual(3);
  });

  it('renders address as 2nd child', () => {
    const testRenderer = renderer.create(
      <ClaimPharmacyInfo
        {...claimPharmacyInfoProps}
        viewStyle={viewStyleMock}
        isSkeleton={false}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    const address = getChildren(container)[1];

    expect(address.type).toEqual(View);
    expect(address.props.style).toEqual(claimPharmacyInfoStyles.rowViewStyle);

    const icon = getChildren(address)[0];
    const text = getChildren(address)[1];

    expect(icon.type).toEqual(FontAwesomeIcon);
    expect(icon.props.name).toEqual('map-marker-alt');
    expect(icon.props.size).toEqual(IconSize.regular);
    expect(icon.props.style).toEqual(claimPharmacyInfoStyles.iconTextStyle);

    expect(text.type).toEqual(BaseText);
    expect(text.props.isSkeleton).toEqual(false);
    expect(text.props.skeletonWidth).toEqual('medium');

    const formattedPharmacyZipCode = formatZipCode(
      claimPharmacyInfoProps.pharmacyZipCode ?? ''
    );

    expect(text.props.children).toEqual(
      `${claimPharmacyInfoProps.pharmacyAddress1} ${claimPharmacyInfoProps.pharmacyCity}, ${claimPharmacyInfoProps.pharmacyState} ${formattedPharmacyZipCode}`
    );
  });

  it('renders phone as 3rd child', () => {
    const testRenderer = renderer.create(
      <ClaimPharmacyInfo
        {...claimPharmacyInfoProps}
        viewStyle={viewStyleMock}
        isSkeleton={false}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    const phone = getChildren(container)[2];

    expect(phone.type).toEqual(View);
    expect(phone.props.style).toEqual(claimPharmacyInfoStyles.rowViewStyle);

    const icon = getChildren(phone)[0];
    const text = getChildren(phone)[1];

    expect(icon.type).toEqual(FontAwesomeIcon);
    expect(icon.props.name).toEqual('phone-alt');
    expect(icon.props.size).toEqual(IconSize.regular);
    expect(icon.props.style).toEqual(claimPharmacyInfoStyles.iconTextStyle);

    expect(text.type).toEqual(BaseText);
    expect(text.props.isSkeleton).toEqual(false);
    expect(text.props.skeletonWidth).toEqual('medium');

    const formattedPhoneNumber = formatPhoneNumber(
      claimPharmacyInfoProps.phoneNumber
    );

    expect(text.props.children).toEqual(formattedPhoneNumber);
  });
});

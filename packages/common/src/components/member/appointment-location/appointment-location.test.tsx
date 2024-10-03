// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View, ViewStyle } from 'react-native';
import { AppointmentLocation } from './appointment-location';
import { appointmentLocationContent } from './appointment-location.content';
import { formatAddress } from '../../../utils/formatters/address.formatter';
import { ILocation } from '../../../models/api-response/provider-location-details-response';
import { appointmentLocationStyles } from './appointment-location.styles';
import { AddressLink } from '../links/address/address.link';
import { getChildren } from '../../../testing/test.helper';
import { Heading } from '../heading/heading';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';

jest.mock('../links/address/address.link', () => ({
  AddressLink: () => <div />,
}));

const locationMock: ILocation = {
  id: 'id-not-used',
  locationName: 'location-name-not-used',
  providerName: 'Bartell Drugs',
  address1: '7370 170th Ave NE',
  city: 'Redmond',
  state: 'WA',
  zip: '98052',
  serviceInfo: [],
  timezone: 'time-zone-not-used',
};

describe('AppointmentLocation', () => {
  it('renders in View container', () => {
    const customViewStyle: ViewStyle = { width: 1 };
    const testRenderer = renderer.create(
      <AppointmentLocation
        selectedLocation={locationMock}
        viewStyle={customViewStyle}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.style).toEqual([
      appointmentLocationStyles.viewStyle,
      customViewStyle,
    ]);
    expect(container.props.testID).toEqual('appointmentLocation');
    expect(getChildren(container).length).toEqual(3);
  });

  it('renders title', () => {
    const testRenderer = renderer.create(
      <AppointmentLocation selectedLocation={locationMock} />
    );

    const container = testRenderer.root.findByType(View);
    const heading = getChildren(container)[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(2);
    expect(heading.props.textStyle).toEqual(
      appointmentLocationStyles.titleTextStyle
    );
    expect(heading.props.children).toEqual(appointmentLocationContent.title);
  });

  it('renders provider name', () => {
    const testRenderer = renderer.create(
      <AppointmentLocation selectedLocation={locationMock} />
    );

    const container = testRenderer.root.findByType(View);
    const providerBaseText = getChildren(container)[1];

    expect(providerBaseText.type).toEqual(ProtectedBaseText);
    expect(providerBaseText.props.children).toEqual(locationMock.providerName);
  });

  it('renders address link', () => {
    const testRenderer = renderer.create(
      <AppointmentLocation selectedLocation={locationMock} />
    );

    const container = testRenderer.root.findByType(View);
    const addressLink = getChildren(container)[2];

    expect(addressLink.type).toEqual(AddressLink);
    expect(addressLink.props.viewStyle).toEqual(
      appointmentLocationStyles.linkViewStyle
    );
    expect(addressLink.props.formattedAddress).toEqual(
      formatAddress(locationMock)
    );
  });
});

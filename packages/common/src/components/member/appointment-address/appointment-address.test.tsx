// Copyright 2020 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View } from 'react-native';
import {
  AppointmentAddress,
  getAddressFieldByType,
  renderAddressFieldsByName,
} from './appointment-address';
import { IMemberAddress } from '../../../models/api-request-body/create-booking.request-body';
import {
  AddressFieldName,
  addressFields,
  IAddressField,
} from '../../../models/address-fields';
import { appointmentAddressStyles } from './appointment-address.styles';
import { TranslatableView } from '../../containers/translated-view/translatable-view';
import { shallow } from 'enzyme';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

jest.mock('./address-text-input/address-text-input', () => ({
  AddressTextInput: () => <div />,
}));

jest.mock('./address-single-select/address-single-select', () => ({
  AddressSingleSelect: () => <div />,
}));

jest.mock('../../containers/translated-view/translatable-view', () => ({
  TranslatableView: () => <View />,
}));

const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;
const setMemberAddressMock = jest.fn();

const address: IMemberAddress = {
  address1: '900 East Grand Ave',
  county: 'King',
  city: 'Renton',
  state: 'WA',
  zip: '98055',
};

describe('AppointmentAddress', () => {
  beforeEach(() => {
    setMemberAddressMock.mockReset();
    useStateMock.mockReset();
    useEffectMock.mockReset();
  });

  it('renders AppointmentAddress with children', () => {
    useStateMock.mockReturnValueOnce([address, jest.fn()]);

    const onAddressChange = jest.fn();
    const testRenderer = renderer.create(
      <AppointmentAddress onAddressChange={onAddressChange} />
    );

    const viewContainer = testRenderer.root.children[0] as ReactTestInstance;
    expect(viewContainer.type).toEqual(TranslatableView);
    expect(viewContainer.props.style).toEqual(
      appointmentAddressStyles.appointmentAddressContainerViewStyle
    );
    expect(viewContainer.props.testID).toEqual('appointmentAddress');
    expect(viewContainer.props.children.length).toBe(4);
  });

  it('renders street name container', () => {
    useStateMock.mockReturnValueOnce([address, setMemberAddressMock]);

    const onAddressChange = jest.fn();
    const testRenderer = renderer.create(
      <AppointmentAddress onAddressChange={onAddressChange} />
    );

    const viewContainer = testRenderer.root.findByProps({
      testID: 'appointmentAddress',
    });
    const streetNameContainer = viewContainer.props.children[0];

    const { appointmentAddressFieldViewStyle, rowItemViewStyle } =
      appointmentAddressStyles;
    expect(streetNameContainer.type).toEqual(View);
    expect(streetNameContainer.props.style).toEqual([
      appointmentAddressFieldViewStyle,
      rowItemViewStyle,
    ]);
    expect(streetNameContainer.props.testID).toEqual(
      'AppointmentAddressStreetName'
    );
  });

  it('renders city container', () => {
    useStateMock.mockReturnValueOnce([address, setMemberAddressMock]);

    const onAddressChange = jest.fn();
    const testRenderer = renderer.create(
      <AppointmentAddress onAddressChange={onAddressChange} />
    );

    const viewContainer = testRenderer.root.findByProps({
      testID: 'appointmentAddress',
    });
    const cityContainer = viewContainer.props.children[1];

    const { appointmentAddressFieldViewStyle, rowItemViewStyle } =
      appointmentAddressStyles;
    expect(cityContainer.type).toEqual(View);
    expect(cityContainer.props.style).toEqual([
      appointmentAddressFieldViewStyle,
      rowItemViewStyle,
    ]);
    expect(cityContainer.props.testID).toEqual('AppointmentAddressCity');
  });

  it('renders state container', () => {
    useStateMock.mockReturnValueOnce([address, setMemberAddressMock]);

    const onAddressChange = jest.fn();
    const testRenderer = renderer.create(
      <AppointmentAddress onAddressChange={onAddressChange} />
    );

    const viewContainer = testRenderer.root.findByProps({
      testID: 'appointmentAddress',
    });
    const stateContainer = viewContainer.props.children[2];

    const { appointmentAddressFieldViewStyle, rowItemViewStyle } =
      appointmentAddressStyles;
    expect(stateContainer.type).toEqual(View);
    expect(stateContainer.props.style).toEqual([
      appointmentAddressFieldViewStyle,
      rowItemViewStyle,
    ]);
    expect(stateContainer.props.testID).toEqual('AppointmentAddressState');
  });

  it('renders zip/county container', () => {
    useStateMock.mockReturnValueOnce([address, setMemberAddressMock]);

    const onAddressChange = jest.fn();
    const testRenderer = renderer.create(
      <AppointmentAddress onAddressChange={onAddressChange} />
    );

    const viewContainer = testRenderer.root.findByProps({
      testID: 'appointmentAddress',
    });
    const zipCountyContainer = viewContainer.props.children[3];

    const {
      appointmentAddressFieldViewStyle,
      twoColumnTextStyle,
      lastRowItemViewStyle,
      rowItemViewStyle,
    } = appointmentAddressStyles;
    expect(zipCountyContainer.type).toEqual(View);
    expect(zipCountyContainer.props.style).toEqual([
      appointmentAddressFieldViewStyle,
      rowItemViewStyle,
      twoColumnTextStyle,
      lastRowItemViewStyle,
    ]);
    expect(zipCountyContainer.props.testID).toEqual(
      'AppointmentAddressZipCode'
    );
  });

  it('renders only zip container if county props is false', () => {
    useStateMock.mockReturnValueOnce([address, setMemberAddressMock]);

    const onAddressChange = jest.fn();
    const testRenderer = renderer.create(
      <AppointmentAddress
        onAddressChange={onAddressChange}
        isCountyVisible={false}
      />
    );

    const viewContainer = testRenderer.root.findByProps({
      testID: 'appointmentAddress',
    });
    const zipCountyContainer = viewContainer.props.children[3];

    const { appointmentAddressFieldViewStyle, rowItemViewStyle } =
      appointmentAddressStyles;
    expect(zipCountyContainer.type).toEqual(View);
    expect(zipCountyContainer.props.style).toEqual([
      appointmentAddressFieldViewStyle,
      rowItemViewStyle,
    ]);
  });

  it('renderAddressFieldsByName retuns valid ReactNode', () => {
    useStateMock.mockReturnValueOnce([address, setMemberAddressMock]);

    const onAddressChange = jest.fn();

    expect(
      renderAddressFieldsByName(
        [
          [
            AddressFieldName.CITY,
            appointmentAddressStyles.columnLeftItemTextStyle,
          ],
        ],
        onAddressChange
      )
    ).not.toBeNull();

    expect(
      renderAddressFieldsByName(
        [
          [
            AddressFieldName.ZIP,
            appointmentAddressStyles.columnLeftItemTextStyle,
          ],
          [AddressFieldName.COUNTY],
        ],
        onAddressChange
      )
    ).not.toBe(null);

    expect(
      renderAddressFieldsByName([[AddressFieldName.STATE]], onAddressChange)
    ).not.toBe(null);
  });

  it('getAddressFieldByType retuns valid ReactNode', () => {
    useStateMock.mockReturnValueOnce([address, setMemberAddressMock]);
    const onAddressChange = jest.fn();
    expect(getAddressFieldByType(addressFields[0], onAddressChange)).not.toBe(
      null
    );
    expect(getAddressFieldByType(addressFields[4], onAddressChange)).not.toBe(
      null
    );

    const fixedTestIdValue = 'appointment';
    const getAddressWrapper = (addressFields: IAddressField) => {
      return shallow(
        <div>{getAddressFieldByType(addressFields, onAddressChange)}</div>
      );
    };

    const wrapperAddress1Field = getAddressWrapper(addressFields[0]);
    expect(wrapperAddress1Field.children().props().testID).toBe(
      `${fixedTestIdValue}-${addressFields[0].name}`
    );

    const wrapperCityField = getAddressWrapper(addressFields[1]);
    expect(wrapperCityField.children().props().testID).toBe(
      `${fixedTestIdValue}-${addressFields[1].name}`
    );

    const wrapperZipField = getAddressWrapper(addressFields[2]);
    expect(wrapperZipField.children().props().testID).toBe(
      `${fixedTestIdValue}-${addressFields[2].name}`
    );

    const wrapperCountyField = getAddressWrapper(addressFields[3]);
    expect(wrapperCountyField.children().props().testID).toBe(
      `${fixedTestIdValue}-${addressFields[3].name}`
    );

    const wrapperStateField = getAddressWrapper(addressFields[4]);
    expect(wrapperStateField.children().props().testID).toBe(
      `${fixedTestIdValue}-${addressFields[4].name}`
    );
  });
});

// Copyright 2020 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import {
  addressFields,
  IAddressField,
  AddressFieldName,
} from '../../../models/address-fields';
import {
  AddressTextInput,
  IAddressTextInputProps,
} from './address-text-input/address-text-input';
import { AddressSingleSelect } from './address-single-select/address-single-select';
import { View, TextStyle } from 'react-native';
import { appointmentAddressStyles } from './appointment-address.styles';
import { IMemberAddress } from '../../../models/api-request-body/create-booking.request-body';
import { TranslatableView } from '../../containers/translated-view/translatable-view';

export interface IAppointmentAddressProps {
  onAddressChange: (memberAddress: IMemberAddress | undefined) => void;
  defaultAddress?: IMemberAddress;
  editable?: boolean;
  isCountyVisible?: boolean;
}

const {
  twoColumnTextStyle,
  appointmentAddressFieldViewStyle,
  appointmentAddressContainerViewStyle,
  columnLeftItemTextStyle,
  columnRightItemTextStyle,
  lastRowItemViewStyle,
  rowItemViewStyle,
} = appointmentAddressStyles;

export const getAddressFieldByType = (
  field: IAddressField,
  onAddressChange: (value: string, fieldName: string) => void,
  style?: TextStyle,
  defaultValue?: string,
  editable?: boolean
): React.ReactNode => {
  if (field.type === 'text') {
    const props: IAddressTextInputProps = {
      label: field.label,
      placeholder: field.placeholder,
      required: field.isRequired,
      name: field.name,
      errorMessage: field.errorMessage,
      style,
      onAddressChange,
      defaultValue,
      editable,
      testID: `appointment-${field.name}`,
    };
    return <AddressTextInput key={field.name} {...props} />;
  }
  if (field.type === 'single-select') {
    const props = {
      markdownLabel: field.label,
      options: field.options,
      required: field.isRequired,
      name: field.name,
      errorMessage: field.errorMessage,
      style,
      onAddressChange,
      defaultValue,
      editable,
      testID: `appointment-${field.name}`,
    };
    return <AddressSingleSelect key={field.name} {...props} />;
  }

  return null;
};

export const renderAddressFieldsByName = (
  fields: [AddressFieldName, TextStyle?, string?, boolean?][],
  onAddressChange: (value: string, fieldName: string) => void
): React.ReactNode => (
  <>
    {fields.map((t) => {
      const [item, style, defaultValue, editable] = t;

      const fieldFound = addressFields.find((field) => field.name === item);
      if (fieldFound) {
        return getAddressFieldByType(
          fieldFound,
          onAddressChange,
          style,
          defaultValue,
          editable
        );
      }

      return null;
    })}
  </>
);

export const AppointmentAddress = (props: IAppointmentAddressProps) => {
  const address: IMemberAddress = {
    address1: props.defaultAddress?.address1
      ? props.defaultAddress.address1
      : '',
    county: props.defaultAddress?.county ?? '',
    city: props.defaultAddress?.city ?? '',
    state: props.defaultAddress?.state ?? '',
    zip: props.defaultAddress?.zip ?? '',
  };
  const [memberAddress, setMemberAddress] = useState(address);
  const isCountyVisible = props.isCountyVisible ?? true;
  useEffect(() => {
    props.onAddressChange(memberAddress);
  }, [memberAddress]);

  const onAddressChange = (newValue: string, fieldName: string) => {
    if (Object.prototype.hasOwnProperty.call(memberAddress, fieldName)) {
      setMemberAddress({
        ...memberAddress,
        [fieldName]: newValue.trim(),
      });
    }
  };

  const zipAndCountyFields = (): [
    AddressFieldName,
    TextStyle?,
    string?,
    boolean?
  ][] => {
    const zip: [AddressFieldName, TextStyle?, string?, boolean?] = [
      AddressFieldName.ZIP,
      isCountyVisible ? columnLeftItemTextStyle : undefined,
      props.defaultAddress?.zip ? props.defaultAddress?.zip : undefined,
      props.editable,
    ];

    if (isCountyVisible) {
      return [
        zip,
        [
          AddressFieldName.COUNTY,
          columnRightItemTextStyle,
          props.defaultAddress?.county
            ? props.defaultAddress?.county
            : undefined,
          props.editable,
        ],
      ];
    }

    return [zip];
  };

  const singleColumnStyles = [
    appointmentAddressFieldViewStyle,
    rowItemViewStyle,
  ];
  const twoColumnStyles = [
    ...singleColumnStyles,
    twoColumnTextStyle,
    lastRowItemViewStyle,
  ];
  return (
    <TranslatableView
      style={appointmentAddressContainerViewStyle}
      testID='appointmentAddress'
    >
      <View style={singleColumnStyles} testID='AppointmentAddressStreetName'>
        {renderAddressFieldsByName(
          [
            [
              AddressFieldName.STREET_NAME,
              undefined,
              props.defaultAddress?.address1
                ? props.defaultAddress?.address1
                : undefined,
              props.editable,
            ],
          ],
          onAddressChange
        )}
      </View>
      <View style={singleColumnStyles} testID='AppointmentAddressCity'>
        {renderAddressFieldsByName(
          [
            [
              AddressFieldName.CITY,
              undefined,
              props.defaultAddress?.city
                ? props.defaultAddress?.city
                : undefined,
              props.editable,
            ],
          ],
          onAddressChange
        )}
      </View>
      <View style={singleColumnStyles} testID='AppointmentAddressState'>
        {renderAddressFieldsByName(
          [
            [
              AddressFieldName.STATE,
              undefined,
              props.defaultAddress?.state
                ? props.defaultAddress?.state
                : undefined,
              props.editable,
            ],
          ],
          onAddressChange
        )}
      </View>
      <View
        style={isCountyVisible ? twoColumnStyles : singleColumnStyles}
        testID='AppointmentAddressZipCode'
      >
        {renderAddressFieldsByName(zipAndCountyFields(), onAddressChange)}
      </View>
    </TranslatableView>
  );
};

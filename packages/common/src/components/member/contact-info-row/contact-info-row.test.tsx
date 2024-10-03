// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View, TextStyle, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import {
  ContactInfoRow,
  IContactInfoRowProps,
  contactInfoRowStyles,
  IContactInfoRowStyles,
} from './contact-info-row';
import { BaseText } from '../../text/base-text/base-text';
import { GreyScale } from '../../../theming/theme';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';

const contactInfoRowProps: IContactInfoRowProps = {
  name: 'Member Rx ID',
  value: 'Thomas Young',
};

describe('ContactInfoRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with defaults', () => {
    const testRenderer = renderer.create(
      <ContactInfoRow {...contactInfoRowProps} />
    );

    const view = testRenderer.root.findByType(View);
    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual(
      contactInfoRowStyles.contactInfoRowViewStyle
    );

    const baseText = view.props.children[0];
    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.children).toEqual(contactInfoRowProps.name);
    expect(baseText.props.style).toEqual(contactInfoRowStyles.keyTextStyle);
    const protectedBaseText = view.props.children[1];
    expect(protectedBaseText.type).toEqual(ProtectedBaseText);
    expect(protectedBaseText.props.children).toEqual(contactInfoRowProps.value);
    expect(protectedBaseText.props.style).toEqual(
      contactInfoRowStyles.valueTextStyle
    );
  });
});

describe('contactInfoRowStyles', () => {
  it('has expected styles', () => {
    const keyTextStyle: TextStyle = {
      width: '33%',
      lineHeight: 36,
      color: GreyScale.regular,
      display: 'flex',
    };

    const valueTextStyle: TextStyle = {
      flexGrow: 1,
      lineHeight: 36,
    };

    const contactInfoRowViewStyle: ViewStyle = {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    };

    const expectedContactInfoRowStyles: IContactInfoRowStyles = {
      keyTextStyle,
      valueTextStyle,
      contactInfoRowViewStyle,
    };

    expect(contactInfoRowStyles).toEqual(expectedContactInfoRowStyles);
  });
});

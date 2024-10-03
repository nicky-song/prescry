// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../../testing/test.helper';
import { BaseText } from '../../../text/base-text/base-text';
import { ProtectedBaseText } from '../../../text/protected-base-text/protected-base-text';
import { FaxPanel } from './fax.panel';
import { faxPanelContent } from './fax.panel.content';
import { faxPanelStyles } from './fax.panel.styles';

describe('FaxPanel', () => {
  it('renders in View container', () => {
    const customViewStyle: ViewStyle = {
      width: 1,
    };
    const testRenderer = renderer.create(
      <FaxPanel viewStyle={customViewStyle} />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.testID).toEqual('FaxPanel');
    expect(container.props.style).toEqual(customViewStyle);
    expect(getChildren(container).length).toEqual(2);
  });

  it('renders label', () => {
    const testRenderer = renderer.create(<FaxPanel />);

    const container = testRenderer.root.findByProps({ testID: 'FaxPanel' });
    const label = getChildren(container)[0];

    expect(label.type).toEqual(BaseText);
    expect(label.props.children).toEqual(faxPanelContent.label);
  });

  it('renders FAX number', () => {
    const testRenderer = renderer.create(<FaxPanel />);

    const container = testRenderer.root.findByProps({ testID: 'FaxPanel' });
    const faxNumber = getChildren(container)[1];

    expect(faxNumber.type).toEqual(ProtectedBaseText);
    expect(faxNumber.props.style).toEqual(faxPanelStyles.faxNumberTextStyle);
    expect(faxNumber.props.children).toEqual(faxPanelContent.faxNumber);
  });
});

// Copyright 2019 Prescryptive Health, Inc.

import React from 'react';
import { Text, View } from 'react-native';
import renderer from 'react-test-renderer';
import { FooterView } from './footer-view';

describe('HeaderView', () => {
  it("renders with 'contentinfo' accessibility role", () => {
    const testRenderer = renderer.create(
      <FooterView>
        <Text />
      </FooterView>
    );

    const component = testRenderer.root.findByType(View);
    expect(component.props.accessibilityRole).toEqual('contentinfo');
  });

  it('renders with specified content', () => {
    const content = <Text />;
    const testRenderer = renderer.create(<FooterView>{content}</FooterView>);

    const component = testRenderer.root.findByProps({
      accessibilityRole: 'contentinfo',
    });
    const contentComponent = component.props.children;
    expect(contentComponent).toEqual(content);
  });

  it('passes properties through to view component', () => {
    const style = { width: '100%' };

    const testRenderer = renderer.create(
      <FooterView style={style}>
        <Text />
      </FooterView>
    );

    const component = testRenderer.root.findByType(View);
    expect(component.props.style).toEqual(style);
  });
});

// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Text, View } from 'react-native';
import { List } from './list';
import renderer from 'react-test-renderer';

describe('List', () => {
  it("renders with 'list' accessibility role", () => {
    const testRenderer = renderer.create(
      <List>
        <Text />
      </List>
    );

    const component = testRenderer.root.findByType(View);
    expect(component.props.accessibilityRole).toEqual('list');
  });

  it('renders with specified content', () => {
    const content = <Text />;
    const testRenderer = renderer.create(<List>{content}</List>);

    const component = testRenderer.root.findByProps({
      accessibilityRole: 'list',
    });
    const contentComponent = component.props.children;
    expect(contentComponent).toEqual(content);
  });

  it('passes properties through to view component', () => {
    const style = { width: '100%' };

    const testRenderer = renderer.create(
      <List style={style}>
        <Text />
      </List>
    );

    const component = testRenderer.root.findByType(View);
    expect(component.props.style).toEqual(style);
  });
});

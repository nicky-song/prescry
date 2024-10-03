// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Text, View } from 'react-native';
import { ListItem } from './list-item';
import renderer from 'react-test-renderer';

describe('ListItem', () => {
  it('renders with accessibility role', () => {
    const testRenderer = renderer.create(
      <ListItem>
        <Text />
      </ListItem>
    );

    const component = testRenderer.root.findByType(View);
    expect(component.props.accessibilityRole).toEqual('listitem');
  });

  it('renders with specified content', () => {
    const content = <Text />;
    const testRenderer = renderer.create(<ListItem>{content}</ListItem>);

    const component = testRenderer.root.findByProps({
      accessibilityRole: 'listitem',
    });
    const contentComponent = component.props.children;
    expect(contentComponent).toEqual(content);
  });

  it('passes properties through to view component', () => {
    const style = { width: '100%' };

    const testRenderer = renderer.create(
      <ListItem style={style}>
        <Text />
      </ListItem>
    );

    const component = testRenderer.root.findByType(View);
    expect(component.props.style).toEqual(style);
  });
});

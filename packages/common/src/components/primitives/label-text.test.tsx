// Copyright 2019 Prescryptive Health, Inc.

import React from 'react';
import { Text, TextInput } from 'react-native';
import renderer from 'react-test-renderer';
import { LabelText } from './label-text';

describe('LabelText', () => {
  it("renders with 'label' accessibility role", () => {
    const testRenderer = renderer.create(
      <LabelText>
        <TextInput />
      </LabelText>
    );

    const component = testRenderer.root.findByType(Text);
    expect(component.props.accessibilityRole).toEqual('label');
  });

  it('renders with specified content', () => {
    const content = <TextInput />;
    const testRenderer = renderer.create(<LabelText>{content}</LabelText>);

    const component = testRenderer.root.findByProps({
      accessibilityRole: 'label',
    });
    const contentComponent = component.props.children;
    expect(contentComponent).toEqual(content);
  });

  it('passes properties through to text component', () => {
    const style = { width: '100%' };

    const testRenderer = renderer.create(
      <LabelText style={style}>
        <TextInput />
      </LabelText>
    );

    const component = testRenderer.root.findByType(Text);
    expect(component.props.style).toEqual(style);
  });
});

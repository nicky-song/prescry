// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ListItem } from '../../primitives/list-item';
import { CardContainer } from './card.container';

describe('CardContainer', () => {
  it('renders as ListItem by default', () => {
    const ChildMock = (): ReactElement => <div />;

    const testIdMock = 'test-id';
    const testRenderer = renderer.create(
      <CardContainer testID={testIdMock}>
        <ChildMock />
      </CardContainer>
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(ListItem);
    expect(container.props.children).toEqual(<ChildMock />);
    expect(container.props.testID).toEqual(testIdMock);
  });

  it('renders as View for singleton', () => {
    const ChildMock = (): ReactElement => <div />;

    const testIdMock = 'test-id';
    const testRenderer = renderer.create(
      <CardContainer testID={testIdMock} isSingleton={true}>
        <ChildMock />
      </CardContainer>
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.children).toEqual(<ChildMock />);
    expect(container.props.testID).toEqual(testIdMock);
  });
});

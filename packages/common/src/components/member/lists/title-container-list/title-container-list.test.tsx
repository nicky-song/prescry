// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../../testing/test.helper';
import { Heading } from '../../heading/heading';
import { TitleContainerList } from './title-container-list';
import { titleContainerListStyles as styles } from './title-container-list.styles';

describe('TitleContainerList', () => {
  it('renders in View container', () => {
    const customViewStyle: ViewStyle = {
      width: 1,
    };
    const testRenderer = renderer.create(
      <TitleContainerList title='title' viewStyle={customViewStyle}>
        <div />
      </TitleContainerList>
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.testID).toEqual('TitleContainerList');
    expect(container.props.style).toEqual(customViewStyle);
    expect(getChildren(container).length).toEqual(2);
  });

  it('renders title with expected properties', () => {
    const titleMock = 'Title';
    const testRenderer = renderer.create(
      <TitleContainerList title={titleMock}>
        <div />
      </TitleContainerList>
    );

    const container = testRenderer.root.findByProps({
      testID: 'TitleContainerList',
    });
    const heading = getChildren(container)[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(2);
    expect(heading.props.textStyle).toEqual(styles.titleTextStyle);
    expect(heading.props.children).toEqual(titleMock);
  });

  it('renders children', () => {
    const childrenMock = <div />;
    const testRenderer = renderer.create(
      <TitleContainerList title='title'>{childrenMock}</TitleContainerList>
    );

    const container = testRenderer.root.findByProps({
      testID: 'TitleContainerList',
    });
    const children = getChildren(container)[1];

    expect(children).toEqual(childrenMock);
  });
});

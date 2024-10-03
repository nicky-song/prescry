// Copyright 2020 Prescryptive Health, Inc.

import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import renderer from 'react-test-renderer';
import { ContainerHierarchy } from './container-hierarchy';

const ChildMock = () => <div />;

const Container1Mock: FunctionComponent = ({ children }): ReactElement => (
  <div id='Container1'>{children}</div>
);
const Container2Mock: FunctionComponent = ({ children }): ReactElement => (
  <div id='Container2'>{children}</div>
);

describe('ContainerHierarchy', () => {
  it('renders children only when no containers specified', () => {
    const testRenderer = renderer.create(
      <ContainerHierarchy containerList={[]}>
        <ChildMock />
      </ContainerHierarchy>
    );

    const children = testRenderer.root.findAllByType(ChildMock);

    expect(children.length).toEqual(1);
    expect(children[0].type).toEqual(ChildMock);
  });

  it('renders container hierarchy', () => {
    const containerList = [Container1Mock, Container2Mock];
    const testRenderer = renderer.create(
      <ContainerHierarchy containerList={containerList}>
        <ChildMock />
      </ContainerHierarchy>
    );

    const container1 = testRenderer.root.findByType(Container1Mock);

    const container2 = container1.props.children;
    expect(container2.type).toEqual(Container2Mock);

    const fragment = container2.props.children;
    expect(fragment.type).toEqual(Fragment);

    const children = fragment.props.children;
    expect(children.type).toEqual(ChildMock);
  });
});

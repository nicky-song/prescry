// Copyright 2021 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import renderer from 'react-test-renderer';
import { BaseButton } from '../../buttons/base/base.button';
import { BaseText } from '../../text/base-text/base-text';
import { ITab, Tabs } from './tabs';
import { tabsStyles } from './tabs.style';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;
const onTabPressMock = jest.fn();

describe('Tabs', () => {
  beforeEach(() => {
    useStateMock.mockReset();
    useEffectMock.mockReset();
  });

  it('renders component with expected properties', () => {
    const mockTabs = [
      { name: 'Tab1', content: <Text>Example 1 Loremp Ipsum</Text> },
      { name: 'Tab2', content: <Text>Example 2 Ipsum lorem</Text> },
    ];

    const mockViewStyle = { flex: 1 };

    useStateMock.mockReturnValueOnce([<div key='1' id='1' />, jest.fn()]);
    useStateMock.mockReturnValueOnce([<div key='2' id='2' />, jest.fn()]);

    const testRenderer = renderer.create(
      <Tabs tabs={mockTabs} viewStyle={mockViewStyle} />
    );

    const container = testRenderer.root.findAllByType(View, { deep: false })[0];

    expect(container.props.style).toEqual(mockViewStyle);
    expect(container.props.children[1].type).toEqual(View);
    expect(container.props.children[1].props.style).toEqual(
      tabsStyles.lineSeparatorViewStyle
    );
  });

  it('renders unselected tab header with expected properties', () => {
    const mockTabs = [
      { name: 'Tab1', content: <Text>Example 1 Loremp Ipsum</Text> },
      { name: 'Tab2', content: <Text>Example 2 Ipsum lorem</Text> },
    ];

    const mockViewStyle = { flex: 1 };

    useStateMock.mockReturnValueOnce([<div key='1' id='1' />, jest.fn()]);
    useStateMock.mockReturnValueOnce([<div key='2' id='2' />, jest.fn()]);

    const testRenderer = renderer.create(
      <Tabs tabs={mockTabs} viewStyle={mockViewStyle} />
    );

    const container = testRenderer.root.findAllByType(View, { deep: false })[0];

    expect(container.props.children[0].type).toEqual(View);
    expect(container.props.children[0].props.style).toEqual(
      tabsStyles.headerContainerViewStyle
    );

    const tabsHeaderButtons = container.props.children[0].props.children;
    expect(tabsHeaderButtons.length).toEqual(2);

    const btn = tabsHeaderButtons[0];
    expect(btn.type).toEqual(BaseButton);
    expect(btn.props.textStyle).toEqual(tabsStyles.headerButtonTextStyle);
    expect(btn.props.onPress.name).toEqual('onPressHeader');

    const content = btn.props.children;
    expect(content.type).toEqual(View);
    expect(content.props.style).toEqual(tabsStyles.headerViewStyle);
    expect(content.props.children[0].type).toEqual(BaseText);
    expect(content.props.children[0].props.style).toEqual(
      tabsStyles.headerUnSelectedTextStyle
    );
    expect(content.props.children[0].props.children).toEqual('Tab1');

    expect(content.props.children[1].type).toEqual(View);
    expect(content.props.children[1].props.style).toEqual(
      tabsStyles.unSelectedLineViewStyle
    );
  });

  it('renders selected tab header with expected properties', () => {
    const mockChildrenTab = <Text>Example 1 Loremp Ipsum</Text>;
    const mockTabs: ITab[] = [
      { name: 'Tab1', content: mockChildrenTab, value: 'tab1' },
      {
        name: 'Tab2',
        content: <Text>Example 2 Ipsum lorem</Text>,
        value: 'tab2',
      },
    ];

    const setCurrentTabMock = jest.fn();
    useStateMock.mockReturnValueOnce([0, setCurrentTabMock]);
    useStateMock.mockReturnValueOnce([<div key='2' id='2' />, jest.fn()]);

    const mockTabContainerViewStyle = { flex: 1 };

    const testRenderer = renderer.create(
      <Tabs
        tabs={mockTabs}
        tabContainerViewStyle={mockTabContainerViewStyle}
        onTabPress={onTabPressMock}
      />
    );

    const container = testRenderer.root.findAllByType(View, { deep: false })[0];
    const tabContainer = container.props.children[2];
    expect(tabContainer.type).toEqual(View);
    expect(tabContainer.props.style).toEqual([
      tabsStyles.tabContainerViewStyle,
      mockTabContainerViewStyle,
    ]);

    expect(tabContainer.props.children).toEqual(mockChildrenTab);

    const tabsHeaderButtons = container.props.children[0].props.children;
    const btn = tabsHeaderButtons[0];
    btn.props.onPress();
    expect(setCurrentTabMock).toHaveBeenCalledWith(0);
    expect(onTabPressMock).toHaveBeenCalledWith(mockTabs[0].value);
  });

  it('uses useEffect on load with expected value', () => {
    const mockTabs = [
      { name: 'Tab1', content: <Text>Example 1 Loremp Ipsum</Text> },
      { name: 'Tab2', content: <Text>Example 2 Ipsum lorem</Text> },
    ];
    const mockSelected = 1;
    useStateMock.mockReturnValueOnce([0, jest.fn()]);

    renderer.create(<Tabs tabs={mockTabs} selected={mockSelected} />);
    expect(useEffectMock).toHaveBeenCalled();
    expect(useEffectMock.mock.calls[0][1]).toEqual([mockSelected]);
  });
});

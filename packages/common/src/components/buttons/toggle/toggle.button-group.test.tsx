// Copyright 2021 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getKey } from '../../../testing/test.helper';
import { BaseButton } from '../base/base.button';
import { IToggleButtonOption, ToggleButtonGroup } from './toggle.button-group';
import { toggleButtonGroupStyles } from './toggle.button-group.style';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

describe('RadioButtonGroup', () => {
  beforeEach(() => {
    useStateMock.mockReset();
    useEffectMock.mockReset();
  });

  it('renders component with expected properties', () => {
    const mockTabs: IToggleButtonOption[] = [
      { label: 'Tab1', value: '101' },
      { label: 'Tab2', value: '102' },
    ];

    const mockHeaderText = 'title';

    const isRequiredMock = false;

    const mockViewStyle = { flex: 1 };

    useStateMock.mockReturnValueOnce([0, jest.fn()]);

    const testRenderer = renderer.create(
      <ToggleButtonGroup
        options={mockTabs}
        headerText={mockHeaderText}
        onSelect={jest.fn()}
        isRequired={isRequiredMock}
        viewStyle={mockViewStyle}
      />
    );

    const container = testRenderer.root.findAllByType(View, { deep: false })[0];

    expect(container.props.accessibilityRole).toEqual('radiogroup');
    expect(container.props.testID).toEqual('buttonGroup');
    expect(container.props.style).toEqual(mockViewStyle);

    const label = container.props.children;
    expect(label.props.label).toEqual(mockHeaderText);
    expect(label.props.isRequired).toEqual(isRequiredMock);

    const optionsContainer = label.props.children;
    expect(optionsContainer.type).toEqual(View);
    expect(optionsContainer.props.style).toEqual(
      toggleButtonGroupStyles.optionsContainerViewStyle
    );
  });

  it('renders buttons of options', () => {
    const mockTabs: IToggleButtonOption[] = [
      { label: 'Tab1', value: '101' },
      { label: 'Tab2', value: '102' },
    ];
    const selectedValueMock = mockTabs[0].value;

    useStateMock.mockReturnValueOnce([selectedValueMock, jest.fn()]);

    const testRenderer = renderer.create(
      <ToggleButtonGroup
        options={mockTabs}
        headerText=''
        onSelect={jest.fn()}
        selected={selectedValueMock}
      />
    );

    const container = testRenderer.root.findAllByType(View, { deep: false })[0];
    const label = container.props.children;
    const options = label.props.children.props.children;

    options.forEach((option: ReactTestInstance, index: number) => {
      const expectedTab = mockTabs[index];
      const isSelected = expectedTab.value === selectedValueMock;

      expect(option.type).toEqual(BaseButton);
      expect(option.props.size).toEqual('medium');
      expect(option.props.accessibilityRole).toEqual('radio');
      expect(option.props.onPress).toEqual(expect.any(Function));
      expect(option.props.viewStyle).toEqual(
        isSelected
          ? toggleButtonGroupStyles.buttonViewStyle
          : toggleButtonGroupStyles.unSelectedButtonViewStyle
      );
      expect(getKey(option)).toEqual(`radioButton${expectedTab.label}`);
      expect(option.props.textStyle).toEqual(
        isSelected
          ? toggleButtonGroupStyles.buttonTextStyle
          : toggleButtonGroupStyles.unSelectedButtonTextStyle
      );
      expect(option.props.children).toEqual(expectedTab.label);
      expect(option.props.testID).toEqual(
        `toggleButtonGroupBaseButton-${expectedTab.label}`
      );
    });
  });

  it('uses useEffect on load with expected value', () => {
    const mockTabs: IToggleButtonOption[] = [
      { label: 'Tab1', value: '101' },
      { label: 'Tab2', value: '102' },
    ];
    const mockSelected = '102';
    const mockOnSelected = jest.fn();
    useStateMock.mockReturnValue(['102', mockOnSelected]);

    const testRenderer = renderer.create(
      <ToggleButtonGroup
        options={mockTabs}
        headerText='title'
        onSelect={jest.fn()}
        selected={mockSelected}
      />
    );

    testRenderer.update(
      <ToggleButtonGroup
        options={mockTabs}
        headerText='title'
        onSelect={jest.fn()}
        selected='101'
      />
    );

    expect(useEffectMock).toHaveBeenCalledTimes(2);
    expect(useEffectMock.mock.calls[0][1]).toEqual([mockSelected]);
    expect(useEffectMock.mock.calls[1][1]).toEqual(['101']);

    const effectHandler = useEffectMock.mock.calls[1][0];
    effectHandler();
    expect(mockOnSelected).toHaveBeenCalledWith('101');
  });

  it('onSelect gets called as expected', () => {
    const mockTabs: IToggleButtonOption[] = [
      { label: 'Tab1', value: '101' },
      { label: 'Tab2', value: '102' },
    ];
    const mockOnSelected = jest.fn();
    useStateMock.mockReturnValue(['101', jest.fn()]);

    const testRenderer = renderer.create(
      <ToggleButtonGroup
        options={mockTabs}
        headerText=''
        onSelect={mockOnSelected}
      />
    );

    const container = testRenderer.root.findAllByType(View, { deep: false })[0];
    const label = container.props.children;
    const options = label.props.children.props.children;

    options.forEach((option: ReactTestInstance, index: number) => {
      const expectedTab = mockTabs[index];
      option.props.onPress();

      expect(mockOnSelected).toHaveBeenCalledWith(expectedTab.value);
    });
  });
});

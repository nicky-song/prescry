// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { ITestContainer } from '../../../testing/test.container';
import { mandatoryIconUsingStrikeThroughStyle } from '../../../theming/constants';
import { RadioButton } from '../../buttons/radio-button/radio-button';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import {
  IRadioButtonToggleProps,
  RadioButtonToggle,
  RadioButtonToggleHandle,
} from './radio-button-toggle';
import { radioButtonToggleStyles } from './radio-button-toggle.styles';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));

jest.mock('../../text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

const useStateMock = useState as jest.Mock;

const setSelectedOption = jest.fn();

const radioButtonToggleProps = {
  onOptionSelected: jest.fn(),
  optionAText: 'Option A',
  optionBText: 'Option B',
  headerText: 'Header Text',
  isMandatory: true,
} as IRadioButtonToggleProps;

describe('RadioButtonToggle', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useStateMock.mockReturnValue([1, setSelectedOption]);
  });

  it('renders container view with expected children', () => {
    const testRenderer = renderer.create(
      <RadioButtonToggle {...{ ...radioButtonToggleProps }} />
    );
    const container = testRenderer.root.findByProps({
      style: radioButtonToggleStyles.containerViewStyle,
    });

    const textBox = container.props.children[0];
    const radioButtonContainer = container.props.children[1];

    expect(container.type).toEqual(View);
    expect(container.props.children.length).toEqual(2);

    expect(textBox.type).toEqual(MarkdownText);
    expect(textBox.props.children).toEqual(
      `${radioButtonToggleProps.headerText} ${mandatoryIconUsingStrikeThroughStyle}`
    );
    expect(textBox.props.textStyle).toEqual(
      radioButtonToggleStyles.headerTextStyle
    );

    expect(radioButtonContainer.type).toEqual(View);
    expect(radioButtonContainer.props.style).toEqual(
      radioButtonToggleStyles.checkBoxContainerViewStyle
    );
    expect(radioButtonContainer.props.children[0].type).toEqual(RadioButton);
  });

  it('renders options when prop defined', () => {
    const mockOptions = [
      { label: 'Opt A', value: 0 },
      { label: 'Opt B', value: 1 },
      { label: 'Opt C', subLabel: 'Sub c', value: 2 },
      { label: 'Opt D', subLabel: 'Sub d', value: 3 },
    ];

    const testRenderer = renderer.create(
      <RadioButtonToggle
        {...{ ...radioButtonToggleProps }}
        options={mockOptions}
      />
    );

    const buttons = testRenderer.root.findAllByType(RadioButton);
    expect(buttons.length).toEqual(4);

    buttons.forEach((btn, i) => {
      expect(btn.props.buttonLabel).toEqual(mockOptions[i].label);
      expect(btn.props.buttonValue).toEqual(mockOptions[i].value);

      if (mockOptions[i].subLabel) {
        expect(btn.props.buttonSubLabel).toEqual(mockOptions[i].subLabel);
        expect(btn.props.testID).toEqual(
          `radioButtonToggleRadioButton-${mockOptions[i].label}`
        );
      }
    });
  });

  it('selects an option when selectOption() method is called', () => {
    const mockOptions = [
      { label: 'Opt A', value: 0 },
      { label: 'Opt B', value: 1 },
    ];

    const ref = React.createRef<RadioButtonToggleHandle>();

    const testRenderer = renderer.create(
      <RadioButtonToggle
        {...{ ...radioButtonToggleProps }}
        options={mockOptions}
        ref={ref}
      />
    );

    const buttons = testRenderer.root.findAllByType(RadioButton);
    expect(buttons[1].props.isSelected).toEqual(true);

    ref.current?.selectOption(0);
    expect(setSelectedOption).toBeCalledWith(0);
  });
});

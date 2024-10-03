// Copyright 2020 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { RadioButton } from '../../buttons/radio-button/radio-button';
import { BaseText } from '../../text/base-text/base-text';
import {
  CreateAppointmentFormMemberType,
  ICreateAppointmentFormMemberTypeProps,
} from './create-appointment-form-member-type';
import { createAppointmentFormContent } from './create-appointment-form.content';
import { createAppointmentFormStyles } from './create-appointment-form.styles';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));

const useStateMock = useState as jest.Mock;

const setSelectedOption = jest.fn();

const createAppointmentFormMemberTypeProps = {
  onMemberTypeSelected: jest.fn(),
  selectedMemberType: undefined,
} as ICreateAppointmentFormMemberTypeProps;

describe('CreateAppointmentFormMemberType', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useStateMock.mockReturnValue([1, setSelectedOption]);
  });

  it('renders container view with expected children', () => {
    const testRenderer = renderer.create(
      <CreateAppointmentFormMemberType
        {...{ ...createAppointmentFormMemberTypeProps }}
      />
    );
    const container = testRenderer.root.findByProps({
      style: createAppointmentFormStyles.aboutYouContainerViewStyle,
    });

    const textBox = container.props.children[0];
    const radioButtonContainer = container.props.children[1];

    expect(container.type).toEqual(View);
    expect(container.props.children.length).toEqual(2);

    expect(textBox.type).toEqual(BaseText);
    expect(textBox.props.weight).toEqual('semiBold');
    expect(textBox.props.children).toEqual(
      createAppointmentFormContent.requestingForCaption
    );

    expect(radioButtonContainer.type).toEqual(View);
    expect(radioButtonContainer.props.style).toEqual(
      createAppointmentFormStyles.requestingForCheckboxContainerViewStyle
    );
    expect(radioButtonContainer.props.children[0].type).toEqual(View);
    expect(radioButtonContainer.props.children[0].props.style).toEqual(
      createAppointmentFormStyles.radioButtonViewStyle
    );

    const fixedTestIDValue = 'appointmentRadio';
    expect(radioButtonContainer.props.children[0].props.children.type).toEqual(
      RadioButton
    );
    expect(
      radioButtonContainer.props.children[0].props.children.props.buttonLabel
    ).toEqual(createAppointmentFormContent.forMyselfLabel);
    expect(
      radioButtonContainer.props.children[0].props.children.props.buttonValue
    ).toEqual(0);
    expect(
      radioButtonContainer.props.children[0].props.children.props.testID
    ).toEqual(
      `${fixedTestIDValue}-${createAppointmentFormContent.forMyselfLabel}`
    );

    expect(
      radioButtonContainer.props.children[1].props.children.props.buttonLabel
    ).toEqual(createAppointmentFormContent.forAnotherPersonLabel);
    expect(
      radioButtonContainer.props.children[1].props.children.props.buttonValue
    ).toEqual(1);
    expect(
      radioButtonContainer.props.children[1].props.children.props.testID
    ).toEqual(
      `${fixedTestIDValue}-${createAppointmentFormContent.forAnotherPersonLabel}`
    );
  });
});

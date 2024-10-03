// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { DependentPicker, IDependentPickerProps } from './dependent-picker';
import { DependentPickerContent } from './dependent-picker.content';
import { dependentPickerStyle } from './dependent-picker.style';
import { BasePicker } from '../../pickers/base/base.picker';
import { IDependentProfile } from '../../../../models/member-profile/member-profile-info';
import { ProtectedView } from '../../../containers/protected-view/protected-view';

jest.mock('../../pickers/base/base.picker', () => ({
  BasePicker: () => <div />,
}));

const dependentPickerProps: IDependentPickerProps = {
  availableDependents: [
    {
      firstName: 'First-name-1',
      identifier: 'identifier-1',
      lastName: 'Last-name-1',
      rxGroupType: 'SIE',
    } as IDependentProfile,
    {
      firstName: 'First-name-2',
      identifier: 'identifier-2',
      lastName: 'Last-name-2',
      rxGroupType: 'SIE',
    } as IDependentProfile,
  ],
  onDependentSelected: jest.fn(),

  selectedValue: 'identifier-1',
};

describe('dependentPicker', () => {
  it('should have a Picker component', () => {
    const dependentPicker = renderer.create(
      <DependentPicker {...dependentPickerProps} />
    );
    const protectedView = dependentPicker.root.children[0] as ReactTestInstance;
    expect(protectedView.props.children.type).toBe(BasePicker);
  });

  it('should have Picker component with expected items and default value', () => {
    const dependentPicker = renderer.create(
      <DependentPicker {...dependentPickerProps} />
    );
    const view = dependentPicker.root.findByType(ProtectedView);
    expect(view.props.style).toEqual([
      dependentPickerStyle.dependentPickerContainerStyle,
      undefined,
    ]);

    const picker = view.props.children;
    expect(picker.type).toEqual(BasePicker);
    expect(picker.props.style).toEqual([
      dependentPickerStyle.basePickerStyle,
      undefined,
    ]);
    expect(picker.props.testID).toEqual('dependentPicker');

    const pickerItems = picker.props.children;
    expect(pickerItems.length).toBe(
      dependentPickerProps.availableDependents.length + 2
    );

    expect(pickerItems[0].props).toMatchObject({
      label: DependentPickerContent.defaultValue(),
      value: 'default',
    });
    expect(pickerItems[0].props.testID).toEqual('pickerItemDefaultValue');

    expect(pickerItems[1].props).toMatchObject({
      label: DependentPickerContent.newValue(),
      value: 'newDependent',
    });
    expect(pickerItems[1].props.testID).toEqual('pickerItemNewDependent');

    expect(pickerItems[2].props).toMatchObject({
      label: 'First-name-1 Last-name-1',
      value: dependentPickerProps.availableDependents[0].identifier,
    });
    expect(pickerItems[2].props.testID).toEqual(
      `pickerItem-${dependentPickerProps.availableDependents[0].identifier}`
    );
  });

  it('should call onDependentSelected when selectedItem is changed', () => {
    const dependentPicker = renderer.create(
      <DependentPicker {...dependentPickerProps} />
    );

    const protectedView = dependentPicker.root.children[0] as ReactTestInstance;
    const picker = protectedView.props.children;

    const onValueChange = picker.props.onValueChange;

    onValueChange(dependentPickerProps.selectedValue);

    expect(dependentPickerProps.onDependentSelected).toHaveBeenCalledWith(
      dependentPickerProps.selectedValue
    );
  });
});

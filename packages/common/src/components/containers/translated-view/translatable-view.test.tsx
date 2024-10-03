// Copyright 2022 Prescryptive Health, Inc.

import React, { useRef, useEffect, useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { TranslatableView } from './translatable-view';
import { View, ViewStyle } from 'react-native';
import { TransPerfectConstants } from '../../../models/transperfect';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
  useRef: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;
const useRefMock = useRef as jest.Mock;
const setClassAppliedMock = jest.fn();

const useRefMockReturn = {
  current: { setNativeProps: jest.fn() },
};

const nullCurrentRef = { current: null };
Object.defineProperty(nullCurrentRef, 'current', {
  get: jest.fn(() => null),
  set: jest.fn(() => null),
});

describe('TranslatableView', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useStateMock.mockReturnValueOnce([false, setClassAppliedMock]);
  });

  it('renders as View and passes props', () => {
    const styleMock: ViewStyle = { backgroundColor: 'red' };
    useRefMock.mockReturnValue(useRefMockReturn);
    const testRenderer = renderer.create(
      <TranslatableView style={styleMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual(styleMock);
  });

  it('does not call setClassApplied when viewRef.current does not exist', () => {
    useRefMock.mockReturnValue(nullCurrentRef);
    const mockChildren = <div />;
    const testRenderer = renderer.create(
      <TranslatableView>{mockChildren}</TranslatableView>
    );

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(setClassAppliedMock).not.toHaveBeenCalled();
    expect(useRefMockReturn.current.setNativeProps).not.toHaveBeenCalled();
    expect(view.type).toEqual(View);
    expect(view.props.children).toEqual(undefined);
  });

  it('calls setClassApplied with true when viewRef.current exists', () => {
    useRefMock.mockReturnValue(useRefMockReturn);
    renderer.create(<TranslatableView />);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    expect(setClassAppliedMock).toHaveBeenCalledWith(true);
    expect(useRefMockReturn.current.setNativeProps).toHaveBeenCalledWith({
      className: TransPerfectConstants.includeClass,
    });
  });

  it('passes children when classApplied', () => {
    useRefMock.mockReturnValue(useRefMockReturn);
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([true, jest.fn()]);
    const mockChildren = <div />;
    const testRenderer = renderer.create(
      <TranslatableView>{mockChildren}</TranslatableView>
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    expect(view.type).toEqual(View);
    expect(view.props.children).toEqual(mockChildren);
  });
});

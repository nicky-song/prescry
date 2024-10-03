// Copyright 2022 Prescryptive Health, Inc.

import React, { useRef, useEffect, useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ViewStyle } from 'react-native';
import { TransPerfectConstants } from '../../../models/transperfect';
import { BaseText } from '../base-text/base-text';
import { TranslatableBaseText } from './translatable-base-text';

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

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

const useRefMockReturn = {
  current: { setNativeProps: jest.fn() },
};

const nullCurrentRef = { current: null };
Object.defineProperty(nullCurrentRef, 'current', {
  get: jest.fn(() => null),
  set: jest.fn(() => null),
});

describe('TranslatableBaseText', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useStateMock.mockReturnValueOnce([false, setClassAppliedMock]);
  });

  it('renders as BaseText and passes props', () => {
    const styleMock: ViewStyle = { backgroundColor: 'red' };
    useRefMock.mockReturnValue(useRefMockReturn);
    const testRenderer = renderer.create(
      <TranslatableBaseText style={styleMock} children={undefined} />
    );

    const baseText = testRenderer.root.children[0] as ReactTestInstance;

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(styleMock);
  });

  it('does not call setClassApplied when textRef.current does not exist', () => {
    useRefMock.mockReturnValue(nullCurrentRef);
    const mockChildren = <div />;
    const testRenderer = renderer.create(
      <TranslatableBaseText>{mockChildren}</TranslatableBaseText>
    );

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    const baseText = testRenderer.root.children[0] as ReactTestInstance;

    expect(setClassAppliedMock).not.toHaveBeenCalled();
    expect(useRefMockReturn.current.setNativeProps).not.toHaveBeenCalled();
    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.children).toEqual(undefined);
  });

  it('calls setClassApplied with true when textRef.current exists', () => {
    useRefMock.mockReturnValue(useRefMockReturn);
    renderer.create(<TranslatableBaseText children={undefined} />);

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
      <TranslatableBaseText>{mockChildren}</TranslatableBaseText>
    );

    const baseText = testRenderer.root.children[0] as ReactTestInstance;
    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.children).toEqual(mockChildren);
  });

  it('re-runs useEffect and passes children when props.isSkeleton changes from true to false', () => {
    useRefMock.mockReturnValue(nullCurrentRef);

    const mockChildren = <div />;
    const testRenderer = renderer.create(
      <TranslatableBaseText isSkeleton={true}>
        {mockChildren}
      </TranslatableBaseText>
    );

    let baseText = testRenderer.root.children[0] as ReactTestInstance;
    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.children).toEqual(undefined);

    useRefMock.mockReturnValue(useRefMockReturn);
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([true, jest.fn()]);

    testRenderer.update(
      <TranslatableBaseText isSkeleton={false}>
        {mockChildren}
      </TranslatableBaseText>
    );

    baseText = testRenderer.root.children[0] as ReactTestInstance;
    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.children).toEqual(mockChildren);
  });
});

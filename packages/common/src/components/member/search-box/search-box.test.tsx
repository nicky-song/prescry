// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { SearchBox } from './search-box';
import { searchBoxContent } from './search-box.content';
import { searchBoxStyle } from './search-box.style';
import { PrimaryTextInput } from '../../inputs/primary-text/primary-text.input';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock('../../inputs/primary-text/primary-text.input', () => ({
  PrimaryTextInput: () => <div />,
}));
const useStateMock = useState as jest.Mock;

interface IStateCalls {
  setInput: [string, jest.Mock];
  setIsValidZipSearch: [boolean, jest.Mock];
}

function stateReset({
  setInput = ['', jest.fn()],
  setIsValidZipSearch = [false, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();
  useStateMock.mockReturnValueOnce(setInput);
  useStateMock.mockReturnValueOnce(setIsValidZipSearch);
}

describe('SearchBox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stateReset({});
  });
  it('renders searchBox with a test Id', () => {
    const testIDMock = 'testIDMock';
    const testRenderer = renderer.create(
      <SearchBox onSearch={jest.fn()} testID={testIDMock} />
    );
    const view = testRenderer.root.findByType(View);
    expect(view.props.style).toEqual(searchBoxStyle.searchSectionStyle);
    expect(view.props.testID).toEqual(testIDMock);
    const searchInput = view.props.children[0];
    expect(searchInput.type).toEqual(PrimaryTextInput);
    expect(searchInput.props.keyboardType).toEqual('phone-pad');
    expect(searchInput.props.onChangeText).toBeDefined();
    expect(searchInput.props.placeholder).toEqual(searchBoxContent.placeholder);
    expect(searchInput.props.maxLength).toEqual(5);
    expect(searchInput.props.onKeyPress).toBeDefined();
    expect(searchInput.props.testID).toEqual('testIDMock-input');
  });

  it('has a default value if provided', () => {
    const mockValue = '12345';
    const mockSetInput = jest.fn();
    stateReset({ setInput: [mockValue, mockSetInput] });
    const testRenderer = renderer.create(
      <SearchBox onSearch={jest.fn()} value={mockValue} />
    );
    const view = testRenderer.root.findByType(View);
    const searchInput = view.props.children[0];
    expect(searchInput.props.value).toEqual(mockValue);
  });

  it('renders searchBox button with default testId', () => {
    const testRenderer = renderer.create(<SearchBox onSearch={jest.fn()} />);
    const view = testRenderer.root.findByType(View);
    expect(view.props.style).toEqual(searchBoxStyle.searchSectionStyle);
    const searchButton = view.props.children[1];
    const searchIcon = searchButton.props.children;
    expect(searchButton.props.style).toEqual(
      searchBoxStyle.searchIconHolderStyleDisabled
    );
    expect(searchButton.props.onPress).toBeDefined();
    expect(searchButton.props.disabled).toBeTruthy();
    expect(searchButton.props.testID).toEqual('searchBox-search');
    expect(searchIcon.props.style).toEqual(searchBoxStyle.searchIconStyle);
  });
});

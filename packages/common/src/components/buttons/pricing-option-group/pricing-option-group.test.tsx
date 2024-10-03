// Copyright 2023 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  IPricingOptionSelectorOption,
  PricingOptionGroup,
} from './pricing-option-group';
import { SmartPricePricingOptionSelectorButton } from '../smart-price-pricing-option-selector/smart-price-pricing-option-selector.button';
import { PricingOption } from '../../../models/pricing-option';
import { PbmPricingOptionSelectorButton } from '../pbm-pricing-option-selector/pbm-pricing-option-selector.button';
import { ThirdPartyPricingOptionSelectorButton } from '../third-party-pricing-option-selector/third-party-pricing-option-selector.button';
import { getKey } from '../../../testing/test.helper';

jest.mock(
  '../smart-price-pricing-option-selector/smart-price-pricing-option-selector.button',
  () => ({
    SmartPricePricingOptionSelectorButton: () => <div />,
  })
);

jest.mock(
  '../pbm-pricing-option-selector/pbm-pricing-option-selector.button',
  () => ({
    PbmPricingOptionSelectorButton: () => <div />,
  })
);

jest.mock(
  '../third-party-pricing-option-selector/third-party-pricing-option-selector.button',
  () => ({
    ThirdPartyPricingOptionSelectorButton: () => <div />,
  })
);

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

function typeBasedOnPricingOption(pricingOption: PricingOption) {
  return pricingOption === 'pbm'
    ? PbmPricingOptionSelectorButton
    : pricingOption === 'smartPrice'
    ? SmartPricePricingOptionSelectorButton
    : ThirdPartyPricingOptionSelectorButton;
}

type IPricingOptionSelectorOptionMockType = IPricingOptionSelectorOption & {
  testId: string;
};

describe('PricingOptionGroup', () => {
  const selectedValueMock = 'pbm';

  const optionGroupMock: IPricingOptionSelectorOptionMockType[] = [
    {
      pricingOption: 'pbm',
      memberPays: 26.8,
      planPays: 1.8,
      testId: 'pbmPricingOptionSelectorButton',
    },
    {
      pricingOption: 'smartPrice',
      memberPays: 26.8,
      testId: 'smartPricePricingOptionSelectorButton',
    },
    {
      pricingOption: 'thirdParty',
      memberPays: 99.0,
      testId: 'thirdPartyPricingOptionSelectorButton',
    },
  ];

  beforeEach(() => {
    useStateMock.mockReset();
    useEffectMock.mockReset();
    useStateMock.mockReturnValue(['', jest.fn()]);
  });

  it('uses useEffect on load with expected value', () => {
    const mockSelected = undefined;
    useStateMock.mockReturnValue([selectedValueMock, jest.fn()]);

    const testRenderer = renderer.create(
      <PricingOptionGroup options={optionGroupMock} onSelect={jest.fn()} />
    );

    expect(useEffectMock).toHaveBeenCalledTimes(1);
    expect(useEffectMock.mock.calls[0][1]).toEqual([mockSelected]);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    testRenderer.update(
      <PricingOptionGroup
        options={optionGroupMock}
        onSelect={jest.fn()}
        selected='smartPrice'
      />
    );

    expect(useEffectMock).toHaveBeenCalledTimes(2);
    expect(useEffectMock.mock.calls[1][1]).toEqual(['smartPrice']);
  });

  it.each([
    ['testIDMock', 'testIDMock'],
    [undefined, 'pricingOptionGroup'],
  ])(
    'renders component with expected properties (testId: %p)',
    (testIdMock: string | undefined, expectedTestId: string) => {
      useStateMock.mockReturnValueOnce([0, jest.fn()]);
      const viewStyleMock = { flex: 1 };

      const testRenderer = renderer.create(
        <PricingOptionGroup
          options={[]}
          onSelect={jest.fn()}
          viewStyle={viewStyleMock}
          testID={testIdMock}
        />
      );

      const rootElement = testRenderer.root;
      expect(rootElement.type).toEqual(PricingOptionGroup);

      const container = testRenderer.root.children[0] as ReactTestInstance;

      expect(container.props.accessibilityRole).toEqual('radiogroup');
      expect(container.props.testID).toEqual(expectedTestId);
      expect(rootElement.props.viewStyle).toEqual(viewStyleMock);
    }
  );

  it('shows number of children based on options', () => {
    useStateMock.mockReturnValueOnce([0, jest.fn()]);
    const testRenderer = renderer.create(
      <PricingOptionGroup
        options={optionGroupMock}
        onSelect={jest.fn()}
        selected={selectedValueMock}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    const options = container.props.children;
    expect(options.length).toEqual(optionGroupMock.length);
  });

  it('render button based on options', () => {
    const mockSelected = 'pbm';
    useStateMock.mockReturnValueOnce([selectedValueMock, jest.fn()]);

    const testRenderer = renderer.create(
      <PricingOptionGroup
        options={optionGroupMock}
        onSelect={jest.fn()}
        selected={mockSelected}
      />
    );

    const container = testRenderer.root.findByProps({
      testID: 'pricingOptionGroup',
    });

    const options = container.props.children;

    options.forEach((option: ReactTestInstance, index: number) => {
      const expectedTab = optionGroupMock[index];
      expect(getKey(option)).toEqual(`${expectedTab.pricingOption}-${index}`);
      expect(option.type).toBe(
        typeBasedOnPricingOption(expectedTab.pricingOption)
      );
      expect(option.props.memberPays).toEqual(expectedTab.memberPays);
    });
  });

  it('calls button onPress', () => {
    const mockOnSelected = jest.fn();
    useStateMock.mockReturnValue([undefined, mockOnSelected]);

    const testRenderer = renderer.create(
      <PricingOptionGroup options={optionGroupMock} onSelect={jest.fn()} />
    );

    const container = testRenderer.root.findByProps({
      testID: 'pricingOptionGroup',
    });
    const options = container.props.children;

    options.forEach(
      (option: ReactTestInstance & { key: string }, index: number) => {
        const expectedTab = optionGroupMock[index];
        const expectedValue = expectedTab.pricingOption;

        option.props.onPress();
        expect(mockOnSelected).toHaveBeenCalledTimes(1 + index);
        expect(mockOnSelected).toHaveBeenCalledWith(expectedValue);
      }
    );
  });
});

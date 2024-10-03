// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ITestContainer } from '../../../../testing/test.container';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import {
  INoPricePricingOptionInformativePanelProps,
  NoPricePricingOptionInformativePanel,
} from './no-price-pricing-option-informative.panel';
import { getChildren } from '../../../../testing/test.helper';
import { noPricePricingOptionInformativePanelStyles } from './no-price-pricing-option-informative.panel.styles';
import { TranslatableView } from '../../../containers/translated-view/translatable-view';
import { IPricingOptionContent } from '../../../../models/cms-content/pricing-options.content';

jest.mock(
  '../pricing-option-informative/pricing-option-informative.panel',
  () => ({
    PricingOptionInformativePanel: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);

const useContentMock = useContent as jest.Mock;

describe('noPricePricingOptionInformativePanel', () => {
  const { panelViewStyle } = noPricePricingOptionInformativePanelStyles;
  const pricingOptionsContentMock: Partial<IPricingOptionContent> = {
    noPriceLabel: 'Contact the pharmacy directly for pricing.',
  };

  const customViewStyleMock: ViewStyle = { width: 1 };

  const noPricePricingOptionInfoPanelPropsMock: INoPricePricingOptionInformativePanelProps =
    {
      viewStyle: customViewStyleMock,
      testID: 'noPricePricingOptionInformativePanel',
    };

  beforeEach(() => {
    jest.clearAllMocks();
    useContentMock.mockReturnValue({
      isContentLoading: false,
      content: pricingOptionsContentMock,
    });
  });

  it.each([
    [undefined, 'noPricePricingOptionInformativePanel'],
    ['test-id', 'test-id'],
  ])(
    'renders in View container (testID: %p)',
    (testIdMock: undefined | string, expectedTestId: string) => {
      useContentMock.mockReturnValue({
        content: pricingOptionsContentMock,
        isContentLoading: false,
      });

      const testRenderer = renderer.create(
        <NoPricePricingOptionInformativePanel
          {...noPricePricingOptionInfoPanelPropsMock}
          testID={testIdMock}
        />
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;
      expect(container.type).toEqual(TranslatableView);
      expect(container.children.length).toEqual(1);
      const expectedViewStyle = [panelViewStyle, customViewStyleMock];
      expect(container.props.style).toEqual(expectedViewStyle);
      expect(container.props.testID).toEqual(expectedTestId);
    }
  );

  it.each([[undefined], ['test-id']])(
    'renders children in View container (testID: %p)',
    (testIdMock: undefined | string) => {
      const isContentLoadingMock = false;

      useContentMock.mockReturnValue({
        content: pricingOptionsContentMock,
        isContentLoading: isContentLoadingMock,
      });

      const testRenderer = renderer.create(
        <NoPricePricingOptionInformativePanel
          {...noPricePricingOptionInfoPanelPropsMock}
          testID={testIdMock}
        />
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;
      const baseContainer = getChildren(container)[0];
      const expectedGroupKey = CmsGroupKey.pricingOptions;
      expect(useContentMock).toHaveBeenCalledWith(expectedGroupKey, 2);

      expect(baseContainer.props.children).toEqual(
        pricingOptionsContentMock.noPriceLabel
      );
      expect(baseContainer.props.isSkeleton).toEqual(isContentLoadingMock);
    }
  );
});

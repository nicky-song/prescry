// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  ThirdPartyPricingOptionInformativePanel,
  IThirdPartyPricingOptionInformativePanelProps,
} from './third-party-pricing-option-informative.panel';
import { ITestContainer } from '../../../../testing/test.container';
import { PricingOptionInformativePanel } from '../pricing-option-informative/pricing-option-informative.panel';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IPricingOptionContent } from '../../../../models/cms-content/pricing-options.content';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';

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

describe('ThirdPartyPricingOptionInformativePanel', () => {
  const pricingOptionsContentMock: Partial<IPricingOptionContent> = {
    thirdPartyTitle: 'third-party-title',
    thirdPartySubText: 'third-party-sub-text',
  };

  const customViewStyleMock: ViewStyle = { width: 1 };

  const thirdPartyPricingOptionInfoPanelPropsMock: IThirdPartyPricingOptionInformativePanelProps =
    {
      memberPays: 10,
      viewStyle: customViewStyleMock,
      testID: 'thirdPartyPricingOptionInformativePanel',
    };

  beforeEach(() => {
    jest.clearAllMocks();
    useContentMock.mockReturnValue({
      isContentLoading: false,
      content: pricingOptionsContentMock,
    });
  });

  it.each([
    [undefined, 'thirdPartyPricingOptionInformativePanel'],
    ['test-id', 'test-id'],
  ])(
    'renders in View container (testID: %p)',
    (testIdMock: undefined | string, expectedTestId: string) => {
      const isContentLoading = false;
      useContentMock.mockReturnValue({
        content: pricingOptionsContentMock,
        isContentLoading,
      });

      const testRenderer = renderer.create(
        <ThirdPartyPricingOptionInformativePanel
          {...thirdPartyPricingOptionInfoPanelPropsMock}
          testID={testIdMock}
        />
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;

      const expectedGroupKey = CmsGroupKey.pricingOptions;
      expect(useContentMock).toHaveBeenCalledWith(expectedGroupKey, 2);

      expect(container.type).toEqual(PricingOptionInformativePanel);
      expect(container.props.title).toEqual(
        pricingOptionsContentMock.thirdPartyTitle
      );
      expect(container.props.memberPays).toEqual(
        thirdPartyPricingOptionInfoPanelPropsMock.memberPays
      );
      expect(container.props.subText).toEqual(
        pricingOptionsContentMock.thirdPartySubText
      );
      expect(container.props.viewStyle).toEqual(customViewStyleMock);
      expect(container.props.isSkeleton).toEqual(isContentLoading);
      expect(container.props.testID).toEqual(expectedTestId);
    }
  );
});

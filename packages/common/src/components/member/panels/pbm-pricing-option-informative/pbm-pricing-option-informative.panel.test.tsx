// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  PbmPricingOptionInformativePanel,
  IPbmPricingOptionInformativePanelProps,
} from './pbm-pricing-option-informative.panel';
import { ITestContainer } from '../../../../testing/test.container';
import { PricingOptionInformativePanel } from '../pricing-option-informative/pricing-option-informative.panel';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IPricingOptionContent } from '../../../../models/cms-content/pricing-options.content';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { StringFormatter } from '../../../../utils/formatters/string.formatter';

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

jest.mock('../../../../utils/formatters/string.formatter');
const formatMock = StringFormatter.format as jest.Mock;

const useContentMock = useContent as jest.Mock;

describe('PbmPricingOptionInformativePanel', () => {
  const pricingOptionsContentMock: Partial<IPricingOptionContent> = {
    pbmTitle: 'pbm-title',
    pbmSubText: 'pbm-sub-text',
  };

  const customViewStyleMock: ViewStyle = { width: 1 };

  const pbmPricingOptionInfoPanelPropsMock: IPbmPricingOptionInformativePanelProps =
    {
      memberPays: 10,
      planPays: 20,
      viewStyle: customViewStyleMock,
      testID: 'pbmPricingOptionInformativePanel',
    };

  beforeEach(() => {
    jest.clearAllMocks();
    useContentMock.mockReturnValue({
      isContentLoading: false,
      content: pricingOptionsContentMock,
    });
    formatMock.mockReturnValue(pricingOptionsContentMock.pbmSubText);
  });

  it.each([
    [undefined, 'pbmPricingOptionInformativePanel'],
    ['test-id', 'test-id'],
  ])(
    'renders in View container (testID: %p)',
    (testIdMock: undefined | string, expectedTestId: string) => {
      useContentMock.mockReturnValue({
        content: pricingOptionsContentMock,
        isContentLoading: false,
      });

      const testRenderer = renderer.create(
        <PbmPricingOptionInformativePanel
          {...pbmPricingOptionInfoPanelPropsMock}
          testID={testIdMock}
        />
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;

      const expectedGroupKey = CmsGroupKey.pricingOptions;
      expect(useContentMock).toHaveBeenCalledWith(expectedGroupKey, 2);

      expect(container.type).toEqual(PricingOptionInformativePanel);
      expect(container.props.title).toEqual(pricingOptionsContentMock.pbmTitle);
      expect(container.props.memberPays).toEqual(
        pbmPricingOptionInfoPanelPropsMock.memberPays
      );
      expect(container.props.subText).toEqual(
        pricingOptionsContentMock.pbmSubText
      );
      expect(container.props.viewStyle).toEqual(customViewStyleMock);
      expect(container.props.isSkeleton).toEqual(false);
      expect(container.props.testID).toEqual(expectedTestId);
    }
  );
});

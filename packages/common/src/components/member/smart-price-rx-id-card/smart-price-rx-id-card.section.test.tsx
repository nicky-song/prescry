// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { SmartPriceRxIdCardSection } from './smart-price-rx-id-card.section';
import { RxGroupTypesEnum } from '../../../models/member-profile/member-profile-info';
import { RxIdCardSection } from '../rx-id-card/rx-id-card.section';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IContentWithIsLoading } from '../../../models/cms-content/content-with-isloading.model';
import { IRxIdCardSectionContent } from '../../../models/cms-content/rx-id-card-section';

jest.mock('../rx-id-card/rx-id-card.section', () => ({
  RxIdCardSection: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

describe('SmartPriceRxIdCardSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({ content: {} });
  });

  const mockData = {
    profile: {
      firstName: 'Klein',
      lastName: 'Claire',
      dateOfBirth: '01-01-2000',
      identifier: '123456789',
      phoneNumber: '1112223333',
      primaryMemberRxId: 'T12345678901',
      primaryMemberFamilyId: 'T123456789',
      primaryMemberPersonCode: '01',
      rxGroupType: RxGroupTypesEnum.SIE,
      rxGroup: 'HMA01',
      rxSubGroup: '',
      rxBin: '610749',
      carrierPCN: 'PH',
    },
  };

  it('gets content', () => {
    renderer.create(<SmartPriceRxIdCardSection profile={mockData.profile} />);

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.rxIdCardSection,
      2
    );
  });

  it.each([
    ['testId', 'testId'],
    [undefined, 'smartPriceRxIdCardSection'],
  ])(
    'renders RxIdCardSection component ',
    (testIdMock: undefined | string, expected: string) => {
      const isContentLoadingMock = true;
      const titleMock = 'title-mock';
      const descriptionMock = 'description-mock';
      const viewStyleMock: ViewStyle = { width: 1 };

      const contentWithIsLoadingMock: Partial<
        IContentWithIsLoading<Partial<IRxIdCardSectionContent>>
      > = {
        isContentLoading: isContentLoadingMock,
        content: {
          smartPriceTitle: titleMock,
          smartPriceDescription: descriptionMock,
        },
      };
      useContentMock.mockReturnValue(contentWithIsLoadingMock);
      const testRenderer = renderer.create(
        <SmartPriceRxIdCardSection
          profile={mockData.profile}
          testID={testIdMock}
          viewStyle={viewStyleMock}
        ></SmartPriceRxIdCardSection>
      );

      const rxIdCardSection = testRenderer.root
        .children[0] as ReactTestInstance;

      expect(rxIdCardSection.type).toEqual(RxIdCardSection);
      expect(rxIdCardSection.props.profile).toEqual(mockData.profile);
      expect(rxIdCardSection.props.cardType).toEqual('smartPrice');
      expect(rxIdCardSection.props.description).toEqual(descriptionMock);
      expect(rxIdCardSection.props.title).toEqual(titleMock);
      expect(rxIdCardSection.props.viewStyle).toEqual(viewStyleMock);
      expect(rxIdCardSection.props.testID).toEqual(expected);
    }
  );
});

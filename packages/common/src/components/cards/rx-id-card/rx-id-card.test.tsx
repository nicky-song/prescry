// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View, ViewStyle } from 'react-native';
import {
  IPrimaryProfile,
  RxGroupTypesEnum,
} from '../../../models/member-profile/member-profile-info';
import { getChildren } from '../../../testing/test.helper';
import { ImageAsset } from '../../image-asset/image-asset';
import { RemoteImageAsset } from '../../remote-image-asset/remote-image-asset';
import { IRxIdCardStyles, rxIdCardStyles } from './rx-id-card.styles';
import { ICobrandingContent } from '../../../models/cms-content/co-branding.ui-content';
import { useCobrandingContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-cobranding-content';
import { RxIdCard } from './rx-id-card';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { BaseText } from '../../text/base-text/base-text';
import { useMediaQueryContext } from '../../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook';
import { MemberNameFormatter } from '../../../utils/formatters/member-name-formatter';
import { ProtectedView } from '../../containers/protected-view/protected-view';
import { RxLabelWithValue } from '../../text/rx-label-with-value/rx-label-with-value';
import { SmartPriceConstants } from '../../../models/smartprice-constants';
import { RxCardType } from '../../../models/rx-id-card';

jest.mock('../../image-asset/image-asset', () => ({
  ImageAsset: () => <div />,
}));

jest.mock('../../remote-image-asset/remote-image-asset', () => ({
  RemoteImageAsset: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-cobranding-content'
);
const useCobrandingContentMock = useCobrandingContent as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook'
);
const useMediaQueryContextMock = useMediaQueryContext as jest.Mock;

jest.mock('./rx-id-card.styles');
const rxIdCardStylesMock = rxIdCardStyles as jest.Mock;

jest.mock('../../containers/protected-view/protected-view', () => ({
  ProtectedView: () => <div />,
}));

jest.mock('../../member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../text/rx-label-with-value/rx-label-with-value', () => ({
  RxLabelWithValue: () => <div />,
}));

const mockPrimaryProfile = {
  rxGroup: '823A37Q',
  rxBin: '765432',
  carrierPCN: 'X98',
  email: '',
  firstName: 'Claire',
  identifier: '6000b2fa965fa7b37c00a7b2',
  isLimited: false,
  isPhoneNumberVerified: false,
  isPrimary: false,
  lastName: 'Karlson',
  phoneNumber: '',
  primaryMemberFamilyId: 'SMJE9BG',
  primaryMemberPersonCode: '03',
  primaryMemberRxId: 'SMJE9BG',
  age: 4,
} as IPrimaryProfile;

const mockProfile: IPrimaryProfile = {
  firstName: 'First',
  lastName: 'Last',
  dateOfBirth: '',
  identifier: '',
  phoneNumber: '',
  primaryMemberRxId: '',
  primaryMemberFamilyId: 'T31313131313',
  primaryMemberPersonCode: '01',
  rxGroupType: RxGroupTypesEnum.SIE,
  rxGroup: 'HMA01',
  rxSubGroup: '',
  rxBin: '610749',
  carrierPCN: 'PH',
};

const contentMock = {
  idLabel: 'id-label-mock',
  groupLabel: 'group-label-mock',
  binLabel: 'bin-label-mock',
  pcnLabel: 'pcn-label-mock',
  rxSavingsLabel: 'rx-savings-label-mock',
  rxBenefitsLabel: 'rx-benefits-label-mock',
  unauthMessage: 'unauth-message-mock',
  memberIdLabel: 'member-id-label-mock',
};

const isContentLoadingMock = false;

const windowWidthMock = 10;

describe('RxIdCard', () => {
  beforeEach(() => {
    rxIdCardStylesMock.mockReturnValue({});
    useCobrandingContentMock.mockReturnValue({});
    useMediaQueryContextMock.mockReturnValue({
      windowWidth: windowWidthMock,
    });
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: isContentLoadingMock,
    });
  });

  it.each([['smartPrice' as RxCardType], ['pbm' as RxCardType]])(
    'renders in card container',
    (cardType: RxCardType) => {
      const rxIdCardMock: Partial<IRxIdCardStyles> = {
        containerViewStyle: {
          width: 1,
        },
        containerPbmViewStyle: {
          width: 2,
        },
        containerSmartPriceViewStyle: {
          width: 3,
        },
      };
      rxIdCardStylesMock.mockReturnValue(rxIdCardMock);
      const customViewStyle: ViewStyle = {
        width: 1,
      };
      const cardColorStyle =
        cardType === 'pbm'
          ? rxIdCardMock.containerPbmViewStyle
          : rxIdCardMock.containerSmartPriceViewStyle;
      const testRenderer = renderer.create(
        <RxIdCard
          viewStyle={customViewStyle}
          profile={mockProfile}
          rxCardType={cardType}
        />
      );
      const container = testRenderer.root.children[0] as ReactTestInstance;

      expect(container.type).toEqual(View);
      expect(container.props.testID).toEqual('rxIdCard');
      expect(container.props.style).toEqual([
        rxIdCardMock.containerViewStyle,
        cardColorStyle,
        customViewStyle,
      ]);
      expect(getChildren(container).length).toEqual(3);
    }
  );

  it.each([['smartPrice' as RxCardType], ['pbm' as RxCardType]])(
    'renders card background image',
    (cardType: RxCardType) => {
      const rxIdCardMock: Partial<IRxIdCardStyles> = {
        pbmBackgroundImageStyle: {
          width: 1,
        },
        smartPriceBackgroundImageStyle: {
          width: 1,
        },
      };
      rxIdCardStylesMock.mockReturnValue(rxIdCardMock);
      const testRenderer = renderer.create(
        <RxIdCard profile={mockProfile} rxCardType={cardType} />
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;
      const imageAsset = getChildren(container)[0];
      expect(imageAsset.type).toEqual(ImageAsset);
      if (cardType === 'pbm') {
        expect(imageAsset.props.name).toEqual('rxIdCardFlower');
        expect(imageAsset.props.resizeMethod).toEqual('scale');
        expect(imageAsset.props.style).toEqual(
          rxIdCardMock.pbmBackgroundImageStyle
        );
      } else {
        expect(imageAsset.props.name).toEqual('rxIdSavingsCardPattern');
        expect(imageAsset.props.resizeMethod).toEqual('scale');
        expect(imageAsset.props.style).toEqual(
          rxIdCardMock.smartPriceBackgroundImageStyle
        );
      }
    }
  );

  it('renders card header container', () => {
    const rxIdCardMock: Partial<IRxIdCardStyles> = {
      headerViewStyle: {
        width: 1,
      },
    };
    rxIdCardStylesMock.mockReturnValue(rxIdCardMock);
    const testRenderer = renderer.create(
      <RxIdCard profile={mockProfile} rxCardType='pbm' />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;
    const rowHeader = getChildren(container)[1];
    expect(rowHeader.type).toEqual(View);
    expect(rowHeader.props.testID).toEqual('rxIdCardHeader');
    expect(rowHeader.props.style).toEqual(rxIdCardMock.headerViewStyle);
    expect(getChildren(rowHeader).length).toEqual(2);
  });

  it('renders card body', () => {
    const rxIdCardMock: Partial<IRxIdCardStyles> = {
      contentContainerViewStyle: {
        width: 1,
      },
    };
    rxIdCardStylesMock.mockReturnValue(rxIdCardMock);
    const testRenderer = renderer.create(
      <RxIdCard profile={mockProfile} rxCardType='pbm' />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;
    const cardBody = getChildren(container)[2];
    expect(cardBody.type).toEqual(View);
    expect(cardBody.props.testID).toEqual('rxIdCardBody');
    expect(cardBody.props.style).toEqual(rxIdCardMock.bodyContainerViewStyle);
  });

  it('renders brand image', () => {
    const rxIdCardMock: Partial<IRxIdCardStyles> = {
      logoContainerViewStyle: {
        width: 1,
      },
      logoImageStyle: {
        width: 2,
      },
    };
    rxIdCardStylesMock.mockReturnValue(rxIdCardMock);
    const testRenderer = renderer.create(
      <RxIdCard profile={mockProfile} rxCardType='pbm' />
    );

    const headerContainer = testRenderer.root.findByProps({
      testID: 'rxIdCardHeader',
    });
    const imageContainer = getChildren(headerContainer)[0];
    expect(imageContainer.type).toEqual(View);
    expect(imageContainer.props.style).toEqual(
      rxIdCardMock.logoContainerViewStyle
    );
    const image = getChildren(imageContainer)[0];
    expect(image.type).toEqual(ImageAsset);
    expect(image.props.name).toEqual('prescryptiveBrandWhite');
    expect(image.props.style).toEqual(rxIdCardMock.logoImageStyle);
    expect(image.props.resizeMethod).toEqual('scale');
  });

  it.each([['smartPrice' as RxCardType], ['pbm' as RxCardType]])(
    'renders co-branding header annotation (rxCardType: %s)',
    (rxCardType: RxCardType) => {
      const isSmartPrice = rxCardType === 'smartPrice';
      const rxIdCardMock: Partial<IRxIdCardStyles> = {
        providerImageContainer: {
          width: 1,
        },
        providerImageStyle: {
          width: 2,
        },
      };
      rxIdCardStylesMock.mockReturnValue(rxIdCardMock);
      const profileMock: IPrimaryProfile = {
        ...mockPrimaryProfile,
        rxGroupType: RxGroupTypesEnum.SIE,
      };

      const idCardLogoMock = 'id-card-logo';
      const cobrandingContentMock: ICobrandingContent = {
        idCardLogo: idCardLogoMock,
      };
      useCobrandingContentMock.mockReturnValue(cobrandingContentMock);

      const testRenderer = renderer.create(
        <RxIdCard profile={profileMock} rxCardType={rxCardType} />
      );

      const headerContainer = testRenderer.root.findByProps({
        testID: 'rxIdCardHeader',
      });
      const annotationContainer = getChildren(headerContainer)[1];
      expect(annotationContainer.type).toEqual(View);
      expect(annotationContainer.props.style).toEqual(
        rxIdCardMock.providerImageContainer
      );

      if (isSmartPrice) {
        expect(getChildren(annotationContainer)[0].type).toEqual(BaseText);
        expect(getChildren(annotationContainer)[0].props.style).toEqual([
          rxIdCardMock.headerTextStyle,
          rxIdCardMock.headerSmartPriceTextStyle,
        ]);
        expect(getChildren(annotationContainer)[0].props.isSkeleton).toEqual(
          isContentLoadingMock
        );
        expect(getChildren(annotationContainer)[0].props.skeletonWidth).toEqual(
          'medium'
        );
        expect(getChildren(annotationContainer)[0].props.children).toEqual(
          contentMock.rxSavingsLabel
        );
      } else {
        expect(getChildren(annotationContainer)[0].type).toEqual(
          RemoteImageAsset
        );
        expect(getChildren(annotationContainer)[0].props.uri).toEqual(
          idCardLogoMock
        );
        expect(getChildren(annotationContainer)[0].props.style).toEqual(
          rxIdCardMock.providerImageStyle
        );
      }
    }
  );

  it('renders pbm plan label header', () => {
    const rxIdCardMock: Partial<IRxIdCardStyles> = {
      providerImageContainer: {
        width: 1,
      },
      headerTextStyle: { width: 2 },
      headerPbmTextStyle: {
        width: 3,
      },
    };
    rxIdCardStylesMock.mockReturnValue(rxIdCardMock);
    const profileMock: IPrimaryProfile = {
      ...mockPrimaryProfile,
      rxGroupType: RxGroupTypesEnum.SIE,
    };

    useCobrandingContentMock.mockReturnValue({});

    const testRenderer = renderer.create(
      <RxIdCard profile={profileMock} rxCardType='pbm' />
    );

    const headerContainer = testRenderer.root.findByProps({
      testID: 'rxIdCardHeader',
    });
    const annotationContainer = getChildren(headerContainer)[1];
    expect(annotationContainer.type).toEqual(View);
    expect(annotationContainer.props.style).toEqual(
      rxIdCardMock.providerImageContainer
    );

    expect(getChildren(annotationContainer)[0].type).toEqual(BaseText);
    expect(getChildren(annotationContainer)[0].props.style).toEqual([
      rxIdCardMock.headerTextStyle,
      rxIdCardMock.headerPbmTextStyle,
    ]);
    expect(getChildren(annotationContainer)[0].props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(getChildren(annotationContainer)[0].props.skeletonWidth).toEqual(
      'medium'
    );
    expect(getChildren(annotationContainer)[0].props.children).toEqual(
      contentMock.rxBenefitsLabel
    );
  });

  it('renders rx smartPrice label header', () => {
    const rxIdCardMock: Partial<IRxIdCardStyles> = {
      providerImageContainer: {
        width: 1,
      },
      headerTextStyle: { width: 2 },
      headerPbmTextStyle: {
        width: 3,
      },
    };
    rxIdCardStylesMock.mockReturnValue(rxIdCardMock);
    useCobrandingContentMock.mockReturnValue({});

    const testRenderer = renderer.create(
      <RxIdCard profile={mockProfile} rxCardType='smartPrice' />
    );

    const headerContainer = testRenderer.root.findByProps({
      testID: 'rxIdCardHeader',
    });
    const annotationContainer = getChildren(headerContainer)[1];
    expect(annotationContainer.type).toEqual(View);
    expect(annotationContainer.props.style).toEqual(
      rxIdCardMock.providerImageContainer
    );

    expect(getChildren(annotationContainer)[0].type).toEqual(BaseText);
    expect(getChildren(annotationContainer)[0].props.style).toEqual([
      rxIdCardMock.headerTextStyle,
      rxIdCardMock.headerSmartPriceTextStyle,
    ]);
    expect(getChildren(annotationContainer)[0].props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(getChildren(annotationContainer)[0].props.skeletonWidth).toEqual(
      'medium'
    );
    expect(getChildren(annotationContainer)[0].props.children).toEqual(
      contentMock.rxSavingsLabel
    );
  });

  it('renders as View with expected style', () => {
    const rxIdCardMock: Partial<IRxIdCardStyles> = {
      bodyContainerViewStyle: {
        width: 1,
      },
    };
    rxIdCardStylesMock.mockReturnValue(rxIdCardMock);

    const testRenderer = renderer.create(
      <RxIdCard profile={mockProfile} rxCardType='smartPrice' />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const bodyView = getChildren(view)[2];

    expect(bodyView.type).toEqual(View);
    expect(bodyView.props.style).toEqual(rxIdCardMock.bodyContainerViewStyle);
  });

  it.each([['smartPrice' as RxCardType], ['pbm' as RxCardType]])(
    '(1st) renders name as BaseText for %p card',
    (cardType: RxCardType) => {
      const rxIdCardMock: Partial<IRxIdCardStyles> = {
        pbmNameTextStyle: {
          width: 1,
        },
        smartPriceNameTextStyle: {
          width: 2,
        },
      };
      rxIdCardStylesMock.mockReturnValue(rxIdCardMock);

      const testRenderer = renderer.create(
        <RxIdCard profile={mockProfile} rxCardType={cardType} />
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;

      const bodyView = getChildren(view)[2];

      const name = getChildren(bodyView)[0];

      expect(name.type).toEqual(BaseText);
      expect(name.props.children).toEqual(
        MemberNameFormatter.formatName(
          mockProfile.firstName,
          mockProfile.lastName
        )
      );
      if (cardType === 'pbm') {
        expect(name.props.style).toEqual(rxIdCardMock.pbmNameTextStyle);
      } else {
        expect(name.props.style).toEqual(rxIdCardMock.smartPriceNameTextStyle);
      }
    }
  );

  it.each([['smartPrice' as RxCardType], ['pbm' as RxCardType]])(
    '(2nd) renders id View w/ id label & id as BaseText for %p card',
    (cardType: RxCardType) => {
      const rxIdCardMock: Partial<IRxIdCardStyles> = {
        idViewStyle: {
          width: 1,
        },
        pbmIdLabelTextStyle: {
          width: 2,
        },
        smartPriceIdLabelTextStyle: {
          width: 3,
        },
        idTextViewStyle: {
          width: 4,
        },
        pbmIdTextStyle: {
          width: 5,
        },
        smartPriceIdTextStyle: {
          width: 6,
        },
      };
      rxIdCardStylesMock.mockReturnValue(rxIdCardMock);

      const testRenderer = renderer.create(
        <RxIdCard profile={mockProfile} rxCardType={cardType} />
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;

      const bodyView = getChildren(view)[2];

      const idView = getChildren(bodyView)[1];

      expect(idView.type).toEqual(View);
      expect(idView.props.style).toEqual(rxIdCardMock.idViewStyle);

      const idLabel = getChildren(idView)[0];
      const protectedView = getChildren(idView)[1];
      const id = getChildren(protectedView)[0];

      expect(idLabel.type).toEqual(BaseText);
      if (cardType === 'pbm')
        expect(idLabel.props.style).toEqual(rxIdCardMock.pbmIdLabelTextStyle);
      else
        expect(idLabel.props.style).toEqual(
          rxIdCardMock.smartPriceIdLabelTextStyle
        );
      expect(idLabel.props.children).toEqual(contentMock.idLabel);
      expect(idLabel.props.isSkeleton).toEqual(isContentLoadingMock);

      expect(protectedView.type).toEqual(ProtectedView);
      expect(protectedView.props.style).toEqual(rxIdCardMock.idTextViewStyle);
      expect(getChildren(protectedView).length).toEqual(1);

      expect(id.type).toEqual(BaseText);
      if (cardType === 'pbm')
        expect(id.props.style).toEqual(rxIdCardMock.pbmIdTextStyle);
      else expect(id.props.style).toEqual(rxIdCardMock.smartPriceIdTextStyle);
      expect(id.props.children).toEqual(mockProfile.primaryMemberFamilyId);
    }
  );

  it('(3rd) renders rx View w/ group, bin, and pcn sections', () => {
    const rxIdCardMock: Partial<IRxIdCardStyles> = {
      rxViewStyle: {
        width: 1,
      },
    };
    rxIdCardStylesMock.mockReturnValue(rxIdCardMock);

    const testRenderer = renderer.create(
      <RxIdCard profile={mockProfile} rxCardType='pbm' />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const bodyView = getChildren(view)[2];

    const rxView = getChildren(bodyView)[2];

    expect(rxView.type).toEqual(View);
    expect(rxView.props.style).toEqual([rxIdCardMock.rxViewStyle, undefined]);

    const group = getChildren(rxView)[0];
    const bin = getChildren(rxView)[1];
    const pcn = getChildren(rxView)[2];

    expect(group.type).toEqual(RxLabelWithValue);

    expect(bin.type).toEqual(RxLabelWithValue);

    expect(pcn.type).toEqual(RxLabelWithValue);
  });

  it.each([['smartPrice' as RxCardType], ['pbm' as RxCardType]])(
    '(4th) label at bottom of %s card when cobranding',
    (cardType: RxCardType) => {
      const rxIdCardMock: Partial<IRxIdCardStyles> = {
        cobrandingPbmTextStyle: {
          width: 1,
        },
        cobrandingSmartPriceTextStyle: {
          width: 2,
        },
        bottomSpacingViewStyle: {
          width: 3,
        },
      };
      rxIdCardStylesMock.mockReturnValue(rxIdCardMock);

      const idCardLogoMock = 'id-card-logo';
      const cobrandingContentMock: ICobrandingContent = {
        idCardLogo: idCardLogoMock,
      };
      useCobrandingContentMock.mockReturnValue(cobrandingContentMock);

      const testRenderer = renderer.create(
        <RxIdCard profile={mockProfile} rxCardType={cardType} />
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;

      const bodyView = getChildren(view)[2];

      const labelWithCobranding = getChildren(bodyView)[3];

      if (cardType === 'pbm') {
        expect(labelWithCobranding.type).toEqual(BaseText);
        expect(labelWithCobranding.props.style).toEqual(
          rxIdCardMock.cobrandingPbmTextStyle
        );
        expect(labelWithCobranding.props.isSkeleton).toEqual(
          isContentLoadingMock
        );
        expect(labelWithCobranding.props.skeletonWidth).toEqual('medium');
        expect(labelWithCobranding.props.children).toEqual(
          contentMock.rxBenefitsLabel
        );
      } else if (cardType === 'smartPrice') {
        expect(labelWithCobranding.type).toEqual(View);
        expect(labelWithCobranding.props.style).toEqual(
          rxIdCardMock.bottomSpacingViewStyle
        );
      }
    }
  );

  it('renders unauth card scenario with default values when !profile', () => {
    rxIdCardStylesMock.mockReset();
    const rxIdCardMock: Partial<IRxIdCardStyles> = {
      memberIdTextStyle: {
        width: 1,
      },
      unauthMessageTextStyle: {
        width: 2,
      },
    };
    rxIdCardStylesMock.mockReturnValue(rxIdCardMock);

    const testRenderer = renderer.create(<RxIdCard rxCardType='smartPrice' />);

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const bodyView = getChildren(view)[2];

    const bodyHeading = getChildren(bodyView)[0];
    const bodyId = getChildren(bodyView)[1];

    expect(bodyHeading.type).toEqual(BaseText);
    expect(bodyHeading.props.style).toEqual(rxIdCardMock.memberIdTextStyle);
    expect(bodyHeading.props.children).toEqual(contentMock.memberIdLabel);

    expect(bodyId.type).toEqual(BaseText);
    expect(bodyId.props.style).toEqual(rxIdCardMock.unauthMessageTextStyle);
    expect(bodyId.props.children).toEqual(contentMock.unauthMessage);

    const rxView = getChildren(bodyView)[2];

    expect(rxView.type).toEqual(View);
    expect(rxView.props.style).toEqual([rxIdCardMock.rxViewStyle, undefined]);

    const group = getChildren(rxView)[0];
    const bin = getChildren(rxView)[1];
    const pcn = getChildren(rxView)[2];

    expect(group.type).toEqual(RxLabelWithValue);
    expect(group.props.value).toEqual(SmartPriceConstants.group);

    expect(bin.type).toEqual(RxLabelWithValue);
    expect(bin.props.value).toEqual(SmartPriceConstants.bin);

    expect(pcn.type).toEqual(RxLabelWithValue);
    expect(pcn.props.value).toEqual(SmartPriceConstants.pcn);
  });
});

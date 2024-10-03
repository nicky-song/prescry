// Copyright 2022 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { Modal, View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { useCobrandingContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-cobranding-content';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ICobrandingContent } from '../../../models/cms-content/co-branding.ui-content';
import { ITestContainer } from '../../../testing/test.container';
import { getChildren } from '../../../testing/test.helper';
import { removeSearchParamsFromUrl } from '../../../utils/remove-search-params-from-url.helper';
import { BaseButton } from '../../buttons/base/base.button';
import { ImageAsset } from '../../image-asset/image-asset';
import { RemoteImageAsset } from '../../remote-image-asset/remote-image-asset';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { WelcomeModal } from './welcome-modal';
import { welcomeModalStyles } from './welcome-modal.styles';

jest.mock('../../text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-cobranding-content'
);
const useCobrandingContentMock = useCobrandingContent as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../../buttons/base/base.button', () => ({
  BaseButton: () => <div />,
}));

jest.mock('../../../utils/remove-search-params-from-url.helper');
const removeSearchParamsFromUrlMock = removeSearchParamsFromUrl as jest.Mock;

jest.mock('../../remote-image-asset/remote-image-asset', () => ({
  RemoteImageAsset: () => <div />,
}));

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;

const setIsModalVisibleMock = jest.fn();
const rxGroupMock = 'test-rx-group';
const brokerIdMock = 'test-broker-id';
const cobrandingContentMock: ICobrandingContent = {
  logo: 'test-logo',
  interstitialContent: 'Test cobranding text',
  idCardLogo: '',
  idCardHeaderColor: '',
};
const brokerIdCobrandingContentMock: ICobrandingContent = {
  logo: 'test-broker-logo',
  interstitialContent: 'Test brokerId text',
  idCardLogo: '',
  idCardHeaderColor: '',
};
const globalContentMock = {
  content: { okButton: 'OK' },
  isContentLoading: jest.fn(),
};

interface stateMock {
  isModalVisible?: [boolean, () => void];
}

const resetState = (newStateValues: stateMock) => {
  useStateMock.mockReset();
  useStateMock.mockReturnValueOnce(
    newStateValues.isModalVisible ?? [true, setIsModalVisibleMock]
  );
};

describe('WelcomeModal', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    resetState({});
    useCobrandingContentMock.mockReturnValue(cobrandingContentMock);
    useContentMock.mockReturnValue(globalContentMock);
  });

  it('renders top level Modal as expected', () => {
    const testRenderer = renderer.create(
      <WelcomeModal rxGroup={rxGroupMock} />
    );
    const modal = testRenderer.root.children[0] as ReactTestInstance;

    expect(modal.type).toEqual(Modal);
    expect(modal.props.visible).toEqual(true);
    expect(modal.props.transparent).toEqual(true);
  });

  it('should hide modal if rxGroup and brokerId cobranding content do not exist', () => {
    useCobrandingContentMock.mockReturnValue({
      interstitialContent: '',
    } as ICobrandingContent);
    const testRenderer = renderer.create(
      <WelcomeModal rxGroup={rxGroupMock} brokerId={brokerIdMock} />
    );
    const modal = testRenderer.root.children[0] as ReactTestInstance;

    useEffectMock.mock.calls[0][0]();

    expect(useCobrandingContentMock).toHaveBeenCalledTimes(2);
    expect(useCobrandingContentMock).toHaveBeenNthCalledWith(1, rxGroupMock);
    expect(useCobrandingContentMock).toHaveBeenNthCalledWith(2, brokerIdMock);
    expect(setIsModalVisibleMock).toHaveBeenCalledWith(false);
    expect(modal.type).toEqual(Modal);
    expect(modal.props.transparent).toEqual(true);
  });

  it('renders background container as expected', () => {
    const testRenderer = renderer.create(
      <WelcomeModal rxGroup={rxGroupMock} />
    );
    const modal = testRenderer.root.children[0] as ReactTestInstance;
    const backgroundContainer = getChildren(modal)[0];

    expect(getChildren(backgroundContainer).length).toEqual(1);
    expect(backgroundContainer.type).toEqual(View);
    expect(backgroundContainer.props.testID).toEqual(
      'welcomeModalBackgroundView'
    );
    expect(backgroundContainer.props.style).toEqual(
      welcomeModalStyles.outerContainerViewStyle
    );
  });

  it('renders inner container as expected', () => {
    const testRenderer = renderer.create(
      <WelcomeModal rxGroup={rxGroupMock} />
    );
    const backgroundContainer = testRenderer.root.findByProps({
      testID: 'welcomeModalBackgroundView',
    });
    const innerContainer = getChildren(backgroundContainer)[0];

    expect(getChildren(innerContainer).length).toEqual(3);
    expect(innerContainer.type).toEqual(View);
    expect(innerContainer.props.testID).toEqual('welcomeModalView');
    expect(innerContainer.props.style).toEqual(
      welcomeModalStyles.modalViewStyle
    );
  });

  it('renders logo container as expected', () => {
    const testRenderer = renderer.create(
      <WelcomeModal rxGroup={rxGroupMock} />
    );
    const container = testRenderer.root.findByProps({
      testID: 'welcomeModalView',
    });
    const logoContainer = getChildren(container)[0];

    expect(getChildren(logoContainer).length).toEqual(2);
    expect(logoContainer.type).toEqual(View);
    expect(logoContainer.props.testID).toEqual('welcomeModalLogoHolder');
    expect(logoContainer.props.style).toEqual(
      welcomeModalStyles.logoHolderViewStyle
    );
  });

  it('should return BackButton along with props', () => {
    const testRenderer = renderer.create(
      <WelcomeModal rxGroup={rxGroupMock} />
    );
    const logoContainer = testRenderer.root.findByProps({
      testID: 'welcomeModalLogoHolder',
    });
    const myRxLogo = getChildren(logoContainer)[0];

    expect(myRxLogo.type).toEqual(ImageAsset);

    expect(myRxLogo.props.name).toEqual('headerMyPrescryptiveLogo');
    expect(myRxLogo.props.style).toEqual(
      welcomeModalStyles.brandMyPrescryptiveImageStyle
    );

    expect(myRxLogo.props.resizeMode).toEqual('contain');
  });

  it.each([
    [
      cobrandingContentMock,
      { ...brokerIdCobrandingContentMock, logo: '' } as ICobrandingContent,
      RemoteImageAsset,
      cobrandingContentMock.logo,
    ],
    [
      {
        ...cobrandingContentMock,
        logo: '',
      } as ICobrandingContent,
      brokerIdCobrandingContentMock,
      undefined,
      undefined,
    ],
    [
      {
        ...cobrandingContentMock,
        interstitialContent: '',
      } as ICobrandingContent,
      brokerIdCobrandingContentMock,
      RemoteImageAsset,
      brokerIdCobrandingContentMock.logo,
    ],
    [
      {
        ...cobrandingContentMock,
        interstitialContent: '',
      } as ICobrandingContent,
      { ...brokerIdCobrandingContentMock, logo: '' } as ICobrandingContent,
      undefined,
      undefined,
    ],
  ])(
    'renders cobranding logo if content contains logo (rxGroupContent: %p, brokerIdContent: %p, type: %p, logo: %p',
    (
      rxGroupCobrandingContent: ICobrandingContent,
      brokerIdCobrandingContent: ICobrandingContent,
      logoType: typeof RemoteImageAsset | undefined,
      logoUri: string | undefined
    ) => {
      useCobrandingContentMock.mockReturnValueOnce(rxGroupCobrandingContent);
      useCobrandingContentMock.mockReturnValueOnce(brokerIdCobrandingContent);
      const testRenderer = renderer.create(
        <WelcomeModal rxGroup={rxGroupMock} brokerId={brokerIdMock} />
      );
      const logoContainer = testRenderer.root.findByProps({
        testID: 'welcomeModalLogoHolder',
      });
      const cobrandingLogo = getChildren(logoContainer)[1];

      expect(cobrandingLogo?.type || undefined).toEqual(logoType);
      expect(cobrandingLogo?.props.uri || undefined).toEqual(logoUri);
    }
  );

  it.each([
    [
      rxGroupMock,
      undefined,
      cobrandingContentMock,
      brokerIdCobrandingContentMock,
      cobrandingContentMock.interstitialContent,
    ],
    [
      undefined,
      brokerIdMock,
      { interstitialContent: '' } as ICobrandingContent,
      brokerIdCobrandingContentMock,
      brokerIdCobrandingContentMock.interstitialContent,
    ],
    [
      rxGroupMock,
      brokerIdMock,
      {
        ...cobrandingContentMock,
        interstitialContent: '',
      } as ICobrandingContent,
      brokerIdCobrandingContentMock,
      brokerIdCobrandingContentMock.interstitialContent,
    ],
  ])(
    'renders welcome paragraph as expected (rxGroup: %p, brokerId: %p, rxGroupContent: %p, brokerIdContent: %p)',
    (
      rxGroup: string | undefined,
      brokerId: string | undefined,
      rxGroupCobrandingContent: ICobrandingContent,
      brokerIdCobrandingContent: ICobrandingContent,
      welcomeParagraph: string | undefined
    ) => {
      useCobrandingContentMock.mockReturnValueOnce(rxGroupCobrandingContent);
      useCobrandingContentMock.mockReturnValueOnce(brokerIdCobrandingContent);
      const testRenderer = renderer.create(
        <WelcomeModal rxGroup={rxGroup} brokerId={brokerId} />
      );
      const container = testRenderer.root.findByProps({
        testID: 'welcomeModalView',
      });
      const markdownContainer = getChildren(container)[1];

      expect(useCobrandingContentMock).toHaveBeenNthCalledWith(1, rxGroup);
      expect(useCobrandingContentMock).toHaveBeenNthCalledWith(2, brokerId);
      expect(useContentMock).toBeCalledWith(CmsGroupKey.global, 2);
      expect(markdownContainer.props.textStyle).toEqual(
        welcomeModalStyles.contentContainerTextStyle
      );
      expect(markdownContainer.type).toEqual(MarkdownText);
      expect(markdownContainer.props.children).toEqual(welcomeParagraph);
    }
  );

  it('renders button as expected', () => {
    const testRenderer = renderer.create(
      <WelcomeModal rxGroup={rxGroupMock} />
    );
    const container = testRenderer.root.findByProps({
      testID: 'welcomeModalView',
    });
    const button = getChildren(container)[2];

    expect(button.type).toEqual(BaseButton);
    expect(button.props.isSkeleton).toEqual(globalContentMock.isContentLoading);
    expect(button.props.children).toEqual(globalContentMock.content.okButton);
  });

  it('updates URL when OK button pressed', () => {
    const testRenderer = renderer.create(
      <WelcomeModal rxGroup={rxGroupMock} />
    );
    const container = testRenderer.root.findByProps({
      testID: 'welcomeModalView',
    });

    const button = getChildren(container)[2];

    button.props.onPress();

    expect(setIsModalVisibleMock).toBeCalledWith(false);
    expect(removeSearchParamsFromUrlMock).toBeCalledWith([
      'rxgroup',
      'brokerid',
    ]);
  });
});

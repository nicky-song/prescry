// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ImageAsset } from '../../../../../../components/image-asset/image-asset';
import { LanguagePicker } from '../../../../../../components/member/pickers/language/language.picker';
import { FooterView } from '../../../../../../components/primitives/footer-view';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { getChildren } from '../../../../../../testing/test.helper';
import { goToUrl } from '../../../../../../utils/link.helper';
import { isDesktopDevice } from '../../../../../../utils/responsive-screen.helper';
import { Footer } from './footer';
import { IFooterContent, useFooterContent } from './use-footer.content';
import { getFooterStyles, IFooterStyles } from './footer.styles';
import { useFlags } from 'launchdarkly-react-client-sdk';

jest.mock('../../../../../../components/image-asset/image-asset', () => ({
  ImageAsset: () => <div />,
}));

jest.mock(
  '../../../../../../components/member/pickers/language/language.picker',
  () => ({
    LanguagePicker: () => <div />,
  })
);

jest.mock('../../../../../../utils/link.helper');
const goToUrlMock = goToUrl as jest.Mock;

jest.mock('../../../../../../utils/responsive-screen.helper');
const isDesktopDeviceMock = isDesktopDevice as jest.Mock;

jest.mock('./footer.styles');
const getFooterStylesMock = getFooterStyles as jest.Mock;

jest.mock('./use-footer.content');
const useFooterContentMock = useFooterContent as jest.Mock;

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

describe('Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getFooterStylesMock.mockReturnValue({});
    useFooterContentMock.mockReturnValue({});
    useFlagsMock.mockReturnValue({
      uselangselector: false,
    });
  });

  it.each([[false], [true]])(
    'gets footer styles (isDesktop: %p)',
    (isDesktopMock: boolean) => {
      isDesktopDeviceMock.mockReturnValue(isDesktopMock);

      renderer.create(<Footer />);

      expect(getFooterStylesMock).toHaveBeenCalledTimes(1);
      expect(getFooterStylesMock).toHaveBeenCalledWith(isDesktopMock);
    }
  );

  it('renders in FooterView ', () => {
    const footerStylesMock: Partial<IFooterStyles> = {
      footerViewStyle: {
        width: 1,
      },
    };
    getFooterStylesMock.mockReturnValue(footerStylesMock);

    const testRenderer = renderer.create(<Footer />);

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(FooterView);
    expect(container.props.testID).toEqual('Footer');
    expect(container.props.style).toEqual(footerStylesMock.footerViewStyle);
    expect(getChildren(container).length).toEqual(2);
  });

  it('renders "Powered by" image', () => {
    const footerStylesMock: Partial<IFooterStyles> = {
      prescryptiveLogoContainerViewStyle: {
        width: 1,
      },
      prescryptiveLogoImageStyle: {
        width: 2,
      },
    };
    getFooterStylesMock.mockReturnValue(footerStylesMock);

    const testRenderer = renderer.create(<Footer />);

    const footerContainer = testRenderer.root.findByProps({ testID: 'Footer' });
    const logoContainer = getChildren(footerContainer)[0];
    const prescryptiveLogoString = 'prescryptiveLogo';
    expect(logoContainer.type).toEqual(View);
    expect(logoContainer.props.testID).toEqual(prescryptiveLogoString);
    expect(logoContainer.props.style).toEqual(
      footerStylesMock.prescryptiveLogoContainerViewStyle
    );

    const logoContainerChildren = getChildren(logoContainer);
    expect(logoContainerChildren.length).toEqual(1);

    const prescryptiveLogo = logoContainerChildren[0];

    expect(prescryptiveLogo.type).toEqual(ImageAsset);
    expect(prescryptiveLogo.props.style).toEqual(
      footerStylesMock.prescryptiveLogoImageStyle
    );
    expect(prescryptiveLogo.props.name).toEqual(prescryptiveLogoString);
  });

  it('renders language picker and links container', () => {
    const footerStylesMock: Partial<IFooterStyles> = {
      languagePickerAndLinksContainerViewStyle: { width: 1 },
    };
    getFooterStylesMock.mockReturnValue(footerStylesMock);

    const testRenderer = renderer.create(<Footer />);

    const footerContainer = testRenderer.root.findByProps({ testID: 'Footer' });
    const languagePickerAndLinksContainer = getChildren(footerContainer)[1];

    expect(languagePickerAndLinksContainer.type).toEqual(View);
    expect(languagePickerAndLinksContainer.props.testID).toEqual(
      'languagePickerAndLinks'
    );
    expect(languagePickerAndLinksContainer.props.style).toEqual(
      footerStylesMock.languagePickerAndLinksContainerViewStyle
    );
    expect(getChildren(languagePickerAndLinksContainer).length).toEqual(3);
  });

  it('renders language picker', () => {
    const footerStylesMock: Partial<IFooterStyles> = {
      languagePickerContainerViewStyle: { width: 1 },
      languagePickerTextStyle: { width: 2 },
    };
    getFooterStylesMock.mockReturnValue(footerStylesMock);

    const testRenderer = renderer.create(<Footer />);

    const languagePickerAndLinksContainer = testRenderer.root.findByProps({
      testID: 'languagePickerAndLinks',
    });
    const languagePickerContainer = getChildren(
      languagePickerAndLinksContainer
    )[0];

    expect(languagePickerContainer.type).toEqual(View);
    expect(languagePickerContainer.props.testID).toEqual('languagePicker');
    expect(languagePickerContainer.props.style).toEqual(
      footerStylesMock.languagePickerContainerViewStyle
    );

    const languagePickerContainerChildren = getChildren(
      languagePickerContainer
    );

    expect(languagePickerContainerChildren.length).toEqual(1);

    const languagePicker = languagePickerContainerChildren[0];

    expect(languagePicker.type).toEqual(LanguagePicker);
    expect(languagePicker.props.textStyle).toEqual(
      footerStylesMock.languagePickerTextStyle
    );
  });

  it('does not render language picker if uselangselector is true', () => {
    useFlagsMock.mockReset();
    useFlagsMock.mockReturnValue({
      uselangselector: true,
    });
    const footerStylesMock: Partial<IFooterStyles> = {
      languagePickerContainerViewStyle: { width: 1 },
      languagePickerTextStyle: { width: 2 },
    };
    getFooterStylesMock.mockReturnValue(footerStylesMock);

    const testRenderer = renderer.create(<Footer />);

    const languagePickerAndLinksContainer = testRenderer.root.findByProps({
      testID: 'languagePickerAndLinks',
    });

    const pickerAndLinkContainerChildren = getChildren(
      languagePickerAndLinksContainer
    );
    expect(pickerAndLinkContainerChildren.length).toEqual(3);
    expect(pickerAndLinkContainerChildren[0]).toEqual(null);
  });

  it('renders Privacy Policy link', () => {
    const footerStylesMock: Partial<IFooterStyles> = {
      linkTextStyle: { width: 1 },
    };
    getFooterStylesMock.mockReturnValue(footerStylesMock);

    const footerContentMock: Partial<IFooterContent> = {
      privacyPolicyLabel: 'privacy-policy-label',
    };
    useFooterContentMock.mockReturnValue(footerContentMock);

    const testRenderer = renderer.create(<Footer />);

    const languagePickerAndLinksContainer = testRenderer.root.findByProps({
      testID: 'languagePickerAndLinks',
    });
    const privacyPolicyLink = getChildren(languagePickerAndLinksContainer)[1];

    expect(privacyPolicyLink.type).toEqual(BaseText);
    expect(privacyPolicyLink.props.style).toEqual(
      footerStylesMock.linkTextStyle
    );
    expect(privacyPolicyLink.props.onPress).toEqual(expect.any(Function));
    expect(privacyPolicyLink.props.children).toEqual(
      footerContentMock.privacyPolicyLabel
    );
  });

  it('calls goToUrl when privacy policy link is pressed', () => {
    const testRenderer = renderer.create(<Footer />);

    const languagePickerAndLinksContainer = testRenderer.root.findByProps({
      testID: 'languagePickerAndLinks',
    });
    const privacyPolicyLink = getChildren(languagePickerAndLinksContainer)[1];

    privacyPolicyLink.props.onPress();

    const expectedPrivacyUrlLink = 'https://prescryptive.com/privacy-policy/';

    expect(goToUrlMock).toHaveBeenCalledWith(expectedPrivacyUrlLink);
  });

  it('renders Terms and Conditions link', () => {
    const footerStylesMock: Partial<IFooterStyles> = {
      linkTextStyle: { width: 1 },
      termsAndConditionsLinkTextStyle: { height: 1 },
    };
    getFooterStylesMock.mockReturnValue(footerStylesMock);

    const footerContentMock: Partial<IFooterContent> = {
      termsAndConditionsLabel: 'terms-and-conditions-label',
    };
    useFooterContentMock.mockReturnValue(footerContentMock);

    const testRenderer = renderer.create(<Footer />);

    const languagePickerAndLinksContainer = testRenderer.root.findByProps({
      testID: 'languagePickerAndLinks',
    });
    const termsAndConditionsLink = getChildren(
      languagePickerAndLinksContainer
    )[2];

    expect(termsAndConditionsLink.type).toEqual(BaseText);
    expect(termsAndConditionsLink.props.style).toEqual([
      footerStylesMock.linkTextStyle,
      footerStylesMock.termsAndConditionsLinkTextStyle,
    ]);
    expect(termsAndConditionsLink.props.onPress).toEqual(expect.any(Function));
    expect(termsAndConditionsLink.props.children).toEqual(
      footerContentMock.termsAndConditionsLabel
    );
  });

  it('calls goToUrl when privacy policy link is pressed', () => {
    const testRenderer = renderer.create(<Footer />);

    const languagePickerAndLinksContainer = testRenderer.root.findByProps({
      testID: 'languagePickerAndLinks',
    });
    const termsAndConditionsLink = getChildren(
      languagePickerAndLinksContainer
    )[2];

    termsAndConditionsLink.props.onPress();

    const expectedTermsAndConditionsUrlLink =
      'https://prescryptive.com/terms-of-use/';

    expect(goToUrlMock).toHaveBeenCalledWith(expectedTermsAndConditionsUrlLink);
  });
});

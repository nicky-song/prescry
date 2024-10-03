// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  goToTermsAndConditionsUrl,
  goToPrivacyPolicyUrl,
} from '../../../../utils/navigation-helpers/url-helper-functions';
import { getChildren } from '../../../../testing/test.helper';
import { BaseText } from '../../../text/base-text/base-text';
import { TermsConditionsAndPrivacyLinks } from './terms-conditions-and-privacy.links';
import { termsConditionsAndPrivacyLinksStyles } from './terms-conditions-and-privacy.links.styles';
import { InlineLink } from '../inline/inline.link';
import { ITestContainer } from '../../../../testing/test.container';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';

jest.mock('../../../../utils/navigation-helpers/url-helper-functions');
const goToTermsAndConditionsUrlMock = goToTermsAndConditionsUrl as jest.Mock;
const goToPrivacyPolicyUrlMock = goToPrivacyPolicyUrl as jest.Mock;

jest.mock('../inline/inline.link', () => ({
  InlineLink: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock(
  '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

describe('TermsConditionsAndPrivacyLinks', () => {
  const termsAndConditionsLabelMock = 't-&-c-mock';
  const privacyPolicyLabelMock = 'privacy-policy-mock';

  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: {
        termsAndConditions: termsAndConditionsLabelMock,
        privacyPolicy: privacyPolicyLabelMock,
      },
      isContentLoading: false,
    });
  });

  it('renders in view container', () => {
    const testRenderer = renderer.create(<TermsConditionsAndPrivacyLinks />);

    const linkContainer = testRenderer.root.children[0] as ReactTestInstance;

    expect(linkContainer.type).toEqual(View);
    expect(getChildren(linkContainer).length).toEqual(3);
  });

  it('renders Terms and Conditions link - single line', () => {
    const testRenderer = renderer.create(<TermsConditionsAndPrivacyLinks />);

    const linkContainer = testRenderer.root.findByType(View);
    const termsAndConditionsLink = getChildren(linkContainer)[0];

    expect(termsAndConditionsLink.type).toEqual(InlineLink);
    expect(termsAndConditionsLink.props.testID).toEqual('onTermsAndCondition');
    expect(termsAndConditionsLink.props.children).toEqual(
      termsAndConditionsLabelMock
    );
    expect(termsAndConditionsLink.props.textStyle).toEqual(
      termsConditionsAndPrivacyLinksStyles.textStyle
    );
    expect(termsAndConditionsLink.props.onPress).toEqual(
      goToTermsAndConditionsUrlMock
    );
  });

  it('renders Terms and Conditions link - multi line', () => {
    const testRenderer = renderer.create(<TermsConditionsAndPrivacyLinks 
      isMultiLine={true}
    />);

    const linkContainer = testRenderer.root.findByType(View);
    const termsAndConditionsLink = getChildren(linkContainer)[0];

    expect(termsAndConditionsLink.type).toEqual(InlineLink);
    expect(termsAndConditionsLink.props.testID).toEqual('onTermsAndCondition');
    expect(termsAndConditionsLink.props.children).toEqual(
      termsAndConditionsLabelMock
    );
    expect(termsAndConditionsLink.props.textStyle).toEqual([
      termsConditionsAndPrivacyLinksStyles.textStyle,
      termsConditionsAndPrivacyLinksStyles.multiLineTextStyle
    ]);
    expect(termsAndConditionsLink.props.onPress).toEqual(
      goToTermsAndConditionsUrlMock
    );
  });

  it('renders link divider - single line', () => {
    const testRenderer = renderer.create(<TermsConditionsAndPrivacyLinks />);

    const linkContainer = testRenderer.root.findByType(View);
    const linkDivider = getChildren(linkContainer)[1];

    expect(linkDivider.type).toEqual(BaseText);
  });

  it('does not render link divider - multi line', () => {
    const testRenderer = renderer.create(<TermsConditionsAndPrivacyLinks
      isMultiLine={true}
    />);

    const linkContainer = testRenderer.root.findByType(View);
    const noLinkDivider = getChildren(linkContainer)[1];

    expect(noLinkDivider).toBeNull();
  });

  it('renders Privacy Policy link - single line', () => {
    const testRenderer = renderer.create(<TermsConditionsAndPrivacyLinks />);

    const linkContainer = testRenderer.root.findByType(View);
    const privacyPolicyLink = getChildren(linkContainer)[2];

    expect(privacyPolicyLink.type).toEqual(InlineLink);
    expect(privacyPolicyLink.props.testID).toEqual('onPrivacyPolicy');
    expect(privacyPolicyLink.props.children).toEqual(privacyPolicyLabelMock);
    expect(privacyPolicyLink.props.textStyle).toEqual(
      termsConditionsAndPrivacyLinksStyles.textStyle
    );
    expect(privacyPolicyLink.props.onPress).toEqual(goToPrivacyPolicyUrlMock);
  });

  it('renders Privacy Policy link - multi line', () => {
    const testRenderer = renderer.create(<TermsConditionsAndPrivacyLinks 
      isMultiLine={true}
    />);

    const linkContainer = testRenderer.root.findByType(View);
    const privacyPolicyLink = getChildren(linkContainer)[2];

    expect(privacyPolicyLink.type).toEqual(InlineLink);
    expect(privacyPolicyLink.props.testID).toEqual('onPrivacyPolicy');
    expect(privacyPolicyLink.props.children).toEqual(privacyPolicyLabelMock);
    expect(privacyPolicyLink.props.textStyle).toEqual(
      termsConditionsAndPrivacyLinksStyles.textStyle
    );
    expect(privacyPolicyLink.props.onPress).toEqual(goToPrivacyPolicyUrlMock);
  });
});

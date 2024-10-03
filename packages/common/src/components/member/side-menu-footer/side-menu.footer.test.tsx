// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { getChildren } from '../../../testing/test.helper';
import { BaseText } from '../../text/base-text/base-text';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { TermsConditionsAndPrivacyLinks } from '../links/terms-conditions-and-privacy/terms-conditions-and-privacy.links';
import { SideMenuFooter } from './side-menu.footer';
import { sideMenuFooterStyles } from './side-menu.footer.styles';

jest.mock(
  '../links/terms-conditions-and-privacy/terms-conditions-and-privacy.links',
  () => ({
    TermsConditionsAndPrivacyLinks: () => <div />,
  })
);

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

describe('SideMenuFooter', () => {
  const copyRightTextMock = 'copyright-text-mock';
  const rightsReservedTextMock = 'rights-reserved-text-mock';

  beforeEach(() => {
    useContentMock.mockReturnValue({
      content: {
        copyRightText: copyRightTextMock,
        rightsReservedText: rightsReservedTextMock,
      },
      isContentLoading: false,
    });
  });

  it('renders in View container', () => {
    const testRenderer = renderer.create(<SideMenuFooter />);

    const viewContainer = testRenderer.root.children[0] as ReactTestInstance;

    expect(viewContainer.type).toEqual(View);
    expect(viewContainer.props.style).toEqual(
      sideMenuFooterStyles.sideMenuFooterContainerViewStyle
    );
    expect(getChildren(viewContainer).length).toEqual(3);
  });

  it('renders policy links', () => {
    const testRenderer = renderer.create(<SideMenuFooter />);

    const viewContainer = testRenderer.root.findByType(View);
    const policyLinks = getChildren(viewContainer)[0];

    expect(policyLinks.type).toEqual(TermsConditionsAndPrivacyLinks);
    expect(policyLinks.props.viewStyle).toEqual(
      sideMenuFooterStyles.termsConditionsAndPrivacyLinksStyles
    );
    expect(policyLinks.props.isMultiLine).toEqual(true);
  });

  it('renders copyright text', () => {
    const testRenderer = renderer.create(<SideMenuFooter />);

    const viewContainer = testRenderer.root.findByType(View);
    const copyrightText = getChildren(viewContainer)[1];

    expect(copyrightText.type).toEqual(ProtectedBaseText);
    expect(copyrightText.props.style).toEqual(
      sideMenuFooterStyles.copyrightTextStyle
    );
    expect(copyrightText.props.children).toEqual(copyRightTextMock);
  });

  it('renders rights reserved text', () => {
    const testRenderer = renderer.create(<SideMenuFooter />);

    const viewContainer = testRenderer.root.findByType(View);
    const rightsReservedText = getChildren(viewContainer)[2];

    expect(rightsReservedText.type).toEqual(BaseText);
    expect(rightsReservedText.props.style).toEqual(
      sideMenuFooterStyles.rightsReservedTextStyle
    );
    expect(rightsReservedText.props.children).toEqual(rightsReservedTextMock);
  });
});

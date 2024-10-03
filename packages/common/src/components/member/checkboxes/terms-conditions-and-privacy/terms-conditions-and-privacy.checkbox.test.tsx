// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { ISignInContent } from '../../../../models/cms-content/sign-in.ui-content';
import { getChildren } from '../../../../testing/test.helper';
import {
  goToPrivacyPolicyUrl,
  goToTermsAndConditionsUrl,
} from '../../../../utils/navigation-helpers/url-helper-functions';
import { LinkCheckbox } from '../link/link.checkbox';
import { TermsConditionsAndPrivacyCheckbox } from './terms-conditions-and-privacy.checkbox';

jest.mock('../link/link.checkbox', () => ({
  LinkCheckbox: () => <div />,
}));

jest.mock('../../../../utils/navigation-helpers/url-helper-functions');
const goToTermsAndConditionsUrlMock = goToTermsAndConditionsUrl as jest.Mock;
const goToPrivacyPolicyUrlMock = goToPrivacyPolicyUrl as jest.Mock;

jest.mock(
  '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const uiContentMock: Partial<ISignInContent> = {
  termsAndConditionsCheckboxLabel: 't-&-c-checkbox-label-mock',
};

describe('TermsConditionsAndPrivacyCheckbox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useContentMock.mockReturnValue({
      isContentLoading: false,
      content: uiContentMock,
    });
  });

  it('renders in View container', () => {
    const customViewStyle: ViewStyle = { width: 1 };
    const testRenderer = renderer.create(
      <TermsConditionsAndPrivacyCheckbox
        viewStyle={customViewStyle}
        onPress={jest.fn()}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.style).toEqual(customViewStyle);
    expect(container.props.testID).toEqual('chktermsAndConditions');
    expect(getChildren(container).length).toEqual(1);
  });

  it('renders checkbox', () => {
    const onPressMock = jest.fn();
    const testRenderer = renderer.create(
      <TermsConditionsAndPrivacyCheckbox onPress={onPressMock} />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;
    const checkbox = getChildren(container)[0];

    expect(checkbox.type).toEqual(LinkCheckbox);
    expect(checkbox.props.checkboxValue).toEqual('acceptTermAndCondition');
    expect(checkbox.props.markdown).toEqual(
      uiContentMock.termsAndConditionsCheckboxLabel
    );
    expect(checkbox.props.onCheckboxPress).toEqual(onPressMock);
    expect(checkbox.props.onLinkPress).toEqual(expect.any(Function));

    expect(checkbox.props.testID).toBe(`termsAndConditionsCheck`);
  });

  it('handles "Terms and Conditions" link press', () => {
    const testRenderer = renderer.create(
      <TermsConditionsAndPrivacyCheckbox onPress={jest.fn()} />
    );

    const checkbox = testRenderer.root.findByType(LinkCheckbox);
    const useDefaultHandler = checkbox.props.onLinkPress('terms');

    expect(goToTermsAndConditionsUrlMock).toHaveBeenCalled();
    expect(useDefaultHandler).toEqual(false);
  });

  it('handles "Privacy Policy" link press', () => {
    const testRenderer = renderer.create(
      <TermsConditionsAndPrivacyCheckbox onPress={jest.fn()} />
    );

    const checkbox = testRenderer.root.findByType(LinkCheckbox);
    const useDefaultHandler = checkbox.props.onLinkPress('privacy');

    expect(goToPrivacyPolicyUrlMock).toHaveBeenCalled();
    expect(useDefaultHandler).toEqual(false);
  });
});

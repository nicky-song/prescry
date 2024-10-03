// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View } from 'react-native';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ISignInContent } from '../../../../models/cms-content/sign-in.ui-content';
import { PrimaryCheckBox } from '../../../checkbox/primary-checkbox/primary-checkbox';
import { AttestAuthorizationCheckbox } from './attest-authorization.checkbox';
import { attestAuthorizationCheckboxStyles as styles } from './attest-authorization.checkbox.styles';
import { getChildren } from '../../../../testing/test.helper';

jest.mock(
  '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../../../checkbox/primary-checkbox/primary-checkbox', () => ({
  PrimaryCheckBox: () => <div />,
}));

describe('AttestAuthorizationCheckbox', () => {
  const contentMock: Partial<ISignInContent> = {
    attestAuthorizationCheckboxLabel:
      'attest-authorization-checkbox-label-mock',
  };

  const onPressMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({ content: contentMock });
  });

  it('calls useContent with expected props', () => {
    renderer.create(<AttestAuthorizationCheckbox onPress={onPressMock} />);

    expect(useContentMock).toHaveBeenCalledTimes(1);

    const groupKey = CmsGroupKey.signIn;

    expect(useContentMock).toHaveBeenNthCalledWith(1, groupKey, 2);
  });

  it('renders as View', () => {
    const viewStyleMock = {};

    const testRenderer = renderer.create(
      <AttestAuthorizationCheckbox
        onPress={onPressMock}
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual(viewStyleMock);
    expect(getChildren(view).length).toEqual(1);
  });

  it('renders PrimaryCheckBox with parent View', () => {
    const testRenderer = renderer.create(
      <AttestAuthorizationCheckbox onPress={onPressMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const primaryCheckBox = getChildren(view)[0];

    expect(primaryCheckBox.type).toEqual(PrimaryCheckBox);
    expect(primaryCheckBox.props.checkBoxValue).toEqual(
      'attestAuthorizationCheckbox'
    );
    expect(primaryCheckBox.props.checkBoxLabel).toEqual(
      contentMock.attestAuthorizationCheckboxLabel
    );
    expect(primaryCheckBox.props.onPress).toEqual(onPressMock);
    expect(primaryCheckBox.props.checkBoxImageStyle).toEqual(
      styles.checkBoxImageStyle
    );
  });
});
